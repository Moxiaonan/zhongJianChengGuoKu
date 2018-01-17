'use strict';
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
var GenerateAssetPlugin = require('generate-asset-webpack-plugin');
const webpack = require('webpack');
var createServerConfig = function(compilation){
    let cfgJson={
        urlConfig:{
            getTableDataUrl:'/dahyMeeting/getByKeyword',
            getUuidUrl:'/dahyAccessory/getUuid',
            uploadFileUrl:'/dahyAccessory/uploadFile',
            getCurrDirFileUrl:'/dahyAccessory/getcurrDirFile',
            newFolderUrl:'/dahyAccessory/newFolder',
            insertMeetingUrl:'/dahyMeeting/insertMeeting',
            editMeetingUrl:'/dahyMeeting/editMeeting',
            getMeetingInfoUrl:'/dahyMeeting/getMeetingInfo',
            delAccessoryUrl:'/dahyAccessory/delAccessory',
            downloadFileUrl:'/dahyAccessory/downloadFile',
            insertThemeUrl:'/dahyTheme/insertTheme',
            deleteThemeUrl:'/dahyTheme/deleteTheme',
            alterThemeUrl:'/dahyTheme/alterTheme',
            deleteMeetingUrl:'/dahyMeeting/deleteMeeting',
            getThemeDataUrl:'/dahyTheme/getThemeData'
        },
        projectType:{
            'yjla':'c95efa95-f919-45f1-82d3-4fa0cedfbcb5',
            'zg2035':'0f903d3a-f861-431a-9291-b2f5e511eddd'
        },
        servicePath:'http://127.0.0.1:8082',
        // servicePath:'http://192.1.1.235:8186',
        imgPath:'http://127.0.0.1:2222',
        projectName:'yjla'
    }
    return JSON.stringify(cfgJson);
}
module.exports = {

    //入口
    entry: {
        main: './src/main.js'
    },
    output: {
        //所有产出资源路径
        path: path.join(__dirname, 'dist'),
        // filename: 'build.js'
        publicPath:'/',
        filename: 'js/[name].[hash:6].js'
    },
    module: {
        loaders: [{
                test: /\.css$/,
                loader: 'style-loader!css-loader!autoprefixer-loader'
            },
            {
                test: /\.(jpg|png|svg|ttf|woff|woff2|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 4, //4096字节以上生成文件，否则base6
                    name: 'assets/[name].[ext]'
                    // name: '[name].[ext]'
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['es2015'], //关键字
                    plugins: ['transform-runtime'], //函数
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './src/index.html'
        }),
        new GenerateAssetPlugin({
            filename: 'pageConfig.json',
            fn: (compilation, cb) => {
                cb(null, createServerConfig(compilation));
            },
            extraFiles: []
        })
    ],
    devtool:'#source-map'
}