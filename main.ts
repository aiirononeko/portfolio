import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let model: THREE.Object3D | null = null;
let edgeMat: LineMaterial;
let screenMesh: THREE.Mesh | null = null;

const clock = new THREE.Clock();

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE SETUP
// ═══════════════════════════════════════════════════════════════════════════════

function initThree() {
    const canvas = document.getElementById('three-canvas') as HTMLCanvasElement;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Scene & Environment
    scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    scene.environment = pmrem.fromScene(new RoomEnvironment()).texture;
    pmrem.dispose();

    // Camera
    camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
    camera.position.set(0, 0.5, 4.5);

    // Controls
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = false;
    controls.minPolarAngle = Math.PI * 0.3;
    controls.maxPolarAngle = Math.PI * 0.62;

    // Lighting
    scene.add(new THREE.AmbientLight(0x405570, 2.0));

    const keyLight = new THREE.DirectionalLight(0xc0d8f0, 2.5);
    keyLight.position.set(3, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x90a8c8, 1.5);
    fillLight.position.set(-4, 2, 4);
    scene.add(fillLight);

    handleResize();
    window.addEventListener('resize', handleResize);

    // Load GBA model
    loadModel();
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL LOADING
// ═══════════════════════════════════════════════════════════════════════════════

function loadModel() {
    const loader = new GLTFLoader();
    const fill = document.querySelector('.loader-fill') as HTMLElement | null;

    loader.load(
        '/gba.glb',
        (gltf) => {
            model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());

            model.position.sub(center);
            model.rotation.y = -Math.PI / 2;
            model.position.y += 0.05;

            const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scaleFactor = 1.5 / maxDim;
            model.scale.setScalar(scaleFactor);

            // ─────────────────────────────────────────────────────────────────
            // Materials
            // ─────────────────────────────────────────────────────────────────
            function makeBodyMat(opts: Record<string, any> = {}) {
                return new THREE.MeshPhysicalMaterial({
                    color: opts.color ?? 0x494949,
                    metalness: opts.metalness ?? 0.1,
                    roughness: opts.roughness ?? 0.35,
                    envMapIntensity: 0.5,
                    transparent: true,
                    opacity: opts.opacity ?? 0.03,
                    side: THREE.DoubleSide,
                    clearcoat: opts.clearcoat ?? 0.3,
                    clearcoatRoughness: 0.15,
                    specularIntensity: opts.specularIntensity ?? 0.3,
                    specularColor: new THREE.Color(opts.specColor || 0xa0a0a8),
                    depthWrite: false,
                });
            }

            const bodyShell = makeBodyMat();
            const bodyMid = makeBodyMat({
                color: 0x858590,
                roughness: 0.25,
                opacity: 0.30,
                clearcoat: 0.5,
            });
            const bodyDetail = makeBodyMat({
                color: 0x9a9aa0,
                roughness: 0.5,
                opacity: 0.42,
                metalness: 0.18,
            });

            const screenMat = new THREE.MeshPhysicalMaterial({
                color: 0x1a1a1a,
                metalness: 0.0,
                roughness: 0.09,
                emissive: 0x111111,
                emissiveIntensity: 0.15,
                envMapIntensity: 0.03,
                side: THREE.DoubleSide,
                clearcoat: 1.0,
                clearcoatRoughness: 0.03,
                specularIntensity: 1.2,
                specularColor: new THREE.Color(0xcccccc),
                depthWrite: true,
            });

            edgeMat = new LineMaterial({
                color: 0x222222,
                linewidth: 0.8,
                transparent: true,
                opacity: 0.25,
                depthWrite: false,
                depthTest: true,
                worldUnits: false,
                resolution: new THREE.Vector2(
                    renderer.domElement.width,
                    renderer.domElement.height
                ),
            });

            // ─────────────────────────────────────────────────────────────────
            // Mesh Processing
            // ─────────────────────────────────────────────────────────────────
            const bodyParts: { mesh: THREE.Mesh; vol: number }[] = [];

            model.traverse((child) => {
                if (!(child instanceof THREE.Mesh)) return;
                const n = (child.name || '').toLowerCase();

                if (n === 'screen') {
                    child.material = screenMat;
                    child.renderOrder = 1;
                    screenMesh = child;
                } else {
                    child.geometry.computeBoundingBox();
                    const s = child.geometry.boundingBox!.getSize(new THREE.Vector3());
                    bodyParts.push({ mesh: child, vol: s.x * s.y * s.z });
                }
            });

            // Assign materials by volume (3 tiers)
            bodyParts.sort((a, b) => b.vol - a.vol);
            const t1 = Math.ceil(bodyParts.length / 3);
            const t2 = Math.ceil(bodyParts.length * 2 / 3);

            bodyParts.forEach((p, i) => {
                p.mesh.material = i < t1 ? bodyShell :
                    i < t2 ? bodyMid : bodyDetail;
            });

            scene.add(model);

            // Create edge lines
            const meshes: THREE.Mesh[] = [];
            model.traverse((child) => {
                if (child instanceof THREE.Mesh) meshes.push(child);
            });

            meshes.forEach((child) => {
                const edges = new THREE.EdgesGeometry(child.geometry, 8);
                const lineGeo = new LineSegmentsGeometry().fromEdgesGeometry(edges);
                const line = new LineSegments2(lineGeo, edgeMat);

                line.position.copy(child.position);
                line.quaternion.copy(child.quaternion);
                line.scale.copy(child.scale);
                line.renderOrder = 3;
                line.computeLineDistances();

                child.parent!.add(line);
            });

            // Fade out loader
            if (fill) fill.style.width = '100%';
            setTimeout(() => {
                const loaderEl = document.getElementById('loader');
                if (loaderEl) loaderEl.classList.add('hidden');
            }, 600);
        },
        (xhr) => {
            if (fill && xhr.total > 0) {
                fill.style.width = (xhr.loaded / xhr.total * 100) + '%';
            }
        },
        (err) => {
            console.error('Model load error:', err);
            const loaderText = document.querySelector('.loader-text') as HTMLElement | null;
            if (loaderText) loaderText.textContent = 'LOAD ERROR';
        }
    );
}

function handleResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (!w || !h) return;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);

    if (edgeMat) edgeMat.resolution.set(w, h);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION
// ═══════════════════════════════════════════════════════════════════════════════

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (model) {
        model.position.y = 0.05 + Math.sin(t * 0.7) * 0.025;
    }

    controls.update();
    renderer.render(scene, camera);
}

// ═══════════════════════════════════════════════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════════════════════════════════════════════

let isDarkMode = false;

function applyTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = 'LIGHT';
        themeToggle.classList.add('active');
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.textContent = 'DARK';
        themeToggle.classList.remove('active');
    }
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('portfolio-theme');
isDarkMode = savedTheme === 'dark';
applyTheme();

// Theme toggle event listener
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('portfolio-theme', isDarkMode ? 'dark' : 'light');
        applyTheme();
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════════════════

initThree();
animate();
