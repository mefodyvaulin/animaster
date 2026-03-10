addListeners();

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return {
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        moveAndHide(element, duration) {
            this.move(element, (duration * 2) / 5, { x: 100, y: 20 });
            const timeout = setTimeout(() => {
                this.fadeOut(element, (duration * 3) / 5);
            }, (duration * 2) / 5);

            return {
                reset: () => {
                    clearTimeout(timeout);
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                }
            };
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => {
                this.fadeOut(element, duration / 3);
            }, (duration * 2) / 3);
        },

        heartBeating(element) {
            const beat = () => {
                this.scale(element, 500, 1.4);
                setTimeout(() => this.scale(element, 500, 1), 500);
            };
            beat();
            const interval = setInterval(beat, 1000);

            return {
                stop: () => clearInterval(interval)
            };
        }
    };
}

function addListeners() {
    const master = animaster();

    document.getElementById('fadeInPlay').addEventListener('click', () => {
        master.fadeIn(document.getElementById('fadeInBlock'), 5000);
    });

    document.getElementById('fadeOutPlay').addEventListener('click', () => {
        master.fadeOut(document.getElementById('fadeOutBlock'), 5000);
    });

    document.getElementById('movePlay').addEventListener('click', () => {
        master.move(document.getElementById('moveBlock'), 1000, { x: 100, y: 10 });
    });

    document.getElementById('scalePlay').addEventListener('click', () => {
        master.scale(document.getElementById('scaleBlock'), 1000, 1.25);
    });

    let moveAndHideControl;
    document.getElementById('moveAndHidePlay').addEventListener('click', () => {
        const block = document.getElementById('moveAndHideBlock');
        moveAndHideControl = master.moveAndHide(block, 5000);
    });

    document.getElementById('moveAndHideReset').addEventListener('click', () => {
        if (moveAndHideControl) moveAndHideControl.reset();
    });

    document.getElementById('showAndHidePlay').addEventListener('click', () => {
        master.showAndHide(document.getElementById('showAndHideBlock'), 3000);
    });

    let heartBeatingControl;
    document.getElementById('heartBeatingPlay').addEventListener('click', () => {
        const block = document.getElementById('heartBeatingBlock');
        heartBeatingControl = master.heartBeating(block);
    });

    document.getElementById('heartBeatingStop').addEventListener('click', () => {
        if (heartBeatingControl) heartBeatingControl.stop();
    });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
