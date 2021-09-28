import {Reporter} from '@parcel/plugin';
import {PluginLogger} from "@parcel/logger/lib/Logger";
import {Config} from './Config';

import path from 'path';
import fs from 'fs';

const PACKAGE_JSON_SECTION = "parcel-reporter-manifest";

export default new Reporter({
    async report(opts: { event: { type: string }, options: PluginOptions, logger: PluginLogger }) {
        this.ensureConfig(opts.options.projectRoot, opts.options.packageManager, opts.logger);

        let distPath = path.resolve(opts.options.projectRoot, "dist");

        switch (opts.event.type) {
            case "buildSuccess":
                let bundles = opts.event.bundleGraph.getBundles()
                    .filter(bundle => opts.event.bundleGraph.getParentBundles(bundle).length === 0)
                    .map(bundle => ({
                        name: bundle.target.name,
                        type: bundle.type,
                        path: path.relative(distPath, bundle.filePath),
                        size: bundle.stats.size,
                    }));
                this.writeManifest({
                    "status": "done",
                    "distPath": distPath,
                    "bundles": bundles,
                })
                break;
            case 'buildFailure':
                this.writeManifest({
                    "status": "error",
                    "distPath": distPath,
                    "error": opts.event.diagnostics,

                })
        }

    },

    writeManifest(manifest) {
        fs.writeFileSync(this.config.file, JSON.stringify(manifest, null, 2));
    },

    ensureConfig(projectRoot: string, packageManager: {}, logger: PluginLogger) {
        if (!this.config) {
            this.config = new Config();
            this.config.loadFromPackageFolder(projectRoot, logger);
        }
    },
});