class CircularCarousel {
    constructor() {
        this.rotationInterval = null;
        this.circlePath = MotionPathPlugin.convertToPath("#holder", false)[0];
        this.circlePath.id = "circlePath";
        this.circlePath.setAttribute("r", "100000"); // Increase the circle radius
        document.querySelector("svg").prepend(this.circlePath);

        this.contentItems = document.querySelectorAll('.content-item__cc');
        this.enterSuperhub = document.querySelector('#enterSuperhub');

        this.items = gsap.utils.toArray(".item");
        this.numItems = this.items.length;
        this.itemStep = 1 / this.numItems;
        this.wrapProgress = gsap.utils.wrap(0, 1);
        this.snap = gsap.utils.snap(this.itemStep);
        this.wrapTracker = gsap.utils.wrap(0, this.numItems);
        this.tracker = { item: 0 };
        this.tl = gsap.timeline({ paused: true, reversed: true });
        this.elementActive = undefined;

        this.startRotationObject();
        this.fastRotation();
    }

    moveWheel(amount) {
        let progress = this.getProgress(amount);
        let next = this.getNextIndex(this.tracker);
        this.tl.progress(progress);
        this.removeAndAddActiveElements(next);
        gsap.to(this.tl, {
            progress: this.snap(this.tl.progress() + amount),
            modifiers: {
                progress: this.wrapProgress
            }
        });
    }

    removeAndAddActiveElements(next) {
        document.querySelector('.item.active').classList.remove('active');
        this.items[next].classList.add('active');

        document.querySelector('.content-item__cc.active').classList.remove('active');
        this.contentItems[next].classList.add('active');
    }

    getNextIndex(tracker) {
        let next = (tracker.item + 3);
        return next >= 6 ? next % 6 : next;
    }

    getProgress(amount) {
        let progress = this.tl.progress();
        this.tl.progress(this.wrapProgress(this.snap(this.tl.progress() + amount)));
        return progress;
    }

    fastRotation() {
        document.querySelectorAll(".content-item__cc").forEach((item) => {
            item.classList.add("d-none");
        });
        this.rotationInterval = setInterval(() => {
            this.moveWheel(this.itemStep);
        }, 20);
    }

    startRotation() {
        this.rotationInterval = setInterval(() => {
            this.moveWheel(this.itemStep);
        }, 2000);
    }

    stopRotation() {
        clearInterval(this.rotationInterval);
    }

    startRotationObject() {
        this.inicializeRotation();
        this.inicializeEvents();
    }

    inicializeRotation() {
        gsap.set(this.items, {
            motionPath: {
                path: this.circlePath,
                align: this.circlePath,
                alignOrigin: [0.5, 0.5],
                end: i => i / this.items.length
            }, scale: 0.9,
        });

        this.tl.to('.wrapper', {
            rotation: 360,
            transformOrigin: 'center',
            duration: 1,
            ease: 'none'
        });

        this.tl.to(this.items, {
            rotation: "-=360",
            transformOrigin: 'center',
            duration: 1,
            ease: 'none',
        }, 0);

        this.tl.to(this.tracker, {
            item: this.numItems,
            duration: 1,
            ease: 'none',
            modifiers: {
                item: (value) => this.wrapTracker(this.numItems - Math.round(value))
            }
        }, 0);
    }

    inicializeEvents() {
        this.items.forEach((el, i) => {
            el.addEventListener("mouseenter", () => this.handleMouseEnter(el, i));
            el.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
        });
        this.enterSuperhub.addEventListener('animationend', this.handleAnimationEnd.bind(this));
    }

    handleAnimationEnd() {
        setTimeout(() => {
            clearInterval(this.rotationInterval);
            this.startRotation();
            document.querySelectorAll(".content-item__cc").forEach((item) => {
                item.classList.remove("d-none");
            });
        }, 1000);
    }

    handleMouseEnter(el, i) {
        let elementsActive = document.querySelectorAll(".content-item__cc");
        elementsActive.forEach((element, key) => {
            if (element.classList.contains("active")) {
                this.elementActive = key;
                element.classList.remove("active");
                this.items[key].classList.remove("active");
            }
        });
        this.contentItems[i].classList.add("active");
        this.stopRotation();
    }

    handleMouseLeave() {
        this.startRotation();
        document.querySelectorAll('.item.active, .content-item__cc.active').forEach((element) => {
            element.classList.remove('active');
        });
        if (this.elementActive !== undefined) {
            this.items[this.elementActive].classList.add("active");
            this.contentItems[this.elementActive].classList.add("active");
        }
    }
}

// Initialize the carousel
new CircularCarousel();