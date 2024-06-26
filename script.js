const textInput = document.getElementById('textInput');
const canvas = document.getElementById('drawingCanvas');
const clearButton = document.getElementById('clearButton');
const runButton = document.getElementById('runButton');
const consoleOutput = document.getElementById('console');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

document.querySelectorAll('input[name="answerFormat"]').forEach(radio => {
    radio.addEventListener('change', (event) => {
        const value = event.target.value;
        if (value === 'text') {
            textInput.style.display = 'block';
            canvas.style.display = 'none';
            clearButton.style.display = 'none'; // Hide clear button when switching to text input
        } else if (value === 'draw') {
            textInput.style.display = 'none';
            canvas.style.display = 'block';
            clearButton.style.display = 'block'; // Show clear button when switching to canvas
        }
    });
});

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    draw(e.offsetX, e.offsetY);
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

function draw(x, y) {
    if (!isDrawing) return;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
}

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
});

runButton.addEventListener('click', () => {
    const code = textInput.value;
    const language = document.getElementById('languageSelect').value;
    try {
        let consoleOutputText = '';
        const originalConsoleLog = console.log;
        console.log = function(...args) {
            originalConsoleLog.apply(console, args); // Log to the browser console as well
            consoleOutputText += args.join(' ') + '\n'; // Concatenate output
        };
        
        switch (language) {
            case 'javascript':
                eval(code); // Execute JavaScript code
                break;
            case 'python':
                // Execute Python code using Skulpt
                Sk.importMainWithBody("<stdin>", false, code);
                Sk.misceval.run__Promise(Sk.abstr.globals['__main__']);
                break;
            default:
                consoleOutputText = "Unknown language.";
        }

        console.log = originalConsoleLog; // Restore original console.log

        // Display output in the answer box
        const answerBoxOutput = document.getElementById('answerBoxOutput');
        answerBoxOutput.innerHTML = `Output: ${consoleOutputText}`;
    } catch (error) {
        // Display error message in the answer box
        const answerBoxOutput = document.getElementById('answerBoxOutput');
        answerBoxOutput.innerHTML = `<p>Error: ${error}</p>`;
    }
});


document.getElementById('textInput').addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        // Insert five spaces at the current cursor position
        var start = this.selectionStart;
        var end = this.selectionEnd;
        var value = this.value;
        var spaces = '     '; // Five spaces
        this.value = value.substring(0, start) + spaces + value.substring(end);
        // Move the cursor to the position after the inserted spaces
        this.selectionStart = this.selectionEnd = start + 5;
    }
});
