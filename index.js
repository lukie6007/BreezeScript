// index.js

const textarea = document.getElementById('maintext');

if (textarea) {
    textarea.addEventListener('input', function (event) {
        const text = textarea.value; // Get the current value of the textarea
        let code = compile(text);
        const output = document.getElementById('out');
        output.innerHTML = code.join('');
    });
}
