// Threads WebGL Background Component
// Creates an interactive wave animation using Three.js

let threadsAnimationId = null;
let threadsRenderer = null;
let threadsScene = null;
let threadsCamera = null;
let threadsMesh = null;
let threadsMouseX = 0.5;
let threadsMouseY = 0.5;
let threadsTime = 0;

function initThreads(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Setup Scene
    threadsScene = new THREE.Scene();
    threadsCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    threadsCamera.position.z = 1;
    
    // Setup Renderer with transparency
    threadsRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    threadsRenderer.setSize(container.clientWidth, container.clientHeight);
    threadsRenderer.setClearColor(0x000000, 0);
    container.appendChild(threadsRenderer.domElement);
    
    // Create custom shader material for thread lines effect
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_PointSize = 1.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
    
    const fragmentShader = `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        varying vec2 vUv;
        
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
        }
        
        void main() {
            vec2 uv = vUv;
            uv.x *= uResolution.x / uResolution.y;
            
            float lines = 0.0;
            float offset = uTime * 0.2;
            
            for (float i = 0.0; i < 40.0; i++) {
                float p = i / 40.0;
                float yPos = 0.5 + (p - 0.5) * 0.8;
                yPos += sin(uv.x * 3.14159 * 2.0 * 2.0 + offset + p * 10.0) * 0.05 * (0.5 + uMouse.x);
                yPos += cos(uv.x * 3.14159 * 3.0 + offset * 1.5 + p * 15.0) * 0.03;
                
                float thickness = 0.008;
                float line = 1.0 - smoothstep(yPos - thickness, yPos, uv.y);
                line -= smoothstep(yPos, yPos + thickness, uv.y);
                line *= (1.0 - p * 0.5);
                line *= (0.5 + 0.5 * sin(uv.x * 20.0 + uTime * 5.0));
                
                lines += line;
            }
            
            float intensity = clamp(lines * 0.8, 0.0, 1.0);
            vec3 color = vec3(1.0, 1.0, 1.0) * intensity;
            
            gl_FragColor = vec4(color, intensity * 0.6);
        }
    `;
    
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) }
        },
        transparent: true
    });
    
    threadsMesh = new THREE.Mesh(geometry, material);
    threadsScene.add(threadsMesh);
    
    // Mouse interaction
    function handleMouseMove(e) {
        const rect = container.getBoundingClientRect();
        threadsMouseX = (e.clientX - rect.left) / rect.width;
        threadsMouseY = 1.0 - (e.clientY - rect.top) / rect.height;
        material.uniforms.uMouse.value.set(threadsMouseX, threadsMouseY);
    }
    
    function handleResize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        threadsRenderer.setSize(width, height);
        material.uniforms.uResolution.value.set(width, height);
    }
    
    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    function animate() {
        threadsTime += 0.016;
        material.uniforms.uTime.value = threadsTime;
        threadsRenderer.render(threadsScene, threadsCamera);
        threadsAnimationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Cleanup function
    return function cleanup() {
        if (threadsAnimationId) cancelAnimationFrame(threadsAnimationId);
        window.removeEventListener('resize', handleResize);
        if (container && threadsRenderer) {
            container.removeEventListener('mousemove', handleMouseMove);
            if (threadsRenderer.domElement && container.contains(threadsRenderer.domElement)) {
                container.removeChild(threadsRenderer.domElement);
            }
        }
        if (threadsRenderer) threadsRenderer.dispose();
    };
}