import gsap from 'gsap';
import { langDetect } from '../modules/helpers/helpers';
import Scrollbar from 'smooth-scrollbar';
// import * as THREE from 'three';

const canvas = document.querySelector('[data-canvas]');
let width = canvas.offsetWidth;
let height = canvas.offsetHeight;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
camera.position.set(0, 0, 350);

const sphere = new THREE.Group();
scene.add(sphere);
const material = new THREE.LineBasicMaterial({
  //   color: 0x0C50DB,
  color: 0xfe0e55,
});
const linesAmount = 18;
const radius = 100;
const verticesAmount = 100;
const verticalLinesAmount = 100;
for (let j = 0; j < linesAmount; j++) {
  const index = j;
  const geometry = new THREE.Geometry();
  geometry.y = (index / linesAmount) * radius * 2;
  for (let i = 0; i <= verticesAmount; i++) {
    const vector = new THREE.Vector3();
    vector.x = Math.cos((i / verticesAmount) * Math.PI * 2);
    vector.z = Math.sin((i / verticesAmount) * Math.PI * 2);
    vector._o = vector.clone();
    geometry.vertices.push(vector);
  }
  const line = new THREE.Line(geometry, material);
  sphere.add(line);
}
for (let j = 0; j < linesAmount; j++) {
  const index = j;
  const geometry = new THREE.Geometry();
  geometry.y = (index / linesAmount) * radius * 2;
  for (let i = 0; i <= verticesAmount; i++) {
    const vector = new THREE.Vector3();
    vector.x = Math.tan((i / linesAmount) * Math.PI * 2);
    vector.z = Math.tan((i / linesAmount) * Math.PI * 2);
    vector._o = vector.clone();
    geometry.vertices.push(vector);
  }
  const line = new THREE.Line(geometry, material);
  sphere.add(line);
  line.vert = true;
}

function updateVertices(a) {
  for (let j = 0; j < sphere.children.length; j++) {
    const line = sphere.children[j];
    if (line.vert === true) break;
    line.geometry.y += 0.1;
    if (line.geometry.y > radius * 2) {
      line.geometry.y = 0;
    }
    const radiusHeight = Math.sqrt(line.geometry.y * (2 * radius - line.geometry.y));
    for (let i = 0; i <= verticesAmount; i++) {
      const vector = line.geometry.vertices[i];
      const ratio =
        noise.simplex3(vector.x * 0.009, vector.z * 0.009 + a * 0.0006, line.geometry.y * 0.009) *
        1;
      vector.copy(vector._o);
      vector.multiplyScalar(radiusHeight + ratio);
      vector.y = line.geometry.y - radius;
    }
    line.geometry.verticesNeedUpdate = true;
  }
}

function render(a) {
  requestAnimationFrame(render);
  updateVertices(a);
  renderer.render(scene, camera);
}

function onResize() {
  canvas.style.width = '';
  canvas.style.height = '';
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

const mouse = new THREE.Vector2(0.8, 0.5);
function onMouseMove(e) {
  mouse.y = e.clientY / window.innerHeight;
  mouse.x = e.clientX / window.innerWidth;
  gsap.to(sphere.rotation, 0.2, {
    x: mouse.y * 1,
    z: mouse.x * 0.1,
    ease: 'power1.inOut',
  });
  console.log('ff');
}

requestAnimationFrame(render);
window.addEventListener('mousemove', onMouseMove);
let resizeTm;
window.addEventListener('resize', () => {
  resizeTm = clearTimeout(resizeTm);
  resizeTm = setTimeout(onResize, 500);
});

const scrollBar = Scrollbar.init(document.querySelector('.page__inner'), {});

scrollBar.addListener(evt => {
  if (evt.offset > 1000) return;
  const { y } = evt.offset;
  const sidePanel = document.querySelector('.sidepanel');
  y > 1000 ? (sidePanel.style.display = 'block') : (sidePanel.style.display = 'none');
});

document.querySelectorAll('.pageup').forEach(el => {
  el.addEventListener('click', () => {
    if (scrollBar !== undefined) {
      console.log(scrollBar);
      scrollBar.scrollTo(0, 0, 1510);
    } else {
      window.scrollTo(0, 0);
    }
  });
});
document.querySelectorAll('.pagedown').forEach(el => {
  el.addEventListener('click', () => {
    if (scrollBar !== undefined) {
      console.log(scrollBar);
      scrollBar.scrollIntoView(document.querySelector('[data-anchor="about"]'));
    } else {
      window.scrollTo(0, 0);
    }
  });
});

document.querySelectorAll('[data-href]').forEach(link => {
  link.addEventListener('click', () => {
    scrollBar.scrollIntoView(document.querySelector(`[data-anchor=${link.dataset.href}]`), {
      // offsetLeft: 34,
      offsetTop: 120,
      // alignToTop: false,
      // onlyScrollIfNeeded: true,
      speed: 3000,
    });
  });
});

const year = function() {
  const date = new Date();
  const yyyy = date.getFullYear();
  return yyyy;
};
const footer = document.querySelector('.footer__content');
footer.innerHTML +=
  '<img src="./assets/images/svg/footer-svg.svg" alt="footer-svg"><a href="https://smarto.agency/" target="_blank">Smart Orange</a>&nbsp;&copy;&nbsp;' +
  year();

const placeHolder = document.querySelector('.place-holder');
const input = document.querySelector('.input-tel');
placeHolder.addEventListener('click', () => {
  placeHolder.style.display = 'none';
  input.focus();
});
