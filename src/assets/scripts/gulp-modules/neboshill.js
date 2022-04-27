const swiper = new Swiper(".projects-swiper", {
    slidesPerView: 1.1,
    spaceBetween: 20,
    breakpoints: {
        575: {
            slidesPerView: 2.1,
            spaceBetween: 50,
        },
    }
});
window.addEventListener("scroll", function (evt) {
    scrollFunction();
});
const header = document.querySelector(".header");
console.log(header);
function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.querySelector("header").classList.add("bg-header");
    } else {
        document.querySelector("header").classList.remove("bg-header");
    }
}

// btn scroll down start
const buttonDown = document.querySelector(".js-scroll-down");
if (buttonDown) {
    buttonDown.addEventListener("click", () => {
        document
            .querySelector(".goals")
            .scrollIntoView({ behavior: "smooth" });
    });
}
// анимация по кругу + движение
const paralaxPattern = document.querySelectorAll('');
paralaxPattern.forEach((image) => {
    const wrap = document.createElement('div');
    wrap.style.overflow = 'visible';
    wrap.style.height = 'auto';
    image.parentElement.prepend(wrap);
    gsap.set(image, { willChange: 'transform',  rotate: 0 });
    wrap.prepend(image);

    gsap
        .timeline({
            ease: 'none',
            scrollTrigger: {
                trigger: wrap,
                scrub: 1.1,
                scroller: '.page__inner',
                onLeave: () => {
                    console.log('leave');
                },
            },
        })
        .fromTo(
            image,
            {
                // rotate: 30,
                rotate: 0,
            },
            {
                // y: 50,
                rotate: 90,
                ease: 'ease',
            },
        );
});
const paralaxImages = document.querySelectorAll('[data-paralax]');
paralaxImages.forEach((image) => {
    const wrap = document.createElement('div');
    wrap.style.overflow = 'visible';
    // wrap.style.overflow = 'hidden';
    // wrap.style.height = '100%';
    wrap.style.height = 'auto';
    image.parentElement.prepend(wrap);
    // gsap.set(image, { willChange: 'transform', scale: 0.9, rotate: 0 });
    gsap.set(image, { willChange: 'transform',  scale: 1.1 });
    wrap.prepend(image);
    gsap
        .timeline({
            ease: 'none',
            scrollTrigger: {
                // start: -100 % bottom,
                // end: 100 % bottom,
                trigger: wrap,
                scrub: 0.5,
                scroller: '.page__inner',
                onLeave: () => {
                    // console.log('leave');
                },
                // markers: true,
            },
        })
        .fromTo(
            image,
            {
                y: 0,
                scale: 1,
            },
            {
                // y: -50,
                scale: 1.1,
                ease: 'linear',
            },
        );
});
const spanBezier1 = "power4.ease";
// const spanBezier1 = 'power1.inOut';
const spanEntries1 = document.querySelectorAll("[data-span-entry1]");
const spanEntries2 = document.querySelectorAll("[data-span-entry2]");
const spanEntries3 = document.querySelectorAll("[data-span-entry3]");
spanEntries1.forEach((section, index) => {
    gsap.set(section, { overflow: "hidden" });
    section.innerHTML = `
    <div>
      ${section.innerHTML}
    </div>
  `;
    const tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
            triggerHook: 1,
            trigger: section,
            scroller: document.body,
            onEnter: () => {
                if (index === 0) console.log("enter");
            },
            once: true,
        },
    });
    tl.fromTo(
        section.querySelector("div"),
        {
            y: "50%",
            autoAlpha: 0 },
        {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: spanBezier1,
        }
    );
});
spanEntries2.forEach((section, index) => {
    gsap.set(section, { overflow: "hidden" });
    section.innerHTML = `
    <div>
      ${section.innerHTML}
    </div>
  `;
    const tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
            triggerHook: 1,
            trigger: section,
            scroller: document.body,
            onEnter: () => {
                if (index === 0) console.log("enter");
            },
            once: true,
        },
    });
    tl.fromTo(
        section.querySelector("div"),
        { y: "50%", autoAlpha: 0 },
        {
            y: 0,
            autoAlpha: 1,
            delay: 0.3,
            duration: 1,
            ease: spanBezier1,
        }
    );
});
spanEntries3.forEach((section, index) => {
    gsap.set(section, { overflow: "hidden" });
    section.innerHTML = `
    <div>
      ${section.innerHTML}
    </div>
  `;
    const tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
            triggerHook: 1,
            trigger: section,
            scroller: document.body,
            onEnter: () => {
                if (index === 0) console.log("enter");
            },
            once: true,
        },
    });
    tl.fromTo(
        section.querySelector("div"),
        { y: "50%", autoAlpha: 0 },
        {
            y: 0,
            autoAlpha: 1,
            delay: 0.5,
            duration: 1,
            ease: spanBezier1,
        }
    );
});

