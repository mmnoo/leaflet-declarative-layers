const path = require('path');

module.exports = {
    mode: "none",
    entry: './src/index.ts',
    module: {
        rules: [
        {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    output: {
        filename: 'leafletDynamicLayers.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'leafletDynamicLayers' // appends bundle code to global scope
    }
};