gsap.registerPlugin(MotionPathPlugin);

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

items.forEach(function (el, i) {
    el.addEventListener("click", function () {
        var current = tracker.item,
            activeItem = i;

        if (i === current) {
            return;
        }

        //set active item to the item that was clicked and remove active class from all items
        document.querySelector('.item.active').classList.remove('active');
        items[activeItem].classList.add('active');

        var diff = current - i;

        if (Math.abs(diff) < numItems / 2) {
            moveWheel(diff * itemStep);
        } else {
            var amt = numItems - Math.abs(diff);

            if (current > i) {
                moveWheel(amt * -itemStep);
            } else {
                moveWheel(amt * itemStep);
            }
        }
    });
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
    let next = tracker.item;
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

(() => {
    setInterval(() => {
        moveWheel(itemStep)
    }, 2000);
})();
