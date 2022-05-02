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

function homeAnimationAdditional() {
    const addIntersectionOnceWithCallback = (el, cb = () => {
    }, config = {}) => {
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
            ...config
        });
        observer.observe(target);
    }

    function splitToLinesAndFadeUp(selector, $scroller) {
        document.querySelectorAll(selector).forEach(text => {
            let mathM = text.innerHTML.match(/<\s*(\w+\b)(?:(?!<\s*\/\s*\1\b)[\s\S])*<\s*\/\s*\1\s*>|\S+/g);
            if (mathM === null) return;
            mathM = mathM.map(el => `<span style="display:inline-flex; overflow: hidden"><span>${el}</span></span>`);
            text.innerHTML = mathM.join(' ');

            let tl = gsap
                .timeline({
                    paused: true,
                    scrollTrigger: {
                        // scroller: $scroller ? $scroller : null,
                        trigger: text,
                        once: true,
                    },
                })
                .fromTo(
                    text.querySelectorAll('span>span'),
                    {yPercent: 100, start: '-100% top',},
                    {yPercent: 0, stagger: 0.1, duration: 1.5, end: '100% top', ease: 'power4.out'},
                );
            addIntersectionOnceWithCallback(text, () => {
                tl.play();
            })
        });
    }

    splitToLinesAndFadeUp('.project__title h1, .project__real-estate p, .project__link a, .goals__item h3, .goals__item p, h2, .section-title p, .section-content__item h3, .section-content__item p, .model-3d__item h4, .model-3d__item p, .viewer-interest__item h3, .viewer-interest__item p, .crm__functionality-item h3, .crm__functionality-item p, .crm__admin-text h3, .crm__admin-text p, .results__item-left p, .results__item-left h3');
}
homeAnimationAdditional();

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

// const paralaxPattern = document.querySelectorAll('.main-section__deco img');
// paralaxPattern.forEach((image) => {
//     const wrap = document.createElement('div');
//     wrap.style.overflow = 'visible';
//     wrap.style.height = 'auto';
//     image.parentElement.prepend(wrap);
//     gsap.set(image, { willChange: 'transform',  rotate: 0 });
//     wrap.prepend(image);
//
//     gsap
//         .timeline({
//             ease: 'none',
//             scrollTrigger: {
//                 start: -100 % bottom,
//                 end: 100 % bottom,
//                 trigger: wrap,
//                 scrub: 1.1,
//             },
//         })
//         .fromTo(
//             image,
//             {
//                 scale: 1,
//             },
//             {
//                 scale: 1.1,
//                 ease: 'ease',
//             },
//         );
// });
// const paralaxImages = document.querySelectorAll('[data-paralax]');
// paralaxImages.forEach((image) => {
//     const wrap = document.createElement('div');
//     wrap.style.overflow = 'visible';
//     // wrap.style.overflow = 'hidden';
//     // wrap.style.height = '100%';
//     wrap.style.height = 'auto';
//     image.parentElement.prepend(wrap);
//     // gsap.set(image, { willChange: 'transform', scale: 0.9, rotate: 0 });
//     gsap.set(image, { willChange: 'transform',  scale: 1.1 });
//     wrap.prepend(image);
//     gsap
//         .timeline({
//             ease: 'none',
//             scrollTrigger: {
//                 // start: -100 % bottom,
//                 // end: 100 % bottom,
//                 trigger: wrap,
//                 scrub: 0.5,
//                 scroller: '.page__inner',
//                 onLeave: () => {
//                     // console.log('leave');
//                 },
//                 // markers: true,
//             },
//         })
//         .fromTo(
//             image,
//             {
//                 y: 0,
//                 scale: 1,
//             },
//             {
//                 // y: -50,
//                 scale: 1.1,
//                 ease: 'linear',
//             },
//         );
// });

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

// document.querySelectorAll(".ui-elements").forEach((img) => {
//     addIntersectionOnceWithCallback(img, () => {
//         document.querySelector("[data-footer-bg-lazy]").remove();
//         window.dispatchEvent(new Event("lazy-img-load"));
//     });
// });

// function fadeInDownFromHidden(selector, scroller = document.body) {
//     document.querySelectorAll(selector).forEach(item => {
//         item.innerHTML = `<div>${item.textContent}</div>`;
//         item.style.overflow = 'hidden';
//         gsap.timeline({
//             scrollTrigger: {
//                 trigger: item,
//                 once: true,
//
//             }
//         })
//             .fromTo(item.querySelector('div'), { yPercent: 100 }, {delay: 0.5, yPercent: 0, duration: 1, ease: "power4.out"})
//             .add(() => {
//                 item.innerHTML = item.textContent;
//                 item.style.overflow = '';
//             })
//     });
// }
// fadeInDownFromHidden('.header-neboshill>*');

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
