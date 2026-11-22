import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

/**
 * STAGE 2 — Scene, camera, renderer, render loop
 * Course topics: "Basic Scene", "Transform Objects", "Animations",
 *                "Cameras", "Fullscreen and resizing"
 */

// ---------------------------------------------------------------------------
// Canvas — the <canvas> element WebGL will draw into
// ---------------------------------------------------------------------------
const canvas = document.querySelector('canvas.webgl')

// ---------------------------------------------------------------------------
// Scene — a container (scene graph) holding everything we want to render
// ---------------------------------------------------------------------------
const scene = new THREE.Scene()
scene.background = new THREE.Color('#0b0d12')

const ambientLight = new THREE.AmbientLight('#ffffff', 0.5) // soft white light
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// ---------------------------------------------------------------------------
// Placeholder object — stands in for the shoe until we load the glTF (stage 2)
// Mesh = Geometry (the shape) + Material (how its surface looks)
// MeshNormalMaterial colours faces by their direction, so it needs no lights.
// ---------------------------------------------------------------------------

const gltfLoader = new GLTFLoader()
let shoe = null

gltfLoader.load('/models/shoe.glb', (gltf) => {
  const model = gltf.scene
  const box = new THREE.Box3().setFromObject(model)
  const size = box.getSize(new THREE.Vector3())
  const longest = Math.max(size.x, size.y, size.z)
  model.scale.setScalar(2 / longest) // scale to fit in a 1x1x1 box

  box.setFromObject(model) // recalc box after scaling
  const center = box.getCenter(new THREE.Vector3())
  model.position.sub(center) // center the model at the origin

  shoe = new THREE.Group()
  shoe.add(model)
  scene.add(shoe)
})


// ---------------------------------------------------------------------------
// Sizes — keep the canvas full-window and track the viewport
// ---------------------------------------------------------------------------
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
}

// ---------------------------------------------------------------------------
// Camera — PerspectiveCamera(fov, aspect, near, far)
// ---------------------------------------------------------------------------
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2.5, 1.5, 4)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

// ---------------------------------------------------------------------------
// Renderer — turns scene + camera into pixels on the canvas
// ---------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 1
controls.enablePan = false
controls.minDistance = 2.5
controls.maxDistance = 8

controls.addEventListener('start', () => {
  controls.autoRotate = false
})


// ---------------------------------------------------------------------------
// Resize — update sizes, camera aspect, and renderer when the window changes
// ---------------------------------------------------------------------------
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix() // required after changing camera properties

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})

// ---------------------------------------------------------------------------
// Render loop — runs every frame (~60 or 120 fps depending on the screen)
// Timer gives time-based values so animation speed is frame-rate independent.
// ---------------------------------------------------------------------------
const timer = new THREE.Timer()
timer.connect(document) // pauses the delta while the tab is hidden

const tick = (timestamp) => {
  timer.update(timestamp)
  const elapsed = timer.getElapsed() // seconds since start
  // Animate: slow turntable spin + gentle float
  if (shoe) {
    shoe.position.y = Math.sin(elapsed * 1.5) * 0.05
  }

  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

window.requestAnimationFrame(tick)
