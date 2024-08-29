document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.querySelector('.submit-button');
  const startExerciseLink = document.querySelector('.start-exercise-link');
  const userInput = document.querySelector('.user-input');
  const clickSound = document.getElementById('clickSound');

  function playClickSound() {
      clickSound.currentTime = 0;
      clickSound.play();
  }

  function showLoadingAnimation() {
    const actualContentArea = document.querySelector('.actual-content-area-2');
    const loadingContainer = document.getElementById('loading-animation-container-2');

    loadingContainer.style.display = 'block';
    loadingContainer.style.position = 'absolute';
    loadingContainer.style.top = '-30%';
    loadingContainer.style.left = '50%';
    loadingContainer.style.transform = 'translate(-50%, -50%)';
    loadingContainer.style.zIndex = '9999';
    loadingContainer.style.width = '30%';
    loadingContainer.style.height = '30%';

    actualContentArea.style.position = 'relative';
    actualContentArea.appendChild(loadingContainer);

    const animation = lottie.loadAnimation({
        container: document.getElementById('loading-animation-2'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'baby.json'
    });

    setTimeout(() => {
        animation.destroy();
        loadingContainer.style.display = 'none';
    }, 3000);
}

  submitButton.addEventListener('click', function() {
    playClickSound();
    showLoadingAnimation();
    setTimeout(() => {
        window.open('TestyourKnowledgeFinal.html', '_blank');
    }, 3000);
});

startExerciseLink.addEventListener('click', function(e) {
    e.preventDefault();
    playClickSound();
    showLoadingAnimation();
    setTimeout(() => {
        window.open('TestyourKnowledgeFinal.html', '_blank');
    }, 3000);
});

  userInput.addEventListener('click', playClickSound);
});
