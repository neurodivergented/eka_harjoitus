const slideMenu = document.querySelector('.slideMenu');
const slideMenuCursorBox = document.querySelector('.slideMenuCursorBox');
const overlapTarget = document.querySelector('.side-content');

function isOverlapping(sliderMenu, mainArea) {
    return !(sliderMenu.right < mainArea.left || sliderMenu.left > mainArea.right || sliderMenu.bottom < mainArea.top || sliderMenu.top > mainArea.bottom);
}

function updateMenuVisibility() {
    if (slideMenu.classList.contains('open')) {
        slideMenu.classList.add('visible');
    } else {
        slideMenu.classList.remove('visible');
    }
}

slideMenuCursorBox.addEventListener('click', () => {
    slideMenu.classList.toggle('open');
    slideMenuCursorBox.classList.toggle('open');
    updateMenuVisibility();
});

window.addEventListener('resize', updateMenuVisibility);
window.addEventListener('scroll', updateMenuVisibility);

updateMenuVisibility();