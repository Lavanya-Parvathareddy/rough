
//////////////////////////////////////////////////////////////

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