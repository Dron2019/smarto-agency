export const eases = {
  ex: 'expo.inOut',
  exI: 'expo.in',
  exO: 'expo.out',
  p4: 'power4.inOut',
  p4I: 'power4.in',
  p4O: 'power4.out',
  p2: 'power2.inOut',
  p2I: 'power2.in',
  p2O: 'power2.out',
  circ: 'circ.inOut',
  circO: 'circ.out',
  circI: 'circ.in',
};

export const langDetect = () => {
  if (window.location.pathname.match(/\/ru\//)) {
    return 'ru';
  } if (window.location.pathname.match(/\/en\//)) {
    return 'en';
  }
  return 'uk';
};

export const addIntersectionOnceWithCallback = (el, cb = () => {}) => {
  const image = el;
  const target = image;
  const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
          if (entry.isIntersecting) {
              const lazyImage = entry.target;
              cb();
              observer.unobserve(target);
          }
        });
      }, {
          rootMargin: '0px',
          threshold: 0.1,
        });
      observer.observe(target);
}

export function loader(callback, config, nameProject) {
  const arrTimes = [];
  let i = 0; // start
  const timesToTest = 3;
  const tThreshold = 400; // ms
  const numImage = 1;
  const testImage = `/wp-content/themes/smartoagency/assets/images/jpg/andriyivsky-city-space.jpg`; // small image in your server
  const dummyImage = new Image();
  let isConnectedFast = false;

  testLatency(avg => {
    isConnectedFast = {
      fastSpeed: (avg <= tThreshold),
      middleTime: avg,
      checkImage: numImage,
    };
    /** output */
    callback(isConnectedFast);
    return avg;
  });

  /** test and average time took to download image from server, called recursively timesToTest times */
function testLatency(cb) {
    const tStart = new Date().getTime();
    if (i < timesToTest - 1) {
      dummyImage.src = `${testImage}?t=${tStart}`;
      dummyImage.onload = function () {
        const tEnd = new Date().getTime();
        const tTimeTook = tEnd - tStart;
        arrTimes[i] = tTimeTook;
        testLatency(cb);
        i++;
      };

      dummyImage.onerror = function () {
        const tEnd = new Date().getTime();
        const tTimeTook = tEnd - tStart;
        arrTimes[i] = tTimeTook;
        testLatency(cb);
        i++;
      };
    } else {
      /** calculate average of array items then callback */
      const sum = arrTimes.reduce((a, b) => a + b);
      const avg = sum / arrTimes.length;
      cb(avg);
    }
  }
}

export const wrap = function (toWrap, wrapper, tag = 'div') {
  wrapper = wrapper || document.createElement(tag);
  toWrap.parentNode.appendChild(wrapper);
  wrapper.appendChild(toWrap);
  return wrapper;
};