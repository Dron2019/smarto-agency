import gsap from 'gsap';
import { langDetect } from '../modules/helpers/helpers';
// import Scrollbar from 'smooth-scrollbar';
import SmoothScrollbar, { ScrollbarPlugin } from 'smooth-scrollbar';
import ScrollTrigger from 'gsap/ScrollTrigger';
// import * as THREE from 'three';
gsap.registerPlugin(ScrollTrigger);
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
class DisableScrollPlugin extends ScrollbarPlugin {
  static pluginName = 'disableScroll';

  static defaultOptions = {
    direction: null,
  };
  transformDelta(delta) {
    if (this.options.direction) {
      delta[this.options.direction] = 0;
    }

    return { x: 0, y: delta.y };
  }
}

SmoothScrollbar.use(DisableScrollPlugin);
const scrollBar = SmoothScrollbar.init(document.querySelector('.page__inner'), {});
scrollBar.track.xAxis.element.remove();

ScrollTrigger.scrollerProxy('.page__inner', {
  scrollTop(value) {
    if (arguments.length) {
      scrollBar.scrollTop = value;
    }
    return scrollBar.scrollTop;
  },
});

scrollBar.addListener(ScrollTrigger.update);

ScrollTrigger.defaults({ scroller: document.querySelector('.page__inner') });

console.log(scrollBar);
scrollBar.addListener(evt => {
  if (evt.offset.y > 1500) return;
  const { y } = evt.offset;
  const sidePanel = document.querySelector('.sidepanel');
  // if (y > 1000) {
  //   sidePanel.style.display = 'block';
  //   gsap.fromTo(sidePanel,
  //     { xPercent: 150 },
  //     { yPercent: -50, xPercent: 0 }
  //   );
  // } else {
  //   gsap.timeline().fromTo(sidePanel,
  //     { yPercent: -50, xPercent: 0 },
  //     { xPercent: 150 },
  //   )
  //   .set(sidePanel, { display: 'none' })
  //   // sidePanel.style.display = 'none'
  // };
  if (y > 100) {
    document.querySelector('.header').style.backgroundColor = 'transparent';
  } else {
    document.querySelector('.header').style.backgroundColor = '#000000';
  }
});
ScrollTrigger.create({
  trigger: '.wow',
  onEnter: () => {
    const sidePanel = document.querySelector('.sidepanel');
    sidePanel.style.display = 'block';
    gsap.fromTo(sidePanel, { xPercent: 150 }, { yPercent: -50, xPercent: 0 });
  },
  onLeaveBack: () => {
    const sidePanel = document.querySelector('.sidepanel');
    gsap
      .timeline()
      .fromTo(sidePanel, { yPercent: -50, xPercent: 0 }, { xPercent: 150 })
      .set(sidePanel, { display: 'none' });
  },
});
document.querySelectorAll('.pageup').forEach(el => {
  el.addEventListener('click', () => {
    if (scrollBar !== undefined) {
      scrollBar.scrollTo(0, 0, 1510);
    } else {
      window.scrollTo(0, 0);
    }
  });
});
document.querySelectorAll('.pagedown').forEach(el => {
  el.addEventListener('click', () => {
    if (scrollBar !== undefined) {
      scrollBar.scrollIntoView(document.querySelector('[data-anchor="about"]'));
    } else {
      window.scrollTo(0, 0);
    }
  });
});
document.querySelectorAll('[data-href]').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('#toggle').checked = false;
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

// const placeHolder = document.querySelector('.place-holder');
const input = document.querySelector('.input-tel');
// placeHolder.addEventListener('click', () => {
//   placeHolder.style.display = 'none';
//   input.focus();
// });

// if (window.matchMedia('(max-width: 992px)').matches) {
//   Scrollbar.destroyAll();
// }

document.querySelector('#toggle').addEventListener('change', function(evt) {
  if (window.matchMedia('(min-width:992px)').matches) return;
  if (this.checked) {
    gsap.to('.page__inner', { y: '50vh' });
  } else {
    gsap.to('.page__inner', { y: 0 });
  }
});

// $(document).ready(function(){
//   $.fn.animate_Text = function() {
//    var string = this.text();
//    return this.each(function(){
//     var $this = $(this);
//     $this.html(string.replace(/./g, '<span class="new">$&</span>'));
//     $this.find('span.new').each(function(i, el){
//      setTimeout(function(){ $(el).addClass('div_opacity'); }, 40 * i);
//     });
//    });
//   };
//   $('#sidepanel__text').show();
//   $('#sidepanel__text').animate_Text();
//  });

// single effect Start
//  document.querySelectorAll('.sidepanel__text').forEach(text => {
//   let mathM = text.textContent.split('');
//   mathM = mathM.map(el => `<span style="display:inline-flex">${el}</span>`);
//   text.innerHTML = mathM.join(' ');
//   gsap.set(text.children, { overflow: 'hidden', });
//   gsap.set(text.querySelectorAll('span>span'), { overflow: 'initial', display: 'inline-block' });
//   let tl = gsap.timeline({
//     paused: true,
//     scrollTrigger: {
//       trigger: text,
//       once: true,
//     }
//   })
//   .fromTo(
//     text.querySelectorAll('span>span'),
//   { yPercent: 100, skewY: 3 },
//   { yPercent: 0, skewY: 0, stagger: 0.05, duration: 1.25, ease: 'power4.out' }
//   );
//   window.addEventListener('preloaderOff', () => tl.play())

// })
// single effect END
