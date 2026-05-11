const slideMenu = document.querySelector('.slideMenu');
const slideMenuBox = document.querySelector('.slideMenuBox');
const overlapTarget = document.querySelector('.side-content');

function isOverlapping(sliderMenu, mainArea) {
    return !(sliderMenu.right < mainArea.left || sliderMenu.left > mainArea.right || sliderMenu.bottom < mainArea.top || sliderMenu.top > mainArea.bottom);
}

function updateMenuVisibility() {
    const menu = slideMenu.getBoundingClientRect();
    const target = overlapTarget.getBoundingClientRect();
    const hasOverlap = isOverlapping(menu, target);

    if (slideMenu.classList.contains('open') && hasOverlap) {
        slideMenu.classList.add('visible');
    } else {
        slideMenu.classList.remove('visible');
    }
}

slideMenuBox.addEventListener('mouseenter', () => {
    slideMenu.classList.add('open');
    updateMenuVisibility();
});

slideMenu.addEventListener('mouseleave', () => {
    slideMenu.classList.remove('open');
    updateMenuVisibility();
});

window.addEventListener('resize', updateMenuVisibility);
window.addEventListener('scroll', updateMenuVisibility);

updateMenuVisibility();