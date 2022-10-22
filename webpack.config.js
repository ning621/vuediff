
module.exports= {
    entry:'./src/index.js',
    output:{
        publicPath:'dist',
        filename:'bundle.js'
    },
    devServer:{
        port:3080,
        contentBase:'src'
    }
}