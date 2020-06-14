import {select, classNames} from '../settings.js';

class Carousel {
  constructor () {
    let slides = document.querySelectorAll(select.carousel.slides);
    let points = document.querySelectorAll(select.carousel.points);
    let currentSlide = 0;
    setInterval(nextSlide, 3000);

    function nextSlide() {
      slides[currentSlide].classList.remove(classNames.slides.active);
      points[currentSlide].classList.remove(classNames.points.active);

      currentSlide = (currentSlide + 1) % slides.length;

      slides[currentSlide].classList.add(classNames.slides.active);
      points[currentSlide].classList.add(classNames.points.active);
    }
  }
}

export default Carousel;