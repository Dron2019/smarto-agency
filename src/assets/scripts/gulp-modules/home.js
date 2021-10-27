import gsap from 'gsap';
import { addIntersectionOnceWithCallback, loader } from '../modules/helpers/helpers';
// import Scrollbar from 'smooth-scrollbar';
import SmoothScrollbar, { ScrollbarPlugin } from 'smooth-scrollbar';
import ScrollTrigger from 'gsap/ScrollTrigger';
// import * as THREE from 'three';
gsap.registerPlugin(ScrollTrigger);
import headerLogo3d from '../modules/3d-header-logo';
import picturesHoverEffect from '../modules/projects-webgl-hover';
import fake3d from '../modules/sequence';



picturesHoverEffect('[data-webgl]');
headerLogo3d('[data-canvas-logo]');
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
renderer.setClearColor(0xffffff, 0);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
camera.position.set(0, 20, 350);
window.camera = camera;
const sphere = new THREE.Group();
scene.add(sphere);
if (window.matchMedia('(max-width: 575px)').matches) {
  const scaleFactor = 0.8;
  sphere.scale.set(scaleFactor, scaleFactor, scaleFactor);
}
const material = new THREE.LineBasicMaterial({
  //   color: 0x0C50DB,
  color: 0xff3300,
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
  line.hor = true;
  sphere.add(line);
}
// for (let j = 0; j < linesAmount; j++) {
//   const index = j;
//   const geometry = new THREE.Geometry();
//   geometry.y = (index / linesAmount) * radius * 2;
//   for (let i = 0; i <= verticesAmount; i++) {
//     const vector = new THREE.Vector3();
//     vector.x = Math.tan((i / linesAmount) * Math.PI * 2);
//     vector.z = Math.tan((i / linesAmount) * Math.PI * 2);
//     vector._o = vector.clone();
//     geometry.vertices.push(vector);
//   }
//   const line = new THREE.Line(geometry, material);
//   sphere.add(line);
//   line.vert = true;
// }

function updateVertices(a) {
  for (let j = 0; j < sphere.children.length; j++) {
    const line = sphere.children[j];
    if (line.hor !== true) break;
    line.geometry.y += 0.1;
    if (line.geometry.y > radius * 2) {
      line.geometry.y = 0;
    }
    const radiusHeight = Math.sqrt(line.geometry.y * (2 * radius - line.geometry.y));
    for (let i = 0; i <= verticesAmount; i++) {
      const vector = line.geometry.vertices[i];
      var ratio = noise.simplex3(vector.x*0.009, vector.z*0.009 + a*0.0006, line.geometry.y*0.009) * 15;
      vector.copy(vector._o);
      vector.multiplyScalar(radiusHeight + ratio);
      vector.y = line.geometry.y - radius;
    }
    line.geometry.verticesNeedUpdate = true;
  }
}

sphere.rotation.x = 0.75;
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
  sphere.rotation.z = -0.25 + (mouse.x * 0.5);
  sphere.rotation.x = 0.5 + (mouse.y * 0.5);

}

requestAnimationFrame(render);
document.querySelector('.main-screen').addEventListener('mousemove', onMouseMove);
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
  onRender(r) {
    // console.log(r);
  }
  onUpdate() {
    // console.log('scrollbar updated');

    // this._update();
  }
  transformDelta(delta) {
    if (this.options.direction) {
      delta[this.options.direction] = 0;
    }

    return { x: 0, y: delta.y};
  }
}

SmoothScrollbar.use(DisableScrollPlugin);
const scrollBar = SmoothScrollbar.init(document.querySelector('.page__inner'), {
  overflowScroll: false,
});
scrollBar.track.xAxis.element.remove()

scrollBar.addListener(evt => {
  if (evt.offset > 1000) return;
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
  // if (y > 100) {
  //   document.querySelector('.header').style.backgroundColor = 'transparent';
  // } else {
  //   document.querySelector('.header').style.backgroundColor = '#000000';
  // }
});


