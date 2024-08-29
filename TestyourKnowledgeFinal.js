document.addEventListener('DOMContentLoaded', () => {
    const threeLinesFinal = document.querySelector('.three-lines-final');
    const threeLinesFinalNavigation = document.querySelector('.three-lines-final-navigation');
    const exerciseLinks = document.querySelectorAll('.three-lines-final-navigation a');
    const knowledgeExplanationArea = document.querySelector('.knowledge-explanation-area-final-page');
    const actualContentArea = document.querySelector('.actual-content-area-final-page');
    const exerciseTitle = document.querySelector('.heading-area-final-page h2');
    const submitButton = document.querySelector('.submit-button-final-page');

    // // Set initial content
    exerciseTitle.textContent = "Develop your career";
    knowledgeExplanationArea.innerHTML = "<p>Welcome to our exercise platform. Here you can practice and improve your skills. Select an exercise from the menu to get started.</p>";
    actualContentArea.innerHTML = "<p>Click on the three lines icon to choose an exercise and begin your learning journey.</p>";


    

    
    const startExerciseLinkFinalPage = document.querySelector('.start-exercise-link-final-page');

    startExerciseLinkFinalPage.addEventListener('click', function(e) {
        e.preventDefault();
        
        const result = confirm("Are you sure you want to end the exercise?");
        
        if (result) {
            window.location.href = 'TestYourKnowledge.html';
        }
        // If the user clicks Cancel, nothing happens and they stay on the current page
    })
    
    let currentExercise = '';
    let exerciseData = {};

    threeLinesFinal.addEventListener('click', toggleNavigation);

    document.body.addEventListener('click', (e) => {
        if (!threeLinesFinalNavigation.contains(e.target) && !threeLinesFinal.contains(e.target)) {
            closeNavigation();
        }
    });

    exerciseLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            currentExercise = link.getAttribute('data-exercise');
            exerciseTitle.textContent = link.textContent;
            loadExercise(currentExercise);
            updateActiveLink(link);
            closeNavigation();
        });
    });

    submitButton.addEventListener('click', evaluateExercise);
    startExerciseLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (exerciseLinks.length > 0) {
            exerciseLinks[0].click();
        }
    });

    function toggleNavigation() {
        threeLinesFinal.classList.toggle('active');
        threeLinesFinalNavigation.classList.toggle('active');
    }

    function closeNavigation() {
        threeLinesFinal.classList.remove('active');
        threeLinesFinalNavigation.classList.remove('active');
    }

    function updateActiveLink(activeLink) {
        exerciseLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    async function loadExercise(exerciseName) {
        try {
            const [htmlResponse, jsonResponse] = await Promise.all([
                fetch(`${exerciseName}.html`),
                fetch(`${exerciseName}.json`)
            ]);

            const html = await htmlResponse.text();
            exerciseData = await jsonResponse.json();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const explanation = doc.querySelector('.explanation');
            const content = doc.querySelector('.content');

            if (explanation && content) {
                knowledgeExplanationArea.innerHTML = explanation.innerHTML;
                actualContentArea.innerHTML = content.innerHTML;
                applyExerciseStyles();
            } else {
                throw new Error('Exercise content not found');
            }
        } catch (error) {
            console.error('Error loading exercise:', error);
            knowledgeExplanationArea.innerHTML = '<p>Error loading exercise. Please try again.</p>';
            actualContentArea.innerHTML = '';
        }
    }

    function applyExerciseStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .explanation p {
                font-size: 1rem;
                margin-bottom: 1rem;
            }
            .content {
                background-color: #38444d;
                padding: 1rem;
                border-radius: 0.5rem;
                margin-bottom: 1rem;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }
            .content p {
                font-size: 1rem;
                white-space: normal;
            }
            .user-input {
                background-color: white;
                color: black;
                border: none;
                padding: 0.25rem;
                margin: 0 0.25rem;
                width: 5rem;
                font-size: 1rem;
                display: inline-block;
                vertical-align: middle;
            }
        `;
        document.head.appendChild(style);
    }

    function evaluateExercise() {
        const userInputs = actualContentArea.querySelectorAll('.user-input');
        const userAnswers = Array.from(userInputs).map(input => input.value.replace(/\s/g, '').toLowerCase());
        const correctAnswers = exerciseData.answers.map(answer => answer.replace(/\s/g, '').toLowerCase());

        const isCorrect = userAnswers.every((answer, index) => answer === correctAnswers[index]);

        showOverlay(isCorrect);
    }

    function showOverlay(isSuccess) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = isSuccess ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';

        const animation = document.createElement('div');
        animation.className = isSuccess ? 'success-animation' : 'failure-animation';
        animation.textContent = isSuccess ? '✓' : '✗';
        animation.style.fontSize = '5rem';
        animation.style.marginBottom = '2rem';

        const button = document.createElement('button');
        button.textContent = isSuccess ? 'Next' : 'Try Again';
        button.style.padding = '0.5rem 1rem';
        button.style.fontSize = '1rem';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            document.body.removeChild(overlay);
            if (isSuccess) {
                const currentLink = document.querySelector(`a[data-exercise="${currentExercise}"]`);
                const nextExerciseLink = currentLink.parentElement.nextElementSibling;
                if (nextExerciseLink) {
                    nextExerciseLink.querySelector('a').click();
                } else {
                    alert('Congratulations! You have completed all exercises.');
                }
            } else {
                loadExercise(currentExercise);
            }
        });

        overlay.appendChild(animation);
        overlay.appendChild(button);
        document.body.appendChild(overlay);
    }
});