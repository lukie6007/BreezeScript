// index.js

const { compile } = require('./src/compiler.js');
const fs = require('fs').promises; // Using fs.promises for async file operations

async function main() {
    const [, , src, outputFile] = process.argv;

    if (!src || !outputFile) {
        console.error('Usage: node index.js <src> <outputFile>');
        process.exit(1);
    }

    try {
        const result = await compile(src);
        await fs.writeFile(outputFile, result);
        console.log(`Compilation successful. Result written to ${outputFile}`);
    } catch (error) {
        console.error('Error during compilation:', error.message);
        process.exit(1);
    }
}

main();
