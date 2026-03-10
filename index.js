addListeners();

function animaster() {
    function _clone(context) {
        const newInstance = animaster();
        newInstance._steps.push(...context._steps);
        return newInstance;
    }

    return {
        _steps: [],

        addMove(duration, translation) {
            const clone = _clone(this);
            clone._steps.push({ type: 'move', duration, translation });
            return clone;
        },

        addScale(duration, ratio) {
            const clone = _clone(this);
            clone._steps.push({ type: 'scale', duration, ratio });
            return clone;
        },

        addFadeIn(duration) {
            const clone = _clone(this);
            clone._steps.push({ type: 'fadeIn', duration });
            return clone;
        },

        addFadeOut(duration) {
            const clone = _clone(this);
            clone._steps.push({ type: 'fadeOut', duration });
            return clone;
        },

        addDelay(duration) {
            const clone = _clone(this);
            clone._steps.push({ type: 'delay', duration });
            return clone;
        },

        addShake(duration, distance) {
            const clone = _clone(this);
            const stepTime = duration / 4;
            clone._steps.push(
                { type: 'move', duration: stepTime, translation: { x: distance, y: 0 } },
                { type: 'move', duration: stepTime, translation: { x: -distance, y: 0 } },
                { type: 'move', duration: stepTime, translation: { x: distance, y: 0 } },
                { type: 'move', duration: stepTime, translation: { x: 0, y: 0 } }
            );
            return clone;
        },

        play(element, cycled = false) {
            let timers = [];
            
            const perform = () => {
                let offset = 0;
                this._steps.forEach(step => {
                    const timeout = setTimeout(() => {
                        element.style.transitionDuration = `${step.duration}ms`;
                        if (step.type === 'move') {
                            element.style.transform = `translate(${step.translation.x}px, ${step.translation.y}px)`;
                        } else if (step.type === 'scale') {
                            element.style.transform = `scale(${step.ratio})`;
                        } else if (step.type === 'fadeIn') {
                            element.classList.replace('hide', 'show');
                        } else if (step.type === 'fadeOut') {
                            element.classList.replace('show', 'hide');
                        }
                    }, offset);
                    timers.push(timeout);
                    offset += step.duration;
                });

                if (cycled) {
                    const loop = setTimeout(perform, offset);
                    timers.push(loop);
                }
            };

            perform();

            return {
                stop: () => timers.forEach(clearTimeout),
                reset: () => {
                    timers.forEach(clearTimeout);
                    element.style.transitionDuration = null;
                    element.style.transform = null;
                }
            };
        },

        buildHandler() {
            const self = this;
            return function() {
                self.play(this);
            };
        }
    };
}

function addListeners() {
    const master = animaster();
    const moveStep = master.addMove(500, {x: 50, y: 0});
    const fullAnim = moveStep.addFadeOut(500); 

    const shakeHandler = animaster().addShake(400, 10).buildHandler();
    
    const shakeBlock = document.getElementById('shakeBlock');
    if (shakeBlock) shakeBlock.addEventListener('click', shakeHandler);
}
