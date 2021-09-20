const container = document.querySelector('.container');
const slideRight = document.querySelector('.slide-right');
const buttonDown = document.querySelector('.button-down');
const buttonUp = document.querySelector('.button-up');
const slidesCount = slideRight.querySelectorAll('section').length;

const sliderHeight = container.clientHeight;

let activeSlideIndex = 0;

const threshold = sliderHeight / 4;
let positionRightY1 = 0;
let positionRightY2 = 0;
let posInitialRight;
let posFinalRight;

const cloneExtremeElements = (slider) => {
    const slides = slider.querySelectorAll('section');
    const firstSlide = slides[0];
    const lastSlide = slides[slidesCount - 1];
    const cloneFirst = firstSlide.cloneNode(true);
    const cloneLast = lastSlide.cloneNode(true);
    
    slider.appendChild(cloneFirst);
    slider.insertBefore(cloneLast, firstSlide);
}

const changeSlide = (direction, action) => {
    slideRight.classList.add('shifting');
    container.style.pointerEvents = 'none';

    if (!action) {
        posInitialRight = slideRight.offsetTop;    
    }

    activeSlideIndex -= direction;
    slideRight.style.top = `${(posInitialRight + direction * sliderHeight)}px`;  
}

const changeSlideBurger = (slideIndex, action) => {
  if (slideIndex === activeSlideIndex) {
    checkIndex;
    return;
  }

  slideRight.classList.add('shifting');
  container.style.pointerEvents = 'none';

  if (!action) {
    posInitialRight = slideRight.offsetTop;    
  }

  slideRight.style.top = `${(posInitialRight - (slideIndex - activeSlideIndex) * sliderHeight)}px`;  
  activeSlideIndex = slideIndex;
}

const changeSelectedBurger = (activeSlideIndex) => {
  document.querySelectorAll('.slide-left nav .item-wrapper').forEach((el) => {
    el.classList.remove('selected');
  });
  document.querySelectorAll('.slide-left nav .item-wrapper')[activeSlideIndex].classList.add('selected');
}

const checkIndex = () => {
    slideRight.classList.remove('shifting');
    container.style.pointerEvents = 'visiblePainted';

    if (activeSlideIndex > slidesCount - 1) {
        slideRight.style.top = `-${100}vh`;
        activeSlideIndex = 0;
    } else if (activeSlideIndex < 0) {
        slideRight.style.top = `-${slidesCount * 100}vh`;
        activeSlideIndex = slidesCount - 1;
    }
    changeSelectedBurger(activeSlideIndex);
}

const dragStart = (evt) => {
    evt.preventDefault();
    posInitialRight = slideRight.offsetTop;
    
    if (evt.type == 'touchstart') {
      positionRightY1 = evt.touches[0].clientY;
    } else {
      positionRightY1 = evt.clientY;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  const dragAction = (evt) => {    
    if (evt.type == 'touchmove') {
      positionRightY2 = positionRightY1 - evt.touches[0].clientY;
      positionRightY1 = evt.touches[0].clientY;
    } else {
      positionRightY2 = positionRightY1 - evt.clientY;
      positionRightY1 = evt.clientY;
    }
    slideRight.style.top = (slideRight.offsetTop + positionRightY2) + "px";
  }
  
  const dragEnd = () => {
    posFinalRight = slideRight.offsetTop;
    if (posFinalRight - posInitialRight < -threshold) {
      changeSlide(1, 'drag');
    } else if (posFinalRight - posInitialRight > threshold) {
      changeSlide(-1, 'drag');
    } else {
      slideRight.style.top = (posInitialRight) + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

cloneExtremeElements(slideRight);

slideRight.style.top = `-${100}vh`;

buttonDown.addEventListener('click', () => changeSlide(-1, ""));
buttonUp.addEventListener('click', () => changeSlide(1, ""));

slideRight.addEventListener('transitionend', checkIndex);

slideRight.onmousedown = dragStart;
  
slideRight.addEventListener('touchstart', dragStart);
slideRight.addEventListener('touchend', dragEnd);
slideRight.addEventListener('touchmove', dragAction);

document.querySelector('.button-menu').addEventListener('click', function() {
    document.querySelector('.slide-left').classList.toggle('menu-close');
    document.querySelector('.buttons-action').classList.toggle('menu-close');
    document.querySelector('.slide-right').classList.toggle('menu-close');
})
document.querySelector('.close-wrapper').addEventListener('click', function() {
  document.querySelector('.slide-left').classList.toggle('menu-close');
  document.querySelector('.buttons-action').classList.toggle('menu-close');
  document.querySelector('.slide-right').classList.toggle('menu-close');
})


let counter = 0;
document.querySelectorAll('.slide-left nav .item-wrapper').forEach((el) => {
  let clickHandler = (el, counter) => {
    el.addEventListener('click', function() {
      changeSlideBurger(counter);
    });  
  }
  clickHandler(el, counter);
  counter += 1;
})

document.querySelector('.slide-left nav').addEventListener('transitionend', checkIndex);