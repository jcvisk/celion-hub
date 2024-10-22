gsap.registerPlugin(MotionPathPlugin);
var rotationInterval;
const circlePath = MotionPathPlugin.convertToPath("#holder", false)[0];
circlePath.id = "circlePath";
circlePath.setAttribute("r", "100000"); // Aumenta el radio del círculo
document.querySelector("svg").prepend(circlePath);

const contentItems = document.querySelectorAll('.content-item__cc');

let items = gsap.utils.toArray(".item"),
    numItems = items.length,
    itemStep = 1 / numItems,
    wrapProgress = gsap.utils.wrap(0, 1),
    snap = gsap.utils.snap(itemStep),
    wrapTracker = gsap.utils.wrap(0, numItems),
    tracker = {item: 0};

gsap.set(items, {
    motionPath: {
        path: circlePath,
        align: circlePath,
        alignOrigin: [0.5, 0.5],
        end: i => i / items.length
    }, scale: 0.9,
    //transformOrigin: '50% 50%' // Asegura que el origen de la transformación esté centrado
});

const tl = gsap.timeline({paused: true, reversed: true});

tl.to('.wrapper', {
    rotation: 360,
    transformOrigin: 'center',
    duration: 1,
    ease: 'none'
});

tl.to(items, {
    rotation: "-=360",
    transformOrigin: 'center',
    duration: 1,
    ease: 'none',
}, 0);

tl.to(tracker, {
    item: numItems,
    duration: 1,
    ease: 'none',
    modifiers: {
        item(value) {
            return wrapTracker(numItems - Math.round(value))
        }
    }
}, 0);
let elementActive;
items.forEach(function (el, i) {
    el.addEventListener("mouseenter", function () {
        let elementsActive = document
            .querySelectorAll(".content-item__cc");
        elementsActive.forEach((element, key) => {
            if(element.classList.contains("active")) {
                elementActive = key;
                element.classList.remove("active");
                items[key].classList.remove("active");
            }
        });

        contentItems[i].classList.add("active");
        stopRotation();
    });
    el.addEventListener("mouseleave", function () {
        startRotation();
        document.querySelectorAll('.item').forEach((element) =>{
            element.classList.remove('active');
        });
        document.querySelectorAll('.content-item__cc').forEach((element) =>{
            element.classList.remove('active');
        });
        items[elementActive].classList.add("active");
        contentItems[elementActive].classList.add("active");
    });
});

// Selecciona el elemento con la animación de WOW.js
const enterSuperhub = document.querySelector('#enterSuperhub');
document.querySelectorAll(".content-item__cc").forEach((item, index) => {
    item.classList.add("d-none");
});
rotationInterval = setInterval(() => {
    moveWheel(itemStep);
}, 20);
// Añade un listener para el evento 'animationend'
enterSuperhub.addEventListener('animationend', () => {
    // Código a ejecutar cuando la animación termine
    console.log('Animación de WOW.js terminada');
    // Aquí puedes llamar a cualquier función o ejecutar cualquier código

    setTimeout(() => {
        clearInterval(rotationInterval);
        startRotation();
        document.querySelectorAll(".content-item__cc").forEach((item, index) => {
            item.classList.remove("d-none");
        });
    }, 1000);
});





/*document.getElementById('next').addEventListener("click", function () {
return moveWheel(-itemStep);
});

document.getElementById('prev').addEventListener("click", function () {
return moveWheel(itemStep);
});*/


function moveWheel(amount, i, index) {
    let progress = tl.progress();
    tl.progress(wrapProgress(snap(tl.progress() + amount)))
    let next = (tracker.item+3);
    next = next >= 7 ? next % 7 : next;
    tl.progress(progress);

    document.querySelector('.item.active').classList.remove('active');
    items[next].classList.add('active');

    document.querySelector('.content-item__cc.active').classList.remove('active');
    contentItems[next].classList.add('active');

    gsap.to(tl, {
        progress: snap(tl.progress() + amount),
        modifiers: {
            progress: wrapProgress
        }
    });
}
function startRotation() {
  rotationInterval = setInterval(() => {
    moveWheel(itemStep);
  }, 2000);
}
function stopRotation() {
  clearInterval(rotationInterval);
}
