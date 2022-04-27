import gsap from 'gsap';
import { addIntersectionOnceWithCallback, loader, wrap } from '../modules/helpers/helpers';
// import Scrollbar from 'smooth-scrollbar';
import SmoothScrollbar, { ScrollbarPlugin } from 'smooth-scrollbar';
import ScrollTrigger from 'gsap/ScrollTrigger';
// import * as THREE from 'three';
gsap.registerPlugin(ScrollTrigger);
global.ScrollTrigger = ScrollTrigger;
import headerLogo3d from '../modules/3d-header-logo';
import picturesHoverEffect from '../modules/projects-webgl-hover';
import fake3d from '../modules/sequence';
import Swal from 'sweetalert2';




window.addEventListener('lazy-img-load', () => {
  ScrollTrigger.refresh(true);
  // console.log('lazy-img-laod');
})

picturesHoverEffect('[data-webgl]');
headerLogo3d('[data-canvas-logo]');

/**Шарик на первом Экране */
function mainScreenBall() {
  const canvas = document.querySelector('[data-canvas]');
  if (canvas === null) return;
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
  camera.position.set(0, 0, 375);
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
    sphere.rotation.z = -0.25 + (mouse.x * 0.75);
    sphere.rotation.x = 0.5 + (mouse.y * 0.75);

  }

  requestAnimationFrame(render);
  document.querySelector('.main-screen').addEventListener('mousemove', onMouseMove);
  let resizeTm;
  window.addEventListener('resize', () => {
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 500);
  });
}

mainScreenBall();
/**Шарик на первом Экране END*/
/**SMOOTH SCROLL */

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
let scrollBar = SmoothScrollbar.init(document.querySelector('.page__inner'), {
  overflowScroll: false,
});
scrollBar.track.xAxis.element.remove()

scrollBar.addListener(evt => {
  if (evt.offset.y > 1000) return;
  const { y } = evt.offset;
  const sidePanel = document.querySelector('.sidepanel');
  const header = document.querySelector('.header');
  // console.log(y);

  if (y > 200) {
    header.classList.add('not-on-top');
  } else {
    header.classList.remove('not-on-top');
  }
});
if (window.matchMedia('(max-width:575px)').matches && !window.location.href.match(/grandbourget/)) {
  scrollBar.destroy();
  gsap.set('.page__inner', { height: 'auto' });
  scrollBar = document.body;
  window.addEventListener('scroll',function(evt){
    const header = document.querySelector('.header');
    if (this.scrollY > 200) {
      header.classList.add('not-on-top');
    } else {
      header.classList.remove('not-on-top');
    }
  });
}
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
/**SMOOTH SCROLL END*/
/**SMOOTH SCROLL NAVIGATION */
document.querySelectorAll('[data-href]').forEach(link => {
  link.addEventListener('click', (evt) => {
    evt.preventDefault();
    disaptchChangeMenuState();
    if (window.matchMedia('(max-width: 575px)').matches) {
      document.querySelector(`[data-anchor="${link.dataset.href}"]`).scrollIntoView();
      console.log(document.querySelector(`[data-anchor="${link.dataset.href}"]`));
    } else {
      scrollBar.scrollIntoView(document.querySelector(`[data-anchor=${link.dataset.href}]`), {
        offsetTop: 120,
        speed: 3000,
      });
    }
  });
});

function scrollOnLoadToAnchor() {
  const elementToScroll = document.querySelector(`[data-anchor="${window.location.hash.replace('#','')}"]`);
  if (elementToScroll) {
    setTimeout(() => {
      scrollBar.scrollIntoView(document.querySelector(`[data-anchor"=${window.location.hash.replace('#','')}]"`), {
        offsetTop: 120,
        speed: 4500,
      });
    }, 1000);
  }
    console.log(elementToScroll);
}
scrollOnLoadToAnchor();
/**SMOOTH SCROLL NAVIGATION END*/
const year = function() {
  const date = new Date();
  const yyyy = date.getFullYear();
  return yyyy;
};
const footer = document.querySelector('.footer__content');
footer.innerHTML +=
  `<img src="${footer.dataset.src}" alt="footer-svg"><a href="https://smarto.agency/" target="_blank">Smart Orange</a>&nbsp;&copy;&nbsp;` +
  year();


/**MOBILE MENU OPEN HANDLER */
document.querySelector('#toggle').addEventListener('change', function(evt) {
  handleContentTransformOnMobMenu(evt);
  const mobMenu = document.querySelector('#toggle');
  if (mobMenu.checked && window.matchMedia('(max-width: 575px)').matches) {
    gsap.set('nav a', { width: 'auto'})
  } else {
    gsap.set('nav a', { width: ''})
  }
});

