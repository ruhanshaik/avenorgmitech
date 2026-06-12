// Silk WebGL Background - Avenor Hero Section
import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

export function initSilk(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas element not found:', canvasId);
        return;
    }
    
    // Get container dimensions
    const container = canvas.parentElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Setup Scene
    const scene = new THREE.Scene();
    scene.background = null;
    
    // Setup Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);
    
    // Setup Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create Silk Geometry - Torus Knot for organic flow
    const geometry = new THREE.TorusKnotGeometry(1.1, 0.28, 400, 80, 3, 4);
    
    // Custom Shader Material
    const vertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        
        void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Wave distortion
            float waveX = sin(pos.x * 2.5 + uTime) * 0.06;
            float waveY = cos(pos.y * 2.5 + uTime * 1.2) * 0.06;
            float waveZ = sin(pos.z * 3.0 + uTime * 0.9) * 0.06;
            
            pos.x += waveX;
            pos.y += waveY;
            pos.z += waveZ;
            
            vPosition = pos;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 1.0;
            gl_Position = projectionMatrix * mvPosition;
        }
    `;
    
    const fragmentShader = `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            // Create flowing color effect
            float r = sin(vUv.x * 6.0 + uTime) * 0.4 + 0.5;
            float g = cos(vUv.y * 6.0 + uTime * 1.1) * 0.4 + 0.5;
            float b = sin((vUv.x + vUv.y) * 5.0 + uTime * 0.8) * 0.4 + 0.5;
            
            // Base color #7B7481
            vec3 baseColor = vec3(0.482, 0.455, 0.506);
            vec3 dynamicColor = vec3(r, g, b);
            
            // Blend
            vec3 finalColor = mix(baseColor, dynamicColor, 0.35);
            
            // Shimmer
            float shimmer = sin(vPosition.x * 4.0 + uTime * 3.0) * 0.15;
            shimmer += cos(vPosition.y * 4.0 + uTime * 2.5) * 0.15;
            finalColor += vec3(shimmer * 0.25);
            
            // Glow effect
            float glow = 0.6 + sin(uTime * 1.5) * 0.1;
            
            gl_FragColor = vec4(finalColor, 0.65);
        }
    `;
    
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(0x7B7481) }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Dynamic point lights
    const light1 = new THREE.PointLight(0x7B7481, 0.6);
    light1.position.set(2, 2, 2);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(0xffffff, 0.4);
    light2.position.set(-1.5, -1, 2);
    scene.add(light2);
    
    const backLight = new THREE.PointLight(0x7B7481, 0.5);
    backLight.position.set(0, 0, -3);
    scene.add(backLight);
    
    // Particle system for sparkle
    const particleCount = 1200;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 14;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x7B7481,
        size: 0.02,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Animation
    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        
        time += 0.012;
        
        material.uniforms.uTime.value = time;
        
        // Smooth rotation
        torusKnot.rotation.x = Math.sin(time * 0.2) * 0.25;
        torusKnot.rotation.y = time * 0.25;
        torusKnot.rotation.z = Math.sin(time * 0.15) * 0.15;
        
        // Pulse scale
        const scale = 1 + Math.sin(time * 0.7) * 0.03;
        torusKnot.scale.set(scale, scale, scale);
        
        // Rotate particles
        particles.rotation.y = time * 0.03;
        particles.rotation.x = Math.sin(time * 0.08) * 0.08;
        
        // Move lights
        light1.position.x = 2 + Math.sin(time * 0.6) * 0.4;
        light1.position.y = 2 + Math.cos(time * 0.5) * 0.4;
        light2.position.x = -1.5 + Math.sin(time * 0.8) * 0.3;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', onWindowResize);
    
    function onWindowResize() {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    }
    
    return function cleanup() {
        window.removeEventListener('resize', onWindowResize);
        renderer.dispose();
    };
}