// 打开Premiere Pro，新建一个项目，新建一个序列，然后运行这个脚本，会在项目中新建一个文件夹，里面包含了一个视频文件和一个音频文件
// 这个脚本是一个jsx脚本，可以直接在Premiere Pro中运行
// 这个脚本是用来演示如何在Premiere Pro中创建一个视频文件和一个音频文件
#include http.js

function run() {
    // alert("开始运行脚本");
    
    // var project = app.project;
    // alert("当前工程名称：" + project.name);
    
    // // var sequence = project.activeSequence;
    // // alert("当前序列名称：" + sequence.name);
    
    // // 获取项目的根目录
    // var rootItem = project.rootItem;
    // alert("项目的根目录：" + rootItem.name  + "，类型：" + rootItem.type);
    
    // // 创建一个新的文件夹
    // var folderName = "Media Files";
    // var newFolder = rootItem.createBin(folderName);
    
    // // 设置要导入的文件路径（根据实际路径调整）
    // var videoFilePath = "C:\\Users\\admin\\Downloads\\C0761.mp4"; // 替换为视频文件的实际路径
    // // var audioFilePath = "C:\\path\\to\\your\\audio.mp3"; // 替换为音频文件的实际路径
    
    // // 导入视频文件和音频文件
    // var importedFiles = app.project.importFiles([videoFilePath], true, newFolder);
    
    // alert("视频和音频文件已成功导入到文件夹: " + folderName);

    folder = "Media Files";
    files = ["C:\\Users\\admin\\Downloads\\C0761.mp4"];

    // 导入文件，至指定文件夹
    import_video(folder,files);
    
    // 读取所有视频文件并获取字幕
    read_all_video_files(files);

    // 1. 从PR读取视频时间轴
    // 2. 解析视频（时间轴文字）
    // 3. 视频分段（按照文字稿要求分段视频）
    // 4. 视频分段重排序（按照文字稿要求重排序视频分段）

}

function import_video(folderName,filePaths) {
    // 导入文件，至指定文件夹
    try {
        if (filePaths.length === 0) {
            alert("没有提供任何文件路径。");
            return;
        }else{
            alert("文件路径：" + filePaths);
        }

        // 获取当前项目和根目录
        var project = app.project;
        var rootItem = project.rootItem;

        // 创建文件夹（Bin）
        var newFolder = rootItem.createBin(folderName);

        // 导入文件到指定文件夹
        // 确保 filePaths 是一个有效的路径数组
        var importedFiles = app.project.importFiles(filePaths, true, newFolder);

        // 提示导入成功
        alert("视频文件已成功导入到文件夹: " + folderName + "，文件数：" + filePaths.length + "，文件：" + filePaths.join(", "));
    } catch (error) {
        // 捕获任何错误并提示
        alert("导入视频时发生错误: " + error.message);
    }
}

function read_all_video_files(files) {
    // 读取所有视频文件并获取字幕
    try {
        if (files.length === 0) {
            alert("没有提供任何文件路径。");
            return;
        }else{
            alert("文件路径：" + files);
        }

        // 遍历所有文件路径
        for (var i = 0; i < files.length; i++) {
            var filePath = files[i];
            // 读取视频文件并获取字幕
            alert("读取视频文件：" + filePath);
            // read_video_file(filePath);
        }
    } catch (error) {
        // 捕获任何错误并提示
        alert("读取视频文件时发生错误: " + error.message);
    }
}

  

run();

// 测试请求接口
// request_api("https://api.deepseek.com/chat/completions", { name: "test" });

// test();
