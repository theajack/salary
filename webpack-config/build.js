/*
 * @Author: tackchen
 * @Date: 2022-09-15 10:34:56
 * @Description: Coding something
 */
const path = require('path');
const {copyNpm} = require('../helper/copy-docs');
copyNpm();
module.exports = () => {
    return {
        mode: 'production',
        entry: path.resolve('./', 'src/calculator/index.ts'),
        output: {
            path: path.resolve('./', 'npm'),
            filename: 'easy-salary.min.js',
            library: 'Salary',
            libraryTarget: 'umd',
            globalObject: 'this',
            libraryExport: 'default',
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ]
        },
        externals: {},
        module: {
            rules: [{
                test: /(.ts)$/,
                use: {
                    loader: 'ts-loader'
                }
            }, {
                test: /(.js)$/,
                use: [{
                    loader: 'babel-loader',
                }]
            }, {
                test: /(.js)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: /node_modules/,
                options: {
                    configFile: './.eslintrc.js'
                }
            }]
        }
    };
};