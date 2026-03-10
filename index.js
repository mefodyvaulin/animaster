addListeners();
const myAnimaster = animaster();
function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            myAnimaster.fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            myAnimaster.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            myAnimaster.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            myAnimaster.scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const reseter = myAnimaster.moveAndHide(block, 1000);

            document.getElementById('moveAndHideReset').addEventListener('click', function () {
                reseter.reset();
            })
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            myAnimaster.showAndHide(block, 1000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let stopObj = myAnimaster.heartBeating(block);
            document.getElementById('heartBeatingStop').addEventListener('click', function () {
                stopObj.stop();
            })
        });

}
function animaster (){
    function resetFadeIn(element){
        element.style.transitionDuration = null;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    function resetFadeOut(element){
        element.style.transitionDuration = null;
        element.classList.add('show');
        element.classList.remove('hide');
    }

    function resetMoveAndSale(element){
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return {
        _steps: [],
        play: function play(element) {
            for (let step of this._steps){
                step.func(element, step.args)
            }
        },

        addMove : function (duration, translation){
            this._steps.push({
                name: 'move',
                func: this.move,
                args: [duration, translation]}
            );
            return this;
        },

        addScale : function (duration, ratio){
            this._steps.push({
                name: 'scale',
                func: this.scale,
                args: [duration, ratio]}
            );
            return this;
        },

        addFadeIn  : function (duration){
            this._steps.push({
                name: 'fadeIn',
                func: this.fadeIn,
                args: [duration]}
            );
            return this;
        },

        addFadeOut : function (duration) {
            this._steps.push({
                name: 'fadeIn',
                func: this.fadeOut,
                args: [duration]}
            );
            return this;
        },

        fadeIn: function fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut: function fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        move: function move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale: function scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },


        moveAndHide(element, duration) {
            this.move(element, (duration * 2) / 5, {x: 100, y: 20});
            const timeout = setTimeout(() => {
                this.fadeOut(element, (duration * 3) / 5);
            }, (duration * 2) / 5);

            return {
                reset: function () {
                    clearTimeout(timeout);
                    resetFadeOut(element);
                    resetMoveAndSale(element);
                }
            }

        },

        showAndHide: function showAndHide(element, duration) {
            let interval = duration / 3
            this.fadeIn(element, interval);
            setTimeout( () => this.fadeOut(element, interval), interval);

        },

        heartBeating: function heartBeating(element) {
            const beat = () => {
                this.scale(element, 500, 1.4);
                setTimeout(() => this.scale(element, 500, 1), 500);
            };
            beat();
            const interval = setInterval(beat, 1000);

            return {
                stop: () => clearInterval(interval)
            }
        },



    };
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
