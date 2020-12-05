const path = require("path");
module.exports = {
    entry: "./src/huarongdao/game.ts",
    output: {
        filename: "./game.js"
    },

    resolve: {
        // Add '.ts' as resolvable extensions.
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["ts-loader"]
            }
        ]
    }
};