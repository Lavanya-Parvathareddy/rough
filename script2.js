document.addEventListener('DOMContentLoaded', function() {
    const threeLinesIcon = document.querySelector('.three-lines-icon');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const coursesArea = document.querySelector('.courses-area');
    const namesArea = document.querySelector('.names-area');
    const courseList = document.querySelector('.course-list');
    const threeLinesMenu = document.querySelector('.three-lines-menu');
    const courseTitleArea = document.querySelector('.course-title-area');
    const tutorialDisplayArea = document.querySelector('.tutorial-display-area');
    const courseExplanationArea = document.querySelector('.course-explanation-area');
    const clickSound = document.getElementById('clickSound');

    let isDragging = false;
    let startX;
    let scrollLeft;
    let currentCourse = "";
    let tutorials = {
        "How to Build Self Confidence": [
            "Understand the importance of self-confidence",
            "Identify your strengths and weaknesses",
            "Set realistic goals and achieve them",
            "Practice positive self-talk",
            "Face your fears and take risks"
        ],
        // Add more courses and their tutorials here
    };

    loadTutorials();
    displayTutorials("How to Build Self Confidence");

    threeLinesIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        playSound();
        toggleMenu();
    });

    document.addEventListener('click', function(event) {
        if (!threeLinesMenu.contains(event.target) && event.target !== threeLinesIcon) {
            if (threeLinesMenu.style.display !== 'none') {
                playSound();
                closeMenu();
            }
        }
    });

    function toggleMenu() {
        hamburgerIcon.classList.toggle('active');
        threeLinesMenu.style.display = threeLinesMenu.style.display === 'none' ? 'block' : 'none';
        if (threeLinesMenu.style.display === 'block' && currentCourse) {
            displayTutorials(currentCourse);
        }
    }

    function closeMenu() {
        hamburgerIcon.classList.remove('active');
        threeLinesMenu.style.display = 'none';
    }

    function playSound() {
        clickSound.src = 'ClickSound.mp3';
        clickSound.currentTime = 0;
        clickSound.play();
    }

    namesArea.addEventListener('mousedown', startDragging);
    namesArea.addEventListener('touchstart', startDragging);

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);

    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);

    namesArea.addEventListener('mouseleave', stopDragging);

    function startDragging(e) {
        isDragging = true;
        startX = (e.pageX || e.touches[0].pageX) - namesArea.offsetLeft;
        scrollLeft = namesArea.scrollLeft;
        namesArea.style.cursor = 'grabbing';
        namesArea.style.userSelect = 'none';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = (e.pageX || e.touches[0].pageX) - namesArea.offsetLeft;
        const walk = (x - startX) * 1;
        namesArea.scrollLeft = scrollLeft - walk;
    }

    function stopDragging() {
        isDragging = false;
        namesArea.style.cursor = 'grab';
        namesArea.style.userSelect = 'auto';
    }

    namesArea.addEventListener('wheel', function(e) {
        e.preventDefault();
        namesArea.scrollLeft += e.deltaY;
    });

    courseList.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            playSound();
            courseList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
            e.target.classList.add('selected');
            currentCourse = e.target.textContent;
            courseTitleArea.textContent = currentCourse;
            displayTutorials(currentCourse);
            threeLinesMenu.style.display = 'block';
        }
    });

    threeLinesMenu.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            playSound();
        }
    });

    function displayTutorials(courseName) {
        tutorialDisplayArea.innerHTML = '';
        if (tutorials[courseName]) {
            const courseContent = tutorials[courseName];
            if (typeof courseContent === 'string') {
                tutorialDisplayArea.innerHTML = courseContent;
            } else if (Array.isArray(courseContent)) {
                courseContent.forEach(tutorial => {
                    const p = document.createElement('p');
                    p.textContent = tutorial;
                    p.className = 'tutorial-item';
                    tutorialDisplayArea.appendChild(p);
                });
            } else if (courseContent instanceof Element) {
                tutorialDisplayArea.appendChild(courseContent.cloneNode(true));
            }
        }

        let isScrolling = false;
        let startY;
        let scrollTop;

        tutorialDisplayArea.addEventListener('mousedown', startScrolling);
        tutorialDisplayArea.addEventListener('touchstart', startScrolling);

        document.addEventListener('mousemove', scroll);
        document.addEventListener('touchmove', scroll);

        document.addEventListener('mouseup', stopScrolling);
        document.addEventListener('touchend', stopScrolling);

        tutorialDisplayArea.addEventListener('mouseleave', stopScrolling);

        function startScrolling(e) {
            isScrolling = true;
            startY = (e.pageY || e.touches[0].pageY) - tutorialDisplayArea.offsetTop;
            scrollTop = tutorialDisplayArea.scrollTop;
            tutorialDisplayArea.style.cursor = 'grabbing';
        }

        function scroll(e) {
            if (!isScrolling) return;
            e.preventDefault();
            const y = (e.pageY || e.touches[0].pageY) - tutorialDisplayArea.offsetTop;
            const walk = (y - startY) * 1;
            tutorialDisplayArea.scrollTop = scrollTop - walk;
        }

        function stopScrolling() {
            isScrolling = false;
            tutorialDisplayArea.style.cursor = 'default';
        }
    }

    function loadTutorials() {
        fetch('tutorials.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const courseElements = doc.querySelectorAll('.course');

                courseElements.forEach(courseElement => {
                    const courseName = courseElement.getAttribute('data-name');
                    tutorials[courseName] = courseElement;
                });

                updateCourseList(courseElements);

                if (courseElements.length > 0) {
                    currentCourse = courseElements[0].getAttribute('data-name');
                    courseTitleArea.textContent = currentCourse;
                    displayTutorials(currentCourse);
                }
            })
            .catch(error => {
                console.error('Error loading tutorials:', error);
                tutorials = {
                    "How to Build Self Confidence": [
                        "Understand the importance of self-confidence",
                        "Identify your strengths and weaknesses",
                        "Set realistic goals and achieve them",
                        "Practice positive self-talk",
                        "Face your fears and take risks"
                    ],
                };
                updateCourseList(Object.keys(tutorials));
                currentCourse = "How to Build Self Confidence";
                courseTitleArea.textContent = currentCourse;
                displayTutorials(currentCourse);
            });
    }

    function updateCourseList(courseElements) {
        courseList.innerHTML = '';
        (Array.isArray(courseElements) ? courseElements : Array.from(courseElements)).forEach(course => {
            const li = document.createElement('li');
            li.textContent = Array.isArray(courseElements) ? course : course.getAttribute('data-name');
            courseList.appendChild(li);
        });
    }
});
document.querySelectorAll('.tutorial-display-area li').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('.tutorial-display-area li').forEach(li => li.classList.remove('active'));
      this.classList.add('active');
    });
  });