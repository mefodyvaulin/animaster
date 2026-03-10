addListeners();

function animaster() {
    function _clone(source) {
        const copy = animaster();
        source._steps.forEach(step => copy._steps.push(step));
        return copy;
    }

    return {
        _steps: [],

        addMove(duration, translation) {
            const next = _clone(this);
            next._steps.push({ type: 'move', duration, translation });
            return next;
        },

        addScale(duration, ratio) {
            const next = _clone(this);
            next._steps.push({ type: 'scale', duration, ratio });
            return next;
        },

        addFadeIn(duration) {
            const next = _clone(this);
            next._steps.push({ type: 'fadeIn', duration });
            return next;
        },

        addFadeOut(duration) {
            const next = _clone(this);
            next._steps.push({ type: 'fadeOut', duration });
            return next;
        },

        addDelay(duration) {
            const next = _clone(this);
            next._steps.push({ type: 'delay', duration });
            return next;
        },

        addShake(duration, distance) {
            const t = duration / 4;
            return this.addMove(t, { x: distance, y: 0 })
                .addMove(t, { x: -distance, y: 0 })
                .addMove(t, { x: distance, y: 0 })
                .addMove(t, { x: 0, y: 0 });
        },

        play(element, cycled = false) {
            let timers = [];
            const run = () => {
                let delay = 0;
                this._steps.forEach(step => {
                    const timeout = setTimeout(() => {
                        element.style.transitionDuration = `${step.duration}ms`;
                        if (step.type === 'move') {
                            element.style.transform = `translate(${step.translation.x}px,${step.translation.y}px)`;
                        } else if (step.type === 'scale') {
                            element.style.transform = `scale(${step.ratio})`;
                        } else if (step.type === 'fadeIn') {
                            element.classList.remove('hide');
                            element.classList.add('show');
                        } else if (step.type === 'fadeOut') {
                            element.classList.remove('show');
                            element.classList.add('hide');
                        }
                    }, delay);
                    timers.push(timeout);
                    delay += step.duration;
                });
                if (cycled) timers.push(setTimeout(run, delay));
            };
            run();
            return {
                stop: () => timers.forEach(clearTimeout),
                reset: () => {
                    timers.forEach(clearTimeout);
                    element.style.transitionDuration = null;
                    element.style.transform = null;
                    element.classList.remove('show', 'hide');
                }
            };
        },

        move(el, dur, trans) { return this.addMove(dur, trans).play(el); },
        scale(el, dur, ratio) { return this.addScale(dur, ratio).play(el); },
        fadeIn(el, dur) { return this.addFadeIn(dur).play(el); },
        fadeOut(el, dur) { return this.addFadeOut(dur).play(el); },

        moveAndHide(el, dur) {
            return this.addMove(dur * 0.4, { x: 100, y: 20 }).addFadeOut(dur * 0.6).play(el);
        },
        showAndHide(el, dur) {
            return this.addFadeIn(dur / 3).addDelay(dur / 3).addFadeOut(dur / 3).play(el);
        },
        heartBeating(el) {
            return this.addScale(500, 1.4).addScale(500, 1).play(el, true);
        },

        buildHandler() {
            return (e) => this.play(e.target);
        }
    };
}

function addListeners() {
    const master = animaster();

    document.getElementById('fadeInPlay').addEventListener('click', () => {
        master.fadeIn(document.getElementById('fadeInBlock'), 5000);
    });

    document.getElementById('movePlay').addEventListener('click', () => {
        master.move(document.getElementById('moveBlock'), 1000, { x: 100, y: 10 });
    });

    document.getElementById('scalePlay').addEventListener('click', () => {
        master.scale(document.getElementById('scaleBlock'), 1000, 1.25);
    });

    document.getElementById('fadeOutPlay')?.addEventListener('click', () => {
        master.fadeOut(document.getElementById('fadeOutBlock'), 5000);
    });

    let heartControl;
    document.getElementById('heartBeatingPlay')?.addEventListener('click', () => {
        heartControl = master.heartBeating(document.getElementById('heartBeatingBlock'));
    });
    document.getElementById('heartBeatingStop')?.addEventListener('click', () => {
        heartControl?.stop();
    });

    let mhControl;
    document.getElementById('moveAndHidePlay')?.addEventListener('click', () => {
        mhControl = master.moveAndHide(document.getElementById('moveAndHideBlock'), 5000);
    });
    document.getElementById('moveAndHideReset')?.addEventListener('click', () => {
        mhControl?.reset();
    });

    document.getElementById('showAndHidePlay')?.addEventListener('click', () => {
        master.showAndHide(document.getElementById('showAndHideBlock'), 3000);
    });

    const shakeHandler = master.addShake(400, 20).buildHandler();
    document.getElementById('shakeBlock')?.addEventListener('click', shakeHandler);
}