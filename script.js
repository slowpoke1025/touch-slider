const slider = document.querySelector('.container')
const slides = [...document.querySelectorAll('.slide')]

let isDrag = false;
let startX = 0    // start touch point -> getPosX(e)
let prevTranslate = 0   // start position (currentIndex * vw)
let delta = 0   // current touch point - start touch point
let animationID = 0
let currentIndex = 0


let startY = 0
let endY = 0
// make responsive to viewport changes
window.addEventListener('resize', setPosByIndex)

// prevent menu poping up by long press 
window.oncontextmenu = e => {
    e.preventDefault()
    e.stopPropagation()
    return false
}


slides.forEach((slide, i) => {

    // touch
    slide.addEventListener('touchstart', touchStart(i))
    slide.addEventListener('touchmove', touchMove)
    slide.addEventListener('touchend', touchEnd)

    //drag
    slide.addEventListener('mousedown', touchStart(i))
    slide.addEventListener('mouseup', touchEnd)
    slide.addEventListener('mousemove', touchMove)
    slide.addEventListener('mouseleave', touchEnd)
})


function touchStart(i) {

    return e => {
        e.preventDefault() // prevent default img drag
        currentIndex = i
        startX = getPosX(e)
        startY = getPosY(e)
        isDrag = true;
        animationID = requestAnimationFrame(animation) // start animation
        slider.classList.add('grabbing')
    }
}

function touchMove(e) {
    if (isDrag) {
        const currentPos = getPosX(e)
        delta = currentPos - startX
        endY = getPosY(e)
    }
}


function touchEnd(e) {
    isDrag = false
    cancelAnimationFrame(animationID) // stop animation
    slider.classList.remove('grabbing')

    if (endY - startY < -200) {

        return location.href = slides[currentIndex].querySelector('a').href;
    }

    if (delta < -100 && currentIndex < slides.length - 1)   //left slide
        ++currentIndex
    else if (delta > 100 && currentIndex > 0)   //right slide
        --currentIndex


    setPosByIndex()  // new position
}

function getPosX(e) {
    return e.type.includes('touch')
        ? e.touches[0].clientX
        : e.clientX
}

function getPosY(e) {
    return e.type.includes('touch')
        ? e.touches[0].clientY
        : e.clientY
}

function setSliderPos() {
    slider.style.transform = `translateX(${prevTranslate + delta}px)`
    // translated based by the middle page
}

function setPosByIndex() {
    prevTranslate = currentIndex * -window.innerWidth;
    delta = 0;
    setSliderPos();
}


function animation() {
    setSliderPos()
    if (isDrag)
        requestAnimationFrame(animation) // recursive
}





