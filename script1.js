const navBar1 = document.querySelector('.nav-bar-1');
let isDialogOpen = false;
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
            showAnimatedDialog(text1HTML, text2HTML, "Nav1Animation.json");
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
    
    prevButton.addEventListener('click', loadPreviousTutorial);
    nextButton.addEventListener('click', loadNextTutorial);

    let currentTutorialIndex = 0;
    let activeTutorial = null;
    loadCourseExplanationDefault();

    function loadPreviousTutorial() {
        if (currentTutorialIndex > 0) {
            currentTutorialIndex--;
            loadTutorialByIndex(currentTutorialIndex);
        }
    }
    
    function loadNextTutorial() {
        const tutorialItems = getAllTutorialItems();
        if (currentTutorialIndex < tutorialItems.length - 1) {
            currentTutorialIndex++;
            loadTutorialByIndex(currentTutorialIndex);
        }
    }
    
    function loadTutorialByIndex(index) {
        const tutorialItems = getAllTutorialItems();
        if (index >= 0 && index < tutorialItems.length) {
            const tutorialItem = tutorialItems[index];
            loadTutorialContent(currentCourse, getTutorialName(tutorialItem));
            highlightActiveTutorial(tutorialItem);
            updateNavigationButtons();
        }
    }
    
    function getAllTutorialItems() {
        return Array.from(tutorialDisplayArea.querySelectorAll('h3, li'));
    }
    
    function getTutorialName(element) {
        return element.tagName === 'H3' ? element.textContent : element.textContent.split('\n')[0].trim();
    }
    
    function updateNavigationButtons() {
        const tutorialItems = getAllTutorialItems();
        prevButton.disabled = currentTutorialIndex === 0;
        nextButton.disabled = currentTutorialIndex === tutorialItems.length - 1;
    }

    function loadCourseExplanationDefault() {
        fetchContent('course-explanation-area-default.html', courseExplanationArea);
    }

    function highlightActiveTutorial(tutorialElement) {
        if (activeTutorial) {
            activeTutorial.classList.remove('active');
        }
        tutorialElement.classList.add('active');
        activeTutorial = tutorialElement;
    }



    function loadFirstTutorial(courseName) {
        const firstTutorial = tutorialDisplayArea.querySelector('h3, li');
        if (firstTutorial) {
            loadTutorialContent(courseName, getTutorialName(firstTutorial));
            highlightActiveTutorial(firstTutorial);
            currentTutorialIndex = 0;
            updateNavigationButtons();
        }
    }

    tutorialDisplayArea.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
        playSound();
        const tutorialName = e.target.textContent;
        loadTutorialContent(currentCourse, tutorialName);
        highlightActiveTutorial(e.target);
        currentTutorialIndex = Array.from(tutorialDisplayArea.querySelectorAll('li')).indexOf(e.target);
        }
    });
    function loadTutorialContent(courseName, tutorialName) {
        const fileName = tutorialName + '.html';
        fetchContent(`${courseName}/${fileName}`, courseExplanationArea);
        const tutorialItems = getAllTutorialItems();
        currentTutorialIndex = tutorialItems.findIndex(item => getTutorialName(item) === tutorialName);
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
            const allTutorialItems = clonedContent.querySelectorAll('h3, li');
            allTutorialItems.forEach((item, index) => {
                item.addEventListener('click', function() {
                    loadTutorialContent(courseName, getTutorialName(this));
                    highlightActiveTutorial(this);
                    currentTutorialIndex = index;
                    updateNavigationButtons();
                });
                if (index === currentTutorialIndex) {
                    highlightActiveTutorial(item);
                }
            });
        }
    }
    updateNavigationButtons();

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
  



  document.addEventListener('DOMContentLoaded', function() {
    const startExerciseLink = document.getElementById('startExerciseLink');
    // const submitButton = document.getElementById('submitButton');
    const clickSound = document.getElementById('clickSound');
    const runButton = document.getElementById('runButton');
  
    function playClickSound() {
      clickSound.currentTime = 0;
      clickSound.play().catch(error => console.error('Error playing sound:', error));
    }
  
    function showLoadingAnimation() {
      const exercisesKnowledgeBox = document.querySelector('.exercises-knowledge-box');
      const loadingContainer = document.getElementById('loading-animation-container-1');
      
      loadingContainer.style.display = 'block';
      loadingContainer.style.position = 'absolute';
      loadingContainer.style.top = '80%';
      loadingContainer.style.left = '50%';
      loadingContainer.style.transform = 'translate(-50%, -50%)';
      loadingContainer.style.zIndex = '9999';
  
      exercisesKnowledgeBox.appendChild(loadingContainer);
  
      const animation = lottie.loadAnimation({
        container: document.getElementById('loading-animation-1'),
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
  
    function handleExerciseStart(e) {
      e.preventDefault();
      console.log('Start Exercise clicked');
      playClickSound();
      showLoadingAnimation();
      setTimeout(function() {
        console.log('Redirecting to RealKnowledge.html');
        window.open('Knowledge.html', '_blank');
      }, 3000);
    }
  
    if (startExerciseLink) {
      startExerciseLink.addEventListener('click', handleExerciseStart);
    } else {
      console.error('Start Exercise link not found');
    }
  
    // if (submitButton) {
    //   submitButton.addEventListener('click', handleExerciseStart);
    // } else {
    //   console.error('Submit button not found');
    // }
  
  
    runButton.addEventListener('click', function() {
      playClickSound();
      const code = window.editor.getValue();
      const outputConsole = document.getElementById('output-console');
      outputConsole.innerHTML = code;
    });
  
    // Initialize Monaco Editor
  require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' } });
  
  require(['vs/editor/editor.main'], function() {
      const initialCode = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>My Web Page</title>
      </head>
      <body>
          <h1>Welcome to my web page!</h1>
          <p>This is a paragraph.</p>
      </body>
      </html>`;
  
      window.editor = monaco.editor.create(document.getElementById('monaco-editor-container'), {
          value: initialCode,
          language: 'html',
          // theme: 'vs-dark',
          wordWrap: 'on',
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          roundedSelection: false,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'hidden',
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            verticalScrollbarSize: 12,
          },
          overviewRulerLanes: 0,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
      // Enable additional features
      suggestOnTriggerCharacters: true,
      parameterHints: { enabled: true },
      formatOnType: true,
      formatOnPaste: true,
      snippetSuggestions: 'inline',
      folding: true,
      foldingStrategy: 'indentation',
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoSurround: 'languageDefined',
      renderWhitespace: 'boundary',
      renderControlCharacters: true,
      renderIndentGuides: true,
      renderLineHighlight: 'all',
      links: true,
      mouseWheelZoom: true,
      quickSuggestions: true,
      quickSuggestionsDelay: 100,
      contextmenu: true,
      multiCursorModifier: 'ctrlCmd',
      tabSize: 2,
      insertSpaces: true,
    });
  
      // Create a custom theme that matches the parent background color
      monaco.editor.defineTheme('customTheme', {
          // base: 'vs-dark',
          inherit: true,
          rules: [
              { token: 'comment', foreground: '#6A9955', fontStyle: 'italic' },
              { token: 'keyword', foreground: '#569CD6' },
              { token: 'string', foreground: '#CE9178' },
              { token: 'number', foreground: '#B5CEA8' },
              { token: 'tag', foreground: '#569CD6' },
              { token: 'attribute.name', foreground: '#9CDCFE' },
              { token: 'attribute.value', foreground: '#CE9178' },
          ],
          colors: {
              'editor.background': '#1E1E1E',
              'editor.foreground': '#D4D4D4',
              'editorLineNumber.foreground': '#858585',
              'editorCursor.foreground': '#A6A6A6',
              'editor.selectionBackground': '#264F78',
              'editor.inactiveSelectionBackground': '#3A3D41',
          }
        });
      
        // Apply the custom theme
        monaco.editor.setTheme('customTheme');
  
    // Add language support and features
    monaco.languages.registerCompletionItemProvider('html', {
      provideCompletionItems: function(model, position) {
        return {
          suggestions: [
            {
              label: 'div',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<div>$0</div>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Div element'
            },
            // Add more snippets and suggestions here
          ]
        };
      }
    });
  });
  });
  