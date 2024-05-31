import { promises as fs } from 'fs';
import path from 'path';
import { run } from "@mermaid-js/mermaid-cli";

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

// function mkdir(dir) {
//     if (!fs.existsSync(dir)) {
//         fs.mkdirSync(destinationDir, { recursive: true });
//     }
// }

async function processDir(sourceDir, destinationDir) {
    console.log('**:', destinationDir, typeof destinationDir);
    // if (!fs.exists(destinationDir)) {
    const dirs = await fs.mkdir(destinationDir, { recursive: false });
    console.log('dd', dirs)
    // }

    const files = await fs.readdir(sourceDir);
    for (const filename of files) {
        const filePath = path.join(sourceDir, filename);
        const stats = await fs.lstat(filePath);

        if (stats.isDirectory()) {
            processDir(filePath, path.join(destinationDir, filename));
        } else if (stats.isFile()) {
            console.log(`${filePath} is a file.`);
        } else {
            console.log(`${filePath} is neither a file nor a directory.`);
        }
    } 
}

(async () => {
    try {
        processDir(rootSourceDir, rootDestinationDir);
        // const files = await fs.readdir(sourceDir);
        // for (const filename of files) {
        //     const filePath = path.join(sourceDir, filename);
        //     const stats = await fs.lstat(filePath);
        //     if (stats.isDirectory()) {
        //         console.log(`${filePath} is a directory.`);
        //     } else if (stats.isFile()) {
        //         console.log(`${filePath} is a file.`);
        //     } else {
        //         console.log(`${filePath} is neither a file nor a directory.`);
        //     }
        // }
    } catch (error) {
        console.error(error);
    }
})();

// (async () => {
//     try {
//         if (!fs.existsSync(destinationDir)) {
//             fs.mkdirSync(destinationDir, { recursive: true });
//         }

//         const files = await fs.promises.readdir(sourceDir);
//         for (const filename of files) {
//             const filePath = path.join(sourceDir, filename);
//             const fileExtension = path.extname(filename);

//             if (fileExtension === srcFileExtension) {
//                 const destinationFilePath = path.join(destinationDir, filename);
//                 const destFilePath = destinationFilePath.replace(srcFileExtension, destFileExtension);
//                 console.log(filePath, "==>", destFilePath);
//                 // await run(filePath, destFilePath, options);
//                 console.log("-".repeat(80));
//             }
//         }
//     } catch (error) {
//         console.error(error);
//     }
// })();

