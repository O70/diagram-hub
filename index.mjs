import { promises as fs } from 'fs';
import path from 'path';
import { run } from '@mermaid-js/mermaid-cli';
import ejs from 'ejs';

// const args = process.argv.slice(2);
// const isTest = args.includes('--test');
const isProd = process.env.NODE_ENV === 'production';

const rootSourceDir = 'src';
const rootDestinationDir = 'dist';
const srcFileExtension = '.mmd';
const destFileExtension = '.png';
const options = {
    parseMMDOptions: {
        mermaidConfig: {
            theme: 'dark'
        },
        backgroundColor: '#202020'
    }
};

async function processDir(sourceDir, destinationDir) {
    const dirs = await fs.mkdir(destinationDir, { recursive: true });

    const files = await fs.readdir(sourceDir);
    for (const filename of files) {
        const fileExtension = path.extname(filename);
        const filePath = path.join(sourceDir, filename);
        const destFilePath = path.join(destinationDir, filename);
        const stats = await fs.lstat(filePath);

        if (stats.isDirectory()) {
            processDir(filePath, destFilePath);
        } else if (stats.isFile()) {
            if (fileExtension === srcFileExtension) {
                const targetFilePath = destFilePath.replace(srcFileExtension, destFileExtension);
                console.log(filePath, '==>', targetFilePath);
                isProd && await run(filePath, targetFilePath, options);
                console.log("-".repeat(80));
            }
        } else {
            console.log(`${filePath} is neither a file nor a directory.`);
        }
    } 
}

async function render() {
    const data = {
        title: 'Diagram Hub',
        message: 'This is a message from EJS!' + new Date().getTime()
    };

    const publicDir = 'public';
    const filename = 'index.html';
    const template = await fs.readFile(path.join(publicDir, filename), { encoding: 'utf8' });
    const result = ejs.render(template, data);
    await fs.writeFile(path.join(rootDestinationDir, filename), new Uint8Array(Buffer.from(result)));
    await fs.cp(path.join(publicDir, 'styles.css'), path.join(rootDestinationDir, 'styles.css'));
}

(async () => {
    try {
        await fs.rm(rootDestinationDir, { recursive: true, force: true });
        await processDir(rootSourceDir, rootDestinationDir);
        await render();
    } catch (error) {
        console.error(error);
    }
})();
