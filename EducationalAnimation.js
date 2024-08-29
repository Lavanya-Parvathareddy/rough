
        document.addEventListener('DOMContentLoaded', function() {
            const animations = [
                { container: 'animation1', path: 'Target.json' },
                { container: 'animation2', path: 'ActiveLearningAnimation.json' },
                { container: 'animation3', path: 'Timmer.json' },
                { container: 'animation4', path: 'Mindset2.json' },
                { container: 'conclusion-animation', path: 'StudyConclusionAnimation.json' }
            ];
            animations.forEach(anim => {
                lottie.loadAnimation({
                    container: document.getElementById(anim.container),
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: anim.path
                });
            });
        });
   