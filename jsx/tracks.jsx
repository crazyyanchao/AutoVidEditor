#include utils.jsx

function importVideoToMultiTracks(videoFileMap) {
    // 将视频文件添加到多个序列
    try {
        var count = 0;

        // 遍历 videoFileMap 来处理已导入的视频文件
        // 每个folderName对应的视频放在一个轨道上，同一时间轴上播放
        
        for (var folderName in videoFileMap) {
            if (videoFileMap.hasOwnProperty(folderName)) {
                // 创建序列文件夹
                var newFolder = createSequenceFolder(folderName);
                // 获取文件夹名称
                var bin = getBinByName(app.project.rootItem, folderName);
                if (!bin) {
                    alert("未找到文件夹：" + folderName);
                    continue; // 如果找不到文件夹，跳过
                } else {
                    // alert("文件夹：" + folderName);
                }

                // 获取文件夹中的所有视频文件
                var videoFiles = bin.children;
                var arrayOfProjectItems = [];
                for (var i = 0; i < videoFiles.numItems; i++) {
                    var videoFile = videoFiles[i];
                    arrayOfProjectItems.push(videoFile);
                    count++;
                }
                var sequence = app.project.createNewSequenceFromClips(folderName, arrayOfProjectItems, newFolder);
                // createSubsequence
            }
        }

        // 提示导入成功
        // alert("视频文件已成功添加到时间线轨道，文件数总计：" + count);

    } catch (error) {
        // 捕获任何错误并提示
        alert("添加视频到时间线时发生错误: " + error.message);
    }
}

function importVideoToTracks(videoFileMap) {
    // 将视频文件添加到单个序列，第一个视频文件放在第一个轨道上，第二个视频文件放在第二个轨道上，以此类推
    try {
        var count = 0;

        // 遍历 videoFileMap 来处理已导入的视频文件
        // 每个folderName对应的视频放在一个轨道上，同一时间轴上播放
        var trackId = 0;
        for (var folderName in videoFileMap) {
            var activeSequence = app.project.activeSequence;
            if (activeSequence) {
                alert("上一个序列已创建：" + activeSequence.name);
                placeMultipleClips(trackId,folderName,videoFileMap)

            } else {
                alert("未找到上一个序列");
                createNewSequenceFromClips(folderName,videoFileMap);
            }
            trackId++;
        }

        // 提示导入成功
        // alert("视频文件已成功添加到时间线轨道，文件数总计：" + count);

    } catch (error) {
        // 捕获任何错误并提示
        alert("添加视频到时间线时发生错误: " + error.message);
    }
}

function placeMultipleClips(trackId,folderName,videoFileMap) {
    // 将视频文件添加到已有序列中
    var activeSequence = app.project.activeSequence;
    if (videoFileMap.hasOwnProperty(folderName)) {
        // 创建序列文件夹
        var newFolder = createSequenceFolder(folderName);
        // 获取文件夹
        var bin = getBinByName(app.project.rootItem, folderName);
        if (bin) {
            // 获取文件夹中的所有视频文件
            var videoFiles = bin.children;
            var startTime = 0; // 起始时间
            for (var i = videoFiles.numItems-1; i>=0; i--) {
                var videoFile = videoFiles[i];
                var track = activeSequence.videoTracks[trackId];
                track.insertClip(videoFile, 0);
            }
        }
    }
}

function createNewSequenceFromClips(folderName,videoFileMap) {
    // 创建新的序列，将视频文件添加到序列中【模拟终端的拖入视频操作】
    if (videoFileMap.hasOwnProperty(folderName)) {
        // 创建序列文件夹
        var newFolder = createSequenceFolder(folderName);
        // 获取文件夹
        var bin = getBinByName(app.project.rootItem, folderName);
        if (bin) {
            // 获取文件夹中的所有视频文件
            var videoFiles = bin.children;
            var arrayOfProjectItems = [];
            for (var i = 0; i < videoFiles.numItems; i++) {
                var videoFile = videoFiles[i];
                arrayOfProjectItems.push(videoFile);
            }
            app.project.createNewSequenceFromClips('sequence-video', arrayOfProjectItems, newFolder);
        }
    }
}