document.querySelectorAll('.pageup').forEach(el => {
  el.addEventListener('click', () => {
    if (scrollBar !== undefined) {
      // console.log(scrollBar);
      scrollBar.scrollTo(0, 0, 1510);
    } else {
      window.scrollTo(0, 0);
    }
  });
});
document.querySelectorAll('.pagedown').forEach(el => {
  el.addEventListener('click', () => {
    if (scrollBar !== undefined) {
      // console.log(scrollBar);
      scrollBar.scrollIntoView(document.querySelector('[data-anchor="about"]'));
    } else {
      window.scrollTo(0, 0);
    }
  });
});

document.querySelectorAll('[data-href]').forEach(link => {
  link.addEventListener('click', () => {
    // console.log('fff');
    disaptchChangeMenuState();
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
// placeHolder.addEventListener('click', () => {
//   placeHolder.style.display = 'none';
//   input.focus();
// });

// if (window.matchMedia('(max-width: 992px)').matches) {
//   Scrollbar.destroyAll();
// }

document.querySelector('#toggle').addEventListener('change', function(evt) {
  handleContentTransformOnMobMenu(evt);
});

function disaptchChangeMenuState() {
  const mobMenu = document.querySelector('#toggle');
  if (mobMenu.checked) {
    mobMenu.checked = false;
    mobMenu.dispatchEvent(new Event('change'));
  }
}

function handleContentTransformOnMobMenu(evt) {
  if (window.matchMedia('(min-width:992px)').matches) return;
  // console.log('i change checkbox', document.querySelector('#toggle').checked);
  if (document.querySelector('#toggle').checked) {
    gsap.to('.page__inner', { y: '30vh', filter: 'brightness(0.5)' });
  } else {
    gsap.to('.page__inner', { y: 0, filter: '' });
  }
}
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


document.querySelector('.page__inner').addEventListener('click', ({ target }) => {
  // console.log(target);
  const mobMenu = document.querySelector('#toggle');
  if (mobMenu.checked) {
    mobMenu.checked = false;
    mobMenu.dispatchEvent(new Event('change'));
  }
});

ScrollTrigger.scrollerProxy(".page__inner", {
  scrollTop(value) {
    if (arguments.length) {
      scrollBar.scrollTop = value;
    }
    return scrollBar.scrollTop;
  }
});
const scroller = document.querySelector('.page__inner');
scrollBar.addListener(ScrollTrigger.update);

ScrollTrigger.defaults({ scroller: scroller });
 ScrollTrigger.create({
  trigger: '.wow',
  onEnter: () => {
    console.log('dd');
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
 // single effect Start
 document.querySelectorAll('[data-split-text]').forEach(text => {
  let mathM = text.innerHTML.match(/<\s*(\w+\b)(?:(?!<\s*\/\s*\1\b)[\s\S])*<\s*\/\s*\1\s*>|\S+/g);
  mathM = mathM.map(el => `<span style="display:inline-flex">${el}&nbsp;</span>`);
  text.innerHTML = mathM.join(' ');
  gsap.set(text, { overflow: 'hidden',display: 'inline-flex' });
  gsap.set(text.querySelectorAll('span>span'), { overflow: 'initial', display: 'inline-block' });
  let tl = gsap.timeline({
    // paused: true,
    scrollTrigger: {
      trigger: text,
      once: true,
    }
  })
  .fromTo(
    text.querySelectorAll('span>span'), 
  { yPercent: 100, skewY: 3 }, 
  { yPercent: 0, skewY: 0, stagger: 0.05, duration: 1.25, ease: 'power4.out' },
  );
})
// single effect END

var wrap = function (toWrap, wrapper) {
    wrapper = wrapper || document.createElement('div');
    toWrap.parentNode.appendChild(wrapper);
    wrapper.appendChild(toWrap);
    return wrapper;
};
/*SIngle effect  */
    const paralaxImages = document.querySelectorAll(
      '.wow__left>*',
    );
    paralaxImages.forEach(image => {
     const $wrap = wrap(image);
     gsap.set($wrap, { overflow: 'hidden' });
      gsap.from($wrap.querySelector(':first-child'), {
        scrollTrigger: {
          trigger: $wrap,
          once: true,
        },
        ease: 'power4.out',
        yPercent: 100,
        skewX: 3,
        duration: 1.5,
      })
    });
  /*SIngle effect END */



loader(({fastSpeed}) => {
  if (fastSpeed) {
    addIntersectionOnceWithCallback(document.querySelector('[data-sequence]'), () => {
      const fake3d1 = fake3d(document.querySelector('[data-sequence]'), './assets/images/sequence/');
      ScrollTrigger.create({
        trigger: document.querySelector('[data-sequence]'),
        onUpdate: ({progress}) => {
          const scaleFactor = fake3d1.imagesCount / 100; 
          const percentage = ((progress * 100) * scaleFactor).toFixed(0);
          fake3d1.changeImage(percentage);
        }
      })
    })
  }
})



addIntersectionOnceWithCallback(document.querySelectorAll('[data-sequence]')[0], () => {
  const fake3d2 = fake3d(document.querySelectorAll('[data-sequence]')[1], './assets/images/grand-byrzhe/', 100);
  ScrollTrigger.create({
    trigger: document.querySelectorAll('[data-sequence]')[1],
    onUpdate: ({progress}) => {
  
      const scaleFactor = fake3d2.imagesCount / 100; 
      const percentage = ((progress * 100) * scaleFactor).toFixed(0);
      fake3d2.changeImage(percentage);
    }
  })
});

addIntersectionOnceWithCallback(document.querySelectorAll('[data-sequence]')[1],() => {

  const fake3d3 = fake3d(document.querySelectorAll('[data-sequence]')[2], './assets/images/a-station/', 100);
  ScrollTrigger.create({
    trigger: document.querySelectorAll('[data-sequence]')[2],
    onUpdate: ({progress}) => {
      const scaleFactor = fake3d3.imagesCount / 100; 
      const percentage = ((progress * 100) * scaleFactor).toFixed(0);
      fake3d3.changeImage(percentage);
    }
  })
})
addIntersectionOnceWithCallback(document.querySelector('[data-sequence-bogun]'),() => {

  const fakeBogun = fake3d(document.querySelector('[data-sequence-bogun]'), './assets/images/bogun/', 51);
  ScrollTrigger.create({
    trigger: document.querySelector('[data-sequence-bogun]'),
    onUpdate: ({progress}) => {
      const scaleFactor = fakeBogun.imagesCount / 100; 
      const percentage = ((progress * 100) * scaleFactor).toFixed(0);
      fakeBogun.changeImage(percentage);
    }
  })
})




const partnersTL = gsap.timeline({ repeat: -1, paused: true, })
  .fromTo('[class*="partners__image"]:nth-child(odd)', {
    y: 0,
  } , { y: 5, stagger: .5, duration: 5 })
  .fromTo('[class*="partners__image"]:nth-child(even)', {
    y: 5,
  } , { y: 0, stagger: .5, duration: 5 }, '<')

document.querySelectorAll('[class*="partners__image"]:nth-child(odd)').forEach(el => {
  el.classList.add('little-move')
})
document.querySelectorAll('[class*="partners__image"]:nth-child(even)').forEach(el => {
  el.classList.add('little-move-r')
});


document.querySelectorAll('[data-first-entry]').forEach(span => {
  const $wrap = wrap(span);
  gsap.set($wrap, { overflow: 'hidden' });
  gsap.set(span, { display: 'inline-block' });
  gsap.timeline({
    // scrollTrigger: {
    //   trigger: $wrap,
    //   once: true,
    // }
  })
  .to(span, {
    y: 0,
    autoAlpha: 1,
    ease: 'power4.out',
    duration: 2
  })
});



document.querySelectorAll('.partners__text').forEach(text => {
  if (window.matchMedia('(max-width: 950px)').matches) return;
  const { height } = document.querySelector('.header').getBoundingClientRect();
  gsap.to(".partners__text div ", {
    ease: "none",
    scrollTrigger: {
      trigger: ".partners__wrapper",
      // start: "top top",
      // end: "+=300%",
      scrub: true,
      pin: '.partners__text div',
      onEnter: () => {
        gsap.to('.partners__text', { 
          y: height
        })
      },
      onLeaveBack: () => {
        gsap.to('.partners__text', { 
          y: 0
        })
      }
    }
  });
})