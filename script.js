{
let isDialogOpen = false;

// Function to play sound
function playSound(soundFile) {
    const audio = new Audio(soundFile);
    audio.play().catch(error => console.error('Error playing sound:', error));
  }
  
  function disableInteractions() {
    document.body.style.pointerEvents = 'none';
  }
  
  function enableInteractions() {
    document.body.style.pointerEvents = 'auto';
  }
  
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    document.body.appendChild(overlay);
    return overlay;
  }
  
// Function to create and show dialog with animation
function showAnimatedDialog(text1HTML, text2HTML, animationPath) {
    if (isDialogOpen) return;
    isDialogOpen = true;

    const overlay = createOverlay();
    disableInteractions();

    const dialog = document.createElement('div');
    dialog.className = 'custom-dialog';
    dialog.innerHTML = `
        <div class="text-area text-area-1">
            <div class="custom-shape-divider-bottom">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,602.45,3.86h0S632,116.24,923,120h277Z" class="shape-fill"></path>
                </svg>
            </div>
            <div class="content">${text1HTML}</div>
        </div>
        <div id="animation-container"></div>
        <div class="text-area text-area-2">
            <div class="content">${text2HTML}</div>
            <div class="custom-shape-divider-top">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" class="shape-fill"></path>
                </svg>
            </div>
        </div>
        <button class="ok-button">OK</button>

    `;
    document.body.appendChild(dialog);

    dialog.style.pointerEvents = 'auto';

    if (animationPath) {
        const animation = lottie.loadAnimation({
            container: dialog.querySelector('#animation-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: animationPath
        });
    }

    dialog.querySelector('.ok-button').addEventListener('click', function() {
        playSound('ClickSound.mp3');
        document.body.removeChild(dialog);
        document.body.removeChild(overlay);
        if (animationPath) {
            lottie.destroy();
        }
        isDialogOpen = false;
        enableInteractions();
    });
}

  async function fetchHTMLContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error fetching HTML content:', error);
        return '<p>Error loading content.</p>';
    }
}

  // Logo icon click handler
  document.querySelector('.logo-icon').addEventListener('click', async function() {
    if (!isDialogOpen) {
        playSound('ClickSound.mp3');
        try {
            const [text1HTML, text2HTML] = await Promise.all([
                fetchHTMLContent('text1_content.html'),
                fetchHTMLContent('text2_content.html')
            ]);
            showAnimatedDialog(text1HTML, text2HTML, "LogoAnimation.json");
        } catch (error) {
            console.error('Error loading dialog content:', error);
        }
    }
});
  
  // Quote rotation logic remains the same
  
  let quotes = [];
  let currentQuoteIndex = 0;
  
  // Function to load quotes from JSON file
  function loadQuotes() {
    fetch('quotes.json')
      .then(response => response.json())
      .then(data => {
        quotes = data.quotes;
        rotateQuote(); // Start the rotation once quotes are loaded
      })
      .catch(error => console.error('Error loading quotes:', error));
  }
  
  // Function to rotate quotes
  function rotateQuote() {
    const quoteArea = document.querySelector('.quote-area');
    if (quotes.length > 0) {
      quoteArea.textContent = quotes[currentQuoteIndex];
      currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
      setTimeout(() => {
        const quoteHeight = quoteArea.offsetHeight;
        navBar1.style.minHeight = Math.max(5, quoteHeight / 16) + 'rem';
    }, 0);
    }
  }
  
  // Load quotes when the page loads
  document.addEventListener('DOMContentLoaded', loadQuotes);
  
  // Rotate quotes every 2 seconds
  setInterval(rotateQuote, 10000);
}


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


            const prevButton = document.getElementById('prevButton');
            const nextButton = document.getElementById('nextButton');
        
            let currentTutorialIndex = 0;
        
            function updateNavigationButtons() {
                const tutorialItems = tutorialDisplayArea.querySelectorAll('li');
                prevButton.disabled = currentTutorialIndex === 0;
                nextButton.disabled = currentTutorialIndex === tutorialItems.length - 1;
            }
        
            function loadTutorialByIndex(index) {
                const tutorialItems = tutorialDisplayArea.querySelectorAll('li');
                if (index >= 0 && index < tutorialItems.length) {
                    currentTutorialIndex = index;
                    loadTutorialContent(currentCourse, tutorialItems[index].textContent);
                    updateNavigationButtons();
                }
            }

    // Load default content
    loadCourseExplanationDefault();

    function loadCourseExplanationDefault() {
      fetchContent('course-explanation-area-default.html', courseExplanationArea);
  }


  prevButton.addEventListener('click', function() {
    loadTutorialByIndex(currentTutorialIndex - 1);
});

nextButton.addEventListener('click', function() {
    loadTutorialByIndex(currentTutorialIndex + 1);
});

  function loadFirstTutorial(courseName) {
    fetchContent(`${courseName}/Introduction.html`, courseExplanationArea);
    currentTutorialIndex = 0;
    updateNavigationButtons();
    
}

function loadTutorialContent(courseName, tutorialName) {
  // const fileName = tutorialName.replace(/\s+/g, '-').toLowerCase() + '.html';
  const fileName = tutorialName + '.html';
  fetchContent(`${courseName}/${fileName}`, courseExplanationArea);
  const tutorialItems = tutorialDisplayArea.querySelectorAll('li');
  currentTutorialIndex = Array.from(tutorialItems).findIndex(item => item.textContent === tutorialName);
  updateNavigationButtons();
    
}


function fetchContent(url, targetElement) {
  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
      })
      .then(html => {
          targetElement.innerHTML = html;
      })
      .catch(error => {
          console.error('Error loading content:', error);
          targetElement.innerHTML = `<p>Error loading content: ${error.message}</p>`;
      });
}
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
                  loadFirstTutorial(currentCourse);
              }
          });


            threeLinesMenu.addEventListener('click', function(e) {
              if (e.target.tagName === 'LI') {
                  playSound();
                  const tutorialName = e.target.textContent;
                  loadTutorialContent(currentCourse, tutorialName);
                  const tutorialItems = tutorialDisplayArea.querySelectorAll('li');
                  currentTutorialIndex = Array.from(tutorialItems).indexOf(e.target);
                  updateNavigationButtons();
              }
          });
            function displayTutorials(courseName) {
              tutorialDisplayArea.innerHTML = '';
              if (tutorials[courseName]) {
                  const courseContent = tutorials[courseName];
                  if (courseContent instanceof Element) {
                      const clonedContent = courseContent.cloneNode(true);
                      tutorialDisplayArea.appendChild(clonedContent);
                      
                      // Add click event listeners to all list items
                      clonedContent.querySelectorAll('li').forEach(li => {
                          li.addEventListener('click', function() {
                              loadTutorialContent(courseName, this.textContent);
                          });
                      });
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
        