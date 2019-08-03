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
        filename: 'leafletDeclarativeLayers.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'leafletDeclarativeLayers' // appends bundle code to global scope
    }
};