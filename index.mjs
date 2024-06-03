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
    // let people = ['geddy', 'neil', 'alex'];
    // let html = ejs.render('<%= people.join(", "); %>', {people: people});
    // console.log(html);
    const data = {
        title: 'Diagram Hub',
        message: 'This is a message from EJS!'
    };
    const template = await fs.readFile('index.html', { encoding: 'utf8' });
    // console.log(template);
    const a = ejs.render(template, data);
    
    // const a = await ejs.renderFile('index.html', data);

    console.log(a);
    await fs.writeFile('dist/index.html', new Uint8Array(Buffer.from(a)));
}

(async () => {
    // try {
    //     await fs.rm(rootDestinationDir, { recursive: true, force: true });
    //     await processDir(rootSourceDir, rootDestinationDir);
    // } catch (error) {
    //     console.error(error);
    // }
    await render();
})();
