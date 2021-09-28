import path from 'path';
import fs from 'fs';

const PACKAGE_JSON_SECTION = "parcel-reporter-manifest";

export class Config {
    defaultPackageSection = {
        "file": "parcel-manifest.json"
    };

    loadFromPackageFolder(rootFolder: string) {
        const packageJson = fs.readFileSync(path.join(rootFolder, 'package.json')).toString();
        const packageInfo = JSON.parse(packageJson);
        const packageSection = packageInfo[PACKAGE_JSON_SECTION] || {};

        this.file = path.resolve(rootFolder, packageSection.file || this.defaultPackageSection.file);
    }
}