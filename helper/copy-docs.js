/*
 * @Author: tackchen
 * @Date: 2022-09-19 00:31:51
 * @Description: Coding something
 */
const fs = require('fs');
const path = require('path');

module.exports = {
    copyDocs () {
        fs.copyFileSync(
            path.resolve(__dirname, '../public/index.html'),
            path.resolve(__dirname, '../docs/index.html')
        );
        fs.copyFileSync(
            path.resolve(__dirname, '../public/index.css'),
            path.resolve(__dirname, '../docs/index.css')
        );
    },
    copyNpm () {
        fs.copyFileSync(
            path.resolve(__dirname, '../LICENSE'),
            path.resolve(__dirname, '../npm/LICENSE')
        );
        fs.copyFileSync(
            path.resolve(__dirname, '../README.md'),
            path.resolve(__dirname, '../npm/README.md')
        );
        fs.copyFileSync(
            path.resolve(__dirname, '../src/calculator/index.d.ts'),
            path.resolve(__dirname, '../npm/index.d.ts')
        );
    }
};