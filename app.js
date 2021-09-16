const container = document.querySelector('.container');
const slideLeft = document.querySelector('.slide-left');
const slideRight = document.querySelector('.slide-right');
const buttonDown = document.querySelector('.button-down');
const buttonUp = document.querySelector('.button-up');
const slidesCount = slideRight.querySelectorAll('div').length;

const sliderHeight = container.clientHeight;

let activeSlideIndex = 0;

const threshold = sliderHeight / 4;
let positionLeftY1 = 0;
let positionLeftY2 = 0;
let positionRightY1 = 0;
let positionRightY2 = 0;
let posInitialLeft;
let posInitialRight;
let posFinalLeft;
let posFinalRight;

const cloneExtremeElements = (slider) => {
    const slides = slider.querySelectorAll('div');
    const firstSlide = slides[0];
    const lastSlide = slides[slidesCount - 1];
    const cloneFirst = firstSlide.cloneNode(true);
    const cloneLast = lastSlide.cloneNode(true);
    
    slider.appendChild(cloneFirst);
    slider.insertBefore(cloneLast, firstSlide);
}

const changeSlide = (direction, action) => {
    slideLeft.classList.add('shifting');
    slideRight.classList.add('shifting');
    container.style.pointerEvents = 'none';

    if (!action) {
        posInitialLeft = slideLeft.offsetTop;
        posInitialRight = slideRight.offsetTop;    
    }

    if (direction === 'up') {
        activeSlideIndex++;
        slideLeft.style.top = `${(posInitialLeft - sliderHeight)}px`;
        slideRight.style.top = `${(posInitialRight + sliderHeight)}px`;
    } else if (direction === 'down') {
        activeSlideIndex--;
        slideLeft.style.top = `${(posInitialLeft + sliderHeight)}px`;
        slideRight.style.top = `${(posInitialRight - sliderHeight)}px`;
    }
}

const checkIndex = () => {
    slideLeft.classList.remove('shifting');
    slideRight.classList.remove('shifting');
    container.style.pointerEvents = 'visiblePainted';

    if (activeSlideIndex > slidesCount - 1) {
        slideLeft.style.top = `-${100}vh`;
        slideRight.style.top = `-${slidesCount * 100}vh`;
        activeSlideIndex = 0;
    } else if (activeSlideIndex < 0) {
        slideLeft.style.top = `-${slidesCount * 100}vh`;
        slideRight.style.top = `-${100}vh`;
        activeSlideIndex = slidesCount - 1;
    }
}

const dragStart = (evt) => {
    evt.preventDefault();
    posInitialLeft = slideLeft.offsetTop;
    posInitialRight = slideRight.offsetTop;
    
    if (evt.type == 'touchstart') {
      positionLeftY1 = evt.touches[0].clientY;
      positionRightY1 = evt.touches[0].clientY;
    } else {
      positionLeftY1 = evt.clientY;
      positionRightY1 = evt.clientY;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  const dragAction = (evt) => {    
    if (evt.type == 'touchmove') {
      positionLeftY2 = positionLeftY1 - evt.touches[0].clientY;
      positionLeftY1 = evt.touches[0].clientY;
      positionRightY2 = positionRightY1 - evt.touches[0].clientY;
      positionRightY1 = evt.touches[0].clientY;
    } else {
      positionLeftY2 = positionLeftY1 - evt.clientY;
      positionLeftY1 = evt.clientY;
      positionRightY2 = positionRightY1 - evt.clientY;
      positionRightY1 = evt.clientY;
    }
    slideLeft.style.top = (slideLeft.offsetTop - positionLeftY2) + "px";
    slideRight.style.top = (slideRight.offsetTop + positionRightY2) + "px";
  }
  
  const dragEnd = () => {
    posFinalLeft = slideLeft.offsetTop;
    posFinalRight = slideRight.offsetTop;
    if (posFinalLeft - posInitialLeft < -threshold) {
      changeSlide('up', 'drag');
    } else if (posFinalLeft - posInitialLeft > threshold) {
      changeSlide('down', 'drag');
    } else {
      slideLeft.style.top = (posInitialLeft) + "px";
      slideRight.style.top = (posInitialRight) + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

cloneExtremeElements(slideLeft);
cloneExtremeElements(slideRight);

slideLeft.style.top = `-${100}vh`;
slideRight.style.top = `-${slidesCount * 100}vh`;

buttonDown.addEventListener('click', () => changeSlide('down'));
buttonUp.addEventListener('click', () => changeSlide('up'));

slideLeft.addEventListener('transitionend', checkIndex);

slideLeft.onmousedown = dragStart;
slideRight.onmousedown = dragStart;
  
slideLeft.addEventListener('touchstart', dragStart);
slideLeft.addEventListener('touchend', dragEnd);
slideLeft.addEventListener('touchmove', dragAction);
slideRight.addEventListener('touchstart', dragStart);
slideRight.addEventListener('touchend', dragEnd);
slideRight.addEventListener('touchmove', dragAction);

document.querySelector('.slide-right').addEventListener('click', function() {
    document.querySelector('.slide-left').classList.toggle('menu-close');
    this.classList.toggle('menu-close');

})