import fs from 'fs';
import path from 'path';
import { run } from "@mermaid-js/mermaid-cli";

const sourceDir = 'src';
const destinationDir = 'dist';
const destFileExtension = '.mmd';

async function processFile(filePath) {
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const processedContent = 'after'/* Perform file processing here */;
    // console.log(fileContent)
    return processedContent;
}

(async () => {
    try {
        if (!await fs.existsSync(destinationDir)) {
            await fs.mkdirSync(destinationDir);
        }

        const files = await fs.promises.readdir(sourceDir);

        for (const filename of files) {
            const filePath = path.join(sourceDir, filename);
            const fileExtension = path.extname(filename);

            if (fileExtension === destFileExtension) {
                // const processedContent = await processFile(filePath);
                const destinationFilePath = path.join(destinationDir, filename);
                // await fs.promises.writeFile(destinationFilePath, processedContent);
                console.log(filePath);
                console.log(destinationFilePath, destinationFilePath.replace(destFileExtension, '.png'));
                await run(filePath, destinationFilePath.replace(destFileExtension, '.png'), {
                    parseMMDOptions: {
                        theme: 'dark',
                        backgroundColor: '#202020'
                    }
                });
                console.log("-------------------------------");
            }
        }
    } catch (error) {
        console.error(error);
    }
})();

