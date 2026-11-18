import * as THREE from 'three'

/**
 * STAGE 1 — Scene, camera, renderer, render loop
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

// ---------------------------------------------------------------------------
// Placeholder object — stands in for the shoe until we load the glTF (stage 2)
// Mesh = Geometry (the shape) + Material (how its surface looks)
// MeshNormalMaterial colours faces by their direction, so it needs no lights.
// ---------------------------------------------------------------------------
const placeholder = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 0.6, 0.7),
  new THREE.MeshNormalMaterial()
)
scene.add(placeholder)

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
camera.lookAt(placeholder.position)
scene.add(camera)

// ---------------------------------------------------------------------------
// Renderer — turns scene + camera into pixels on the canvas
// ---------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

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
  placeholder.rotation.y = elapsed * 0.5
  placeholder.position.y = Math.sin(elapsed * 1.5) * 0.05

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

window.requestAnimationFrame(tick)
