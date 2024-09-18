import './style.css';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Three.js Code
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg")
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// 3D Geometry Code
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0x5e4b56});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus); // add the geometry to the scene

// creating a light source inorder to see our 3d geometry
const point_light = new THREE.PointLight(0xfcd0e1);
point_light.position.set(5,5,5);

const ambient_light = new THREE.AmbientLight(0xafd2e9);
scene.add(point_light, ambient_light)

const controls = new OrbitControls(camera, renderer.domElement);

// helpers
const light_helper = new THREE.PointLightHelper(point_light);
const grid_helper = new THREE.GridHelper(200, 50);
scene.add(light_helper, grid_helper);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xfff275 });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar); // randomly generate 200 stars with unique positions

// add textures to scene
const space_texture = new THREE.TextureLoader().load("space.jpg");
scene.background = space_texture;

// texture mapping
const profile_texture = new THREE.TextureLoader().load("favicon.png");

const profile = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: profile_texture})
);

scene.add(profile);

// geometry with normal mapped textures
const moon_texture = new THREE.TextureLoader().load("moon.jpg");
const normal_texture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moon_texture,
    normalMap: normal_texture
  })
);

scene.add(moon)
moon.position.z = 30;
moon.position.setX(-10);

profile.position.z = -5;
profile.position.x = 2;

function move_camera(){
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  profile.rotation.y += 0.01;
  profile.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = move_camera;
move_camera();

// recursive loop to update the browser page on any change to the page
function animation_loop(){
  requestAnimationFrame(animation_loop);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animation_loop();