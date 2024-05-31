import fs from 'fs';
import path from 'path';
import { run } from "@mermaid-js/mermaid-cli";

const sourceDir = 'src';
const destinationDir = 'dist';
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

(async () => {
    try {
        if (!fs.existsSync(destinationDir)) {
            fs.mkdirSync(destinationDir);
        }

        const files = await fs.promises.readdir(sourceDir);
        for (const filename of files) {
            const filePath = path.join(sourceDir, filename);
            const fileExtension = path.extname(filename);

            if (fileExtension === srcFileExtension) {
                const destinationFilePath = path.join(destinationDir, filename);
                const destFilePath = destinationFilePath.replace(srcFileExtension, destFileExtension);
                console.log(filePath, "==>", destFilePath);
                await run(filePath, destFilePath, options);
                console.log("-".repeat(80));
            }
        }
    } catch (error) {
        console.error(error);
    }
})();

