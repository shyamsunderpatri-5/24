const fs = require('fs');
const path = require('path');

function walk(dir) {
    let files = [];
    for (let d of fs.readdirSync(dir, { withFileTypes: true })) {
        let f = path.join(dir, d.name);
        if (d.isDirectory()) {
            files.push(...walk(f));
        } else if (f.endsWith('page.tsx')) {
            files.push(f);
        }
    }
    return files;
}

let pages = walk('c:\\\\Users\\\\shyam\\\\Drive D\\\\24\\\\whatsai-receptionist\\\\src\\\\app\\\\(dashboard)');
for (let file of pages) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('force-dynamic')) {
        fs.writeFileSync(file, "export const dynamic = 'force-dynamic';\n" + content);
        console.log('Patched ' + file);
    }
}