function disaptchChangeMenuState() {
  const mobMenu = document.querySelector('#toggle');
  if (mobMenu.checked) {
    // gsap.to
    mobMenu.checked = false;
    mobMenu.dispatchEvent(new Event('change'));
  }
  console.log(mobMenu.checked && window.matchMedia('(max-width: 575px)').matches);
  if (mobMenu.checked && window.matchMedia('(max-width: 575px)').matches) {
    gsap.set('nav .a', { width: 'auto'})
  } else {
    gsap.set('nav .a', { width: ''})
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

document.querySelector('.page__inner').addEventListener('click', ({ target }) => {
  // console.log(target);
  const mobMenu = document.querySelector('#toggle');
  if (mobMenu.checked) {
    mobMenu.checked = false;
    mobMenu.dispatchEvent(new Event('change'));
  }
});
/**MOBILE MENU OPEN HANDLER END*/

if (!window.matchMedia('(max-width: 575px)').matches) {
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
}

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
      start: '20% bottom',
      once: true,
    }
  })
  .fromTo(
    text.querySelectorAll('span>span'), 
  { yPercent: 100, skewY: 3 }, 
  { yPercent: 0, skewY: 0, stagger: 0.15, duration: 1.5, ease: 'power4.out' },
  );
})
// single effect END


