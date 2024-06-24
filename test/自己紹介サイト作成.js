function showElementAnimation() {
    const elements = document.getElementsByClassName('brock');
  
    const showTiming = window.innerHeight > 768 ? 200 : 40; 
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
  
    for (let i=0;i<elements.length;i++){
      const clientRect = elements[i].getBoundingClientRect();
      const elemY = scrollY + clientRect.bottom;
      if(scrollY + windowH - showTiming > elemY) {
        elements[i].classList.add('show');
      } else if(scrollY + windowH < elemY) {
        elements[i].classList.remove('show');
      }
    }
  }
  showElementAnimation();
  window.addEventListener('scroll', showElementAnimation);
  
  