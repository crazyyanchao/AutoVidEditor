#include utils.jsx

function importVideo(videoFileMap) {
    // 导入视频文件，至指定文件夹
    try {
        // 检查 videoFileMap 是否为空
        var isEmpty = true;
        for (var key in videoFileMap) {
            if (videoFileMap.hasOwnProperty(key)) {
                isEmpty = false;
                break;
            }
        }
        if (isEmpty) {
            alert("没有提供任何视频文件路径。");
            return;
        } else {
            // 显示 videoFileMap 的内容
            var mapContent = "";
            for (var key in videoFileMap) {
                if (videoFileMap.hasOwnProperty(key)) {
                    mapContent += key.toUpperCase() + ": " + videoFileMap[key] + "\n";
                }
            }
            // alert("视频文件：\n" + mapContent);
        }
        // 导入视频文件
        var count = 0;
        for (var key in videoFileMap) {
            if (videoFileMap.hasOwnProperty(key)) {
                var filePaths = videoFileMap[key];
                // alert("正在导入：" + filePaths);
                // 获取当前项目和根目录
                var project = app.project;
                var rootItem = project.rootItem;

                // 获取文件夹（Bin）并删除现有文件夹
                var existingFolder = getBinByName(rootItem, key);
                if (existingFolder) {
                    // 删除已存在的文件夹及其内容
                    deleteBinAndContents(existingFolder);
                    // alert("已删除文件夹：" + key);
                }

                // 创建文件夹（Bin）
                var newFolder = rootItem.createBin(key);

                // 导入文件到指定文件夹

                var importedFiles = app.project.importFiles(filePaths, true, newFolder);
                count += filePaths.length;

                // alert("<" + key + ">视频文件已成功导入到文件夹: " + key + "，文件数：" + filePaths.length);
            }
        }
        // 提示导入成功
        // alert("视频文件已成功导入到文件夹，文件数总计：" + count);
    } catch (error) {
        // 捕获任何错误并提示
        alert("导入视频时发生错误: " + error.message);
    }
}