/*SIngle effect  */
    const paralaxImages = document.querySelectorAll(
      '.wow__left>*, .communication__h5',
    );
    paralaxImages.forEach(image => {
    //  const $wrap = wrap(image);

    image.innerHTML = '<div>'+ image.innerHTML +'</div>'
     gsap.set(image, { overflow: 'hidden', height: 'max-content' });
      gsap.from(image.querySelector('div'), {
        scrollTrigger: {
          trigger: image,
          start: '100px bottom',
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
    const andriivskiySequence = document.querySelector('[data-sequence]');
    addIntersectionOnceWithCallback(andriivskiySequence, () => {
      const fake3d1 = fake3d(document.querySelector('[data-sequence]'), andriivskiySequence.dataset.sequence, 50);
      if (fake3d1 === undefined) return;
      ScrollTrigger.create({
        trigger: document.querySelector('[data-sequence]'),
        onUpdate: ({progress}) => {
          const scaleFactor = fake3d1.imagesCount / 100; 
          const percentage = ((progress * 100) * scaleFactor).toFixed(0);
          requestAnimationFrame(() => {
            fake3d1.changeImage(percentage);
          })
          // fake3d1.changeImage(percentage);
        }
      })
    })
  }
})


const grandByrzheSequence = document.querySelectorAll('[data-sequence]')[1];

addIntersectionOnceWithCallback(document.querySelectorAll('[data-sequence]')[0], () => {
  const fake3d2 = fake3d(grandByrzheSequence, grandByrzheSequence.dataset.sequence, 38);
  if (fake3d2 === undefined) return;
  ScrollTrigger.create({
    trigger: document.querySelectorAll('[data-sequence]')[1],
    onUpdate: ({progress}) => {
      
      const scaleFactor = fake3d2.imagesCount / 100; 
      const percentage = ((progress * 100) * scaleFactor).toFixed(0);
      requestAnimationFrame(() => {
        fake3d2.changeImage(percentage);
      })
    }
  })
});
// const aStationSequence = document.querySelectorAll('[data-sequence]')[2];
// addIntersectionOnceWithCallback(document.querySelectorAll('[data-sequence]')[1],() => {

//   const fake3d3 = fake3d(aStationSequence, aStationSequence.dataset.sequence, 50);
//   if (fake3d3 === undefined) return;
//   ScrollTrigger.create({
//     trigger: document.querySelectorAll('[data-sequence]')[2],
//     onUpdate: ({progress}) => {
//       const scaleFactor = fake3d3.imagesCount / 100; 
//       const percentage = ((progress * 100) * scaleFactor).toFixed(0);
//       fake3d3.changeImage(percentage);
//     }
//   })
// });


const bogunSequenceEl = document.querySelector('[data-sequence-bogun]');
addIntersectionOnceWithCallback(bogunSequenceEl,() => {

  const fakeBogun = fake3d(bogunSequenceEl, bogunSequenceEl.dataset.sequenceBogun, 51);
  if (fakeBogun === undefined) return;
  ScrollTrigger.create({
    trigger: document.querySelector('[data-sequence-bogun]'),
    onUpdate: ({progress}) => {
      const scaleFactor = fakeBogun.imagesCount / 100; 
      const percentage = ((progress * 100) * scaleFactor).toFixed(0);
      requestAnimationFrame(() => {
        fakeBogun.changeImage(percentage);
      })
    }
  })
})
const ozonSequenceEl = document.querySelector('[data-sequence-ozon]');
addIntersectionOnceWithCallback(ozonSequenceEl,() => {

  const fakeBogun = fake3d(
    ozonSequenceEl, 
    ozonSequenceEl.dataset.sequenceOzon, 34);
  if (fakeBogun === undefined) return;
  ScrollTrigger.create({
    trigger: document.querySelector('[data-sequence-ozon]'),
    onUpdate: ({progress}) => {
      const scaleFactor = fakeBogun.imagesCount / 100; 
      const percentage = ((progress * 100) * scaleFactor).toFixed(0);
      requestAnimationFrame(() => {
        fakeBogun.changeImage(percentage);
      })
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

document.querySelectorAll('[data-first-entry]').forEach((span, i) => {
  span.addEventListener('mouseenter',function(evt){
    gsap.to(span, { x: 10 })
  });
  span.addEventListener('mouseleave',function(evt){
    gsap.to(span, { x: 0 })
  });
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
    delay: i * 0.1,
    duration: 2.5,

  })
  .set($wrap, { overflow: 'initial' })
});



document.querySelectorAll('.partners__text').forEach(text => {
  if (window.matchMedia('(max-width: 950px)').matches) return;
  const { height } = document.querySelector('.header').getBoundingClientRect();
  gsap.to(".partners__text div ", {
    ease: "none",
    scrollTrigger: {
      trigger: ".partners__wrapper",
      start: "-150px top",
      // end: "+=300%",
      scrub: 0.1,
      pin: '.partners__text div',
      onEnter: () => {
        // gsap.to('.partners__text', { 
        //   y: height,
        //   duration: 0.2,
        // })
      },
      onLeaveBack: () => {
        // gsap.to('.partners__text', { 
        //   y: 0,
        //   duration: 0.2,
        // })
      }
    }
  });
});

gsap.registerEffect({
  name: "counter",
  extendTimeline: true,
  defaults: {
    end: 0,

    duration: 0.5,
    ease: "power1",
    increment: 1,
  },
  effect: (targets, config) => {
    // console.log(targets,config, 'EFFECT');
    let tl = gsap.timeline();
    let num = 2000 /* targets[0].innerText.replace(/\,/g, "") */;
    targets[0].innerText = num;

    tl.to(
      targets,
      {
        duration: config.duration,
        innerText: config.end,
        //snap:{innerText:config.increment},
        modifiers: {
          innerText: function (innerText) {
            return gsap.utils
              .snap(config.increment, innerText)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, "");
          },
        },
        ease: config.ease,
      },
      0
    );

    return tl;
  },
});

/*SIngle effect*/
  document.querySelectorAll(".wow__year").forEach((el) => {
    const end = +el.innerText;
    if (isNaN(end)) return;
    el.textContent = 0;
    ScrollTrigger.create({
      trigger: el,
      once: true,
      onEnter: () => {
        let tl = gsap.timeline().counter(el, {
          end: end,
          autoAlpha: 0,
          duration: 2.5,
        });
      },
    });
  });
    /*SIngle effect  END*/
/*SIngle effect*/

  document.querySelectorAll('.title-with-star path').forEach(el => {
    const morphFrom = el.getAttribute('d');
    const morphTo =  'M 40 24 L 40.4592 38.8913 L 52 28 L 41.1087 39.5408 L 56 40 L 41.1087 40.4592 L 52 51 L 40.4592 41.1087 L 40 55 L 39.5408 41.1087 L 29 52 L 38.8913 40.4592 L 24 40 L 38.8913 39.5408 L 28 28 L 39.5408 38.8913 L 40 24 Z';
    const tl = gsap.timeline({
      repeat: -1,
      paused: true,
      yoyo: true,
    })
    .fromTo(
      el, 
      { attr: { d: morphFrom } },
      { attr: { d: morphTo }, duration: 2.5 },
    );
    ScrollTrigger.create({
      trigger: el,
      onEnter: () => tl.play(),
      onLeave: () => tl.pause(),
      onEnterBack: () => tl.play(),
      onLeaveBack: () => tl.pause(),
    })
  })
/*SIngle effect  END*/


// document.querySelectorAll('[data-showreel]').forEach(showreelButton => {
//   showreelButton.addEventListener('click',function(evt){
//     Swal.fire({
//       width: 'auto',
//       showCloseButton: true,
//       showConfirmButton: false,
//       padding: '0px',
//       showClass: {
//         popup: 'fade-in-top'
//       },
//       hideClass: {
//         popup: 'fade-out-bottom'
//       },
//       html: `
//       <video playsinline src="${showreelButton.dataset.showreel}" autoplay loop controls="controls">
//         <source src="${showreelButton.dataset.showreel}" type="video/mp4">
//         Your browser does not support the video tag.
//       </video>
//       `,
//       customClass: {
//         confirmButton: 'button'
//       }
//     })
//   });
// });

ScrollTrigger.create({
  trigger: '.main-screen__call-popup .rotate-group',
  once: true,
  onEnter: () => {
    gsap.timeline()
      .add(() => {
        document.querySelector('.main-screen__call-popup .rotate-group').style.animationDuration = '1s';
      })
      .fromTo('.main-screen__call-popup svg', {
        scale: 0,
        autoAlpha: 0
      }, {
        scale: 1.2,
        autoAlpha: 1,
        duration: 1.25
      })
      .to('.main-screen__call-popup svg', {
        scale: 1
      })
      .to('.main-screen__call-popup .rotate-group', {
        animationDuration: '7s',
        duration: 2,
      })
      // .add(() => {
      //   document.querySelector('.main-screen__call-popup .rotate-group').style.animationDuration = '7s';
      // })
      // .set('.main-screen__call-popup .rotate-group', {
      //   animationDuration: 7,
      // })
      
  }
})



document.querySelectorAll('[data-about-entry]').forEach(el => {
  el.innerHTML = '<div>'+ el.innerHTML +'</div>';
  el.style.overflow = 'hidden';
})
ScrollTrigger.create({
  trigger: '.about',
  start: '20% bottom',
  once: true,
  onEnter: () => {
    gsap.fromTo('[data-about-entry]>div', {
      yPercent: 100
    }, {
      
      yPercent: 0,
      stagger: 0.15,
      duration: 1.5,
       ease: 'power4.out'
    })
  }
})
document.querySelectorAll('.partners__wrapper>a').forEach(el => {
  el.innerHTML = '<div>'+ el.innerHTML +'</div>';
  el.style.overflow = 'hidden';
  el.timeline = gsap.timeline({

  })
})

const partTimeline = gsap.timeline({
  paused: true,
})
.fromTo('.partners__wrapper>a>div', {
  yPercent: 100
}, {
  
  yPercent: 0,
  stagger: 0.05,
  duration: 0.5,
   ease: 'power4.out'
})
ScrollTrigger.create({
  trigger: '.partners__wrapper',
  start: '20% bottom',
  once: true,
  onEnter: () => {
    partTimeline.play();
  }
})




document.querySelectorAll('.langs__hover a').forEach(el=> {
  el.onclick = () => {
    console.log('dfweagfe');
  }
})

// window.addEventListener('click', function showreel(){
//   if (sessionStorage.getItem('first-visit') === null) {
//     setTimeout(() => {
      
//     }, 2000);
//     document.querySelector('[data-showreel]').dispatchEvent(new Event('click'));
//     document.querySelector('video').play();
//   }
//   sessionStorage.setItem('first-visit', true);
//   window.removeEventListener('click', showreel);
// })




function showreelPopup() {
  const callPopup = document.querySelectorAll('[data-showreel]');
  const popup = document.querySelector('[data-showreel-popup-popup]');
  const close = popup.querySelector('[class*="close"]');
  const play = popup.querySelector('[class*="play"]');
  const video = popup.querySelector('video');
  const className = 'playing';
  const morphs = {
    default: play.querySelector('path').getAttribute('d'),
    custom: 'M 150 197 V 150 C 150 150 199 150 199 150 L 199 197 C 199 197 199 197 199 197 L 150 197 C 150 197 150 197 150 197 Z'
  }
  if (sessionStorage.getItem('first-visit') === null) {
    openPopup();
    sessionStorage.setItem('first-visit', true);
  }
  
  
  callPopup.forEach(el => el.addEventListener('click',  openPopup))
  close.addEventListener('click', closePopup)
  play.addEventListener('click',function(evt){
    console.log('d');

    if (popup.classList.contains(className)) {
      pauseVideo();
      
    } else {
      playVideo();
      
    }
  });

  video.addEventListener('pause', () => {
    pauseVideo();
  })

  function playVideo(){
    video.style.opacity = 1;
    video.style.visibility = 'visible';
    video.play();
    popup.classList.add(className);
    morphingPlayButton(true);
  }
  function pauseVideo() {
    video.style.opacity = 0;
    video.style.visibility = 'hidden';
    popup.classList.remove(className);
    video.pause();
    morphingPlayButton(false);
  }
  function closePopup() {
    gsap.fromTo(popup, { autoAlpha: 1 }, { autoAlpha: 0 });
    pauseVideo();
  }
  function openPopup() {
    gsap.fromTo(popup, { autoAlpha: 0 }, { autoAlpha: 1 })
  }

  function morphingPlayButton(isPlaying) {
    
    console.log(morphs);
    gsap.to(play.querySelector('path'), {
      attr: { d: isPlaying ? morphs.custom : morphs.default },
      ease: 'none',
      duration: 0.15
    })
  }
}
showreelPopup()