const canvas = document.getElementById("solarCanvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
const pointLight = new THREE.PointLight(0xffffff, 1);
scene.add(ambientLight, pointLight);

// Sun
const sunTexture = new THREE.TextureLoader().load('assets/textures/sun.jpg');
const sun = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({ map: sunTexture }));
scene.add(sun);

// Planets data
const planetsData = [
  { name: "Mercury", size: 0.3, distance: 4, texture: "mercury.jpg", speed: 0.04 },
  { name: "Venus", size: 0.5, distance: 6, texture: "venus.jpg", speed: 0.015 },
  { name: "Earth", size: 0.6, distance: 8, texture: "earth.jpg", speed: 0.01 },
  { name: "Mars", size: 0.4, distance: 10, texture: "mars.jpg", speed: 0.008 },
  { name: "Jupiter", size: 1.1, distance: 14, texture: "jupiter.jpg", speed: 0.005 },
  { name: "Saturn", size: 1, distance: 18, texture: "saturn.jpg", speed: 0.004 },
  { name: "Uranus", size: 0.8, distance: 22, texture: "uranus.jpg", speed: 0.002 },
  { name: "Neptune", size: 0.7, distance: 26, texture: "neptune.jpg", speed: 0.001 },
];

const planets = [];
const speedControls = {};
const orbitGroups = [];

// Create Planets
planetsData.forEach(data => {
  const texture = new THREE.TextureLoader().load(`assets/textures/${data.texture}`);
  const geometry = new THREE.SphereGeometry(data.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const planet = new THREE.Mesh(geometry, material);

  const orbit = new THREE.Object3D();
  orbit.add(planet);
  planet.position.x = data.distance;

  scene.add(orbit);
  orbitGroups.push({ group: orbit, speed: data.speed });
  planets.push(planet);

  // Controls
  const control = document.createElement("div");
  control.innerHTML = `
    <label>${data.name} Speed: 
      <input type="range" min="0" max="0.1" step="0.001" value="${data.speed}" id="${data.name}">
    </label>
  `;
  document.getElementById("controls").appendChild(control);

  speedControls[data.name] = document.getElementById(data.name);
});

camera.position.z = 40;

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  orbitGroups.forEach((planetGroup, index) => {
    const name = planetsData[index].name;
    planetGroup.speed = parseFloat(speedControls[name].value);
    planetGroup.group.rotation.y += planetGroup.speed * delta * 60;
  });

  renderer.render(scene, camera);
}

animate();
