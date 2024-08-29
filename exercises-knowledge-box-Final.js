

document.addEventListener('DOMContentLoaded', function() {
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const testName = document.getElementById('test-name');
    const testExercises = document.querySelectorAll('.test-exercises li');
    const knowledgeArea = document.getElementById('knowledge-area');
    const initialMessage = document.getElementById('initial-message');
    const resetButton = document.getElementById('resetButton');
    const warningMessage = document.getElementById('warningMessage');
    const confirmReset = document.getElementById('confirmReset');
    const cancelReset = document.getElementById('cancelReset');

    ////Test Cases Logic start
    const checkTestCasesButton = document.getElementById('checkTestCasesButton');
    const testCasesResults = document.getElementById('testCasesResults');

    let currentRequirements = null;

    async function loadRequirements(testType) {
        try {
            const response = await fetch(`${testType}-requirements.json`);
            if (!response.ok) {
                throw new Error('Failed to load requirements');
            }
            const data = await response.json();
            currentRequirements = data.requirements;
        } catch (error) {
            console.error('Error loading requirements:', error);
            currentRequirements = null;
        }
    }

    function createTestFunction(testType, testString) {
        if (testType === 'regex') {
            const regex = new RegExp(testString);
            return code => regex.test(code);
        }
        // Add more test types as needed
        return () => false;
    }

    checkTestCasesButton.addEventListener('click', async function() {
        const code = window.editor.getValue();
        const currentTest = document.getElementById('test-name').textContent.toLowerCase().replace(' test', '');
        
        if (!currentRequirements) {
            await loadRequirements(currentTest);
        }

        if (currentRequirements) {
            const results = currentRequirements.map(req => {
                const testFunction = createTestFunction(req.testType, req.test);
                return {
                    description: req.description,
                    passed: testFunction(code)
                };
            });

            displayTestResults(results);
        } else {
            testCasesResults.innerHTML = '<p>No test cases available for this exercise.</p>';
        }
    });

    function displayTestResults(results) {
        testCasesResults.innerHTML = '';
        results.forEach((result, index) => {
            const testCase = document.createElement('div');
            testCase.classList.add('test-case');
            testCase.innerHTML = `
                <span>Test Case ${index + 1}: ${result.description}</span>
                <span class="test-case-result ${result.passed ? 'correct' : 'incorrect'}">
                    ${result.passed ? '✓' : '✗'}
                </span>
            `;
            testCasesResults.appendChild(testCase);
        });
    }


    // Modify your existing loadKnowledgeContent function to load requirements
    function loadKnowledgeContent(testType) {
        const fileName = `${testType}-test.html`;
        
        fetch(fileName)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                knowledgeArea.innerHTML = html;
                initMonacoEditor();
                loadRequirements(testType); // Load requirements for the selected test
            })
            .catch(error => {
                console.error('Error loading content:', error);
                knowledgeArea.innerHTML = '<p>Error loading content. Please try again later.</p>';
            });
    }

    ////Test Cases Logic End



    resetButton.addEventListener('click', function() {
        warningMessage.style.display = 'block';
    });

    confirmReset.addEventListener('click', function() {
        warningMessage.style.display = 'none';
        setTimeout(() => {
            if (window.editor) {
                window.editor.setValue('');
            }
            outputConsole.innerHTML = '';
        }, 100);
    });

    cancelReset.addEventListener('click', function() {
        warningMessage.style.display = 'none';
    });

        // Load Lottie animation
        const animation = lottie.loadAnimation({
            container: document.getElementById('lottieAnimation'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'AnimationWar.json' // Make sure this path is correct
        });

    // Adjust animation size when warning message is shown

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === warningMessage) {
                animation.resize();
            }
        }
    });
    resizeObserver.observe(warningMessage);

    function showWarning(message, action) {
        warningText.textContent = message;
        warningMessage.style.display = 'block';
        confirmAction.onclick = () => {
            warningMessage.style.display = 'none';
            setTimeout(action, 100);
        };
    }

    hamburgerIcon.addEventListener('click', function() {
        this.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    });
    testExercises.forEach(function(exercise) {
        exercise.addEventListener('click', function() {
            testName.textContent = this.textContent;
            hamburgerIcon.classList.remove('active');
            hamburgerMenu.classList.remove('active');

            // Remove 'active' class from all exercises
            testExercises.forEach(ex => ex.classList.remove('active'));
            // Add 'active' class to clicked exercise
            this.classList.add('active');

            // Hide the initial message
            initialMessage.style.display = 'none';

            // Load content into Knowledge Area
            loadKnowledgeContent(this.dataset.test);
        });
    });

// Modify your loadKnowledgeContent function to initialize the Monaco editor
function loadKnowledgeContent(testType) {
    const fileName = `${testType}-test.html`;
    
    fetch(fileName)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            knowledgeArea.innerHTML = html;
            initMonacoEditor();
        })
        .catch(error => {
            console.error('Error loading content:', error);
            knowledgeArea.innerHTML = '<p>Error loading content. Please try again later.</p>';
        });
}


  const runButton = document.getElementById('runButton');
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
  let animationPlayed = false;
  runButton.addEventListener('click', function() {
    const code = window.editor.getValue();
    const outputConsole = document.getElementById('output-console');
    outputConsole.innerHTML = code;


  });



});