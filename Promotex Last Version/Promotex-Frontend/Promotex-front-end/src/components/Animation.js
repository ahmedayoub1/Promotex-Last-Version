// Adds a class for animation, then removes it after animation ends
export function animateCSS(element, animationName, callback) {
  element.classList.add('animated', animationName);

  function handleAnimationEnd() {
    element.classList.remove('animated', animationName);
    element.removeEventListener('animationend', handleAnimationEnd);

    if (typeof callback === 'function') callback();
  }

  element.addEventListener('animationend', handleAnimationEnd);
}