function fixedMarkers() {
    if (window.matchMedia('(min-width: 576px)').matches) return;
    const root = document.documentElement;
    gsap.timeline({
        scrollTrigger: {
            trigger: document.querySelector(".ui"),
            endTrigger: document.querySelector(".crm"),
            scroller: document.body,

            onEnter: () => {
                gsap.to(".goals-marker", { autoAlpha: 1 });
            },
            onLeave: () => {
                gsap.to(".goals-marker", { autoAlpha: 0 });
            },
            onEnterBack: () => {
                gsap.to(".goals-marker", { autoAlpha: 1 });
            },
            onLeaveBack: () => {
                gsap.to(".goals-marker", { autoAlpha: 0 });
            },
        },
    });
    const fixedMarkers = document.querySelectorAll(
        ".goals-marker .goals-marker__item"
    );

    fixedMarkers.forEach((el) => {
        const { to } = el.dataset;
        el.addEventListener("click", () => {
            document.querySelector(to).scrollIntoView({
                behavior: "smooth",
            });
            fixedMarkers.forEach((item) => item.classList.remove("item-active"));
            el.classList.add("item-active");
        });
    });
    document.querySelectorAll("[data-to]").forEach((point) => {
        const { to, end } = point.dataset;
        const toElement = document.querySelector(to);
        if (!toElement) return;
        gsap.timeline({
            scrollTrigger: {
                trigger: toElement,
                scroller: document.body,
                start: "0% top",
                // markers: true,
                endTrigger: document.querySelector(end) ? document.querySelector(end) : toElement,
                onUpdate: ({ progress }) =>
                    root.style.setProperty("--line-width", progress),
                onEnter: () => {
                    fixedMarkers.forEach((item) => item.classList.remove("item-active"));
                    point.classList.add("item-active");
                },
                onEnterBack: () => {
                    fixedMarkers.forEach((item) => item.classList.remove("item-active"));
                    point.classList.add("item-active");
                },
            },
        });
    });
}
fixedMarkers();
const addIntersectionOnceWithCallback = (el, cb = () => {}) => {
    const image = el;
    const target = image;
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    cb();
                    observer.unobserve(target);
                }
            });
        },
        {
            rootMargin: "0px",
            threshold: 0.1,
        }
    );
    observer.observe(target);
};

document.querySelectorAll("img[data-src]").forEach((img) => {
    gsap.timeline({
        scrollTrigger: {
            trigger: img,
            scroller: document.body,
            once: true,
            start: "-500px bottom",
            onEnter: () => {
                img.src = img.dataset.src;
                window.dispatchEvent(new Event("lazy-img-load"));
            },
        },
    });
    addIntersectionOnceWithCallback(img, () => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        window.dispatchEvent(new Event("lazy-img-load"));
    });
});
document.querySelectorAll("[data-srcset]").forEach((img) => {
    addIntersectionOnceWithCallback(img, () => {
        img.setAttribute("srcset", img.dataset.srcset);
        window.dispatchEvent(new Event("lazy-img-load"));
    });
});
document.querySelectorAll(".ui-elements").forEach((img) => {
    addIntersectionOnceWithCallback(img, () => {
        document.querySelector("[data-footer-bg-lazy]").remove();
        window.dispatchEvent(new Event("lazy-img-load"));
    });
});



function fadeInDownFromHidden(selector, scroller = document.body) {
    document.querySelectorAll(selector).forEach(item => {
        item.innerHTML = `<div>${item.textContent}</div>`;
        item.style.overflow = 'hidden';
        gsap.timeline({
            scrollTrigger: {
                trigger: item,
                once: true,

            }
        })
            .fromTo(item.querySelector('div'), { yPercent: 100 }, {delay: 0.5, yPercent: 0, duration: 1, ease: "power4.out"})
            .add(() => {
                item.innerHTML = item.textContent;
                item.style.overflow = '';
            })
    });
}
fadeInDownFromHidden('.header-ozon>*');
document.querySelectorAll(".page__content video").forEach((video) => {
    gsap.timeline({
        scrollTrigger: {
            trigger: video,
            scroller: document.body,
            onEnter: () => {
                video.play();
            },
            onEnterBack: () => {
                video.play();
            },
            onLeaveBack: () => {
                video.pause();
            },
            onLeave: () => {
                video.pause();
            },
        },
    });
});
document.querySelectorAll(".line-through").forEach((el) => {
    gsap.set(el, { textDecoration: "none" });
    gsap.timeline({
        scrollTrigger: {
            trigger: el,
            scroller: document.body,
            once: true,
            onEnter: () => {
                setTimeout(() => {
                    el.removeAttribute("style");
                }, 2000);
            },
        },
    });
});
