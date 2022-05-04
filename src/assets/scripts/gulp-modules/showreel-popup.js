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