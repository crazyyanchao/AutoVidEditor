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
        // 获取文件夹名称
        var bin = getBinByName(app.project.rootItem, folderName);
        if (bin) {
            // 获取文件夹中的所有视频文件
            var videoFiles = bin.children;
            var startTime = 0; // 起始时间
            for (var i = 0; i < videoFiles.numItems; i++) {
                var videoFile = videoFiles[i];
                var track = activeSequence.videoTracks[trackId];
                alert(videoFile.name);
                track.insertClip(videoFile, startTime);
                
                // var mediaFile = app.project.importFiles([videoFile], true); // 1 表示导入并转换媒体文件
                // var duration = mediaFile[0].duration.seconds; // 获取转换后的文件时长
                // alert("end_time: " + duration);
                // startTime += duration; // 更新起始时间
            }
        }
    }
}

// function placeMultipleClips(trackId, folderName, videoFileMap) {
//     // 获取当前活动序列
//     var activeSequence = app.project.activeSequence;
    
//     // 检查是否有该文件夹
//     if (videoFileMap.hasOwnProperty(folderName)) {
//         // 创建序列文件夹
//         var newFolder = createSequenceFolder(folderName);
        
//         // 获取文件夹
//         var bin = getBinByName(app.project.rootItem, folderName);
//         if (bin) {
//             // 获取文件夹中的所有视频文件
//             var videoFiles = bin.children;
//             var startTime = 0; // 初始时间
            
//             // 检查是否获取到文件
//             if (videoFiles && videoFiles.numItems > 0) {
//                 for (var i = 0; i < videoFiles.numItems; i++) {
//                     var videoFile = videoFiles[i];
                    
//                     // 确保 videoFile 是有效的媒体项目
//                     if (videoFile instanceof ProjectItem) {
//                         // 更严格的检查是否为媒体文件（例如 .mp4 文件）
//                         alert('videoFile.isMedia: '+videoFile.isMedia)
//                         alert('videoFile.type: '+videoFile.type)
//                         if (videoFile.isMedia && videoFile.type === "File") {
//                             // 获取轨道
//                             var track = activeSequence.videoTracks[trackId];
                            
//                             // 插入视频片段
//                             alert("Inserting: " + videoFile.name);
//                             track.insertClip(videoFile, startTime);

//                             // 确保 videoFile 有 duration 属性，并且 duration 秒数有效
//                             if (videoFile.duration && videoFile.duration.seconds !== undefined) {
//                                 var endTime = videoFile.duration.seconds;
//                                 alert("End time: " + endTime);
//                                 startTime += endTime; // 更新起始时间
//                             } else {
//                                 alert("Error: Duration is not defined for " + videoFile.name);
//                             }
//                         } else {
//                             alert("Skipping non-media item: " + videoFile.name);
//                         }
//                     } else {
//                         alert("Skipping non-media item: " + videoFile.name);
//                     }
//                 }
//             } else {
//                 alert("No video files found in the folder: " + folderName);
//             }
//         } else {
//             alert("Folder not found: " + folderName);
//         }
//     } else {
//         alert("Folder name not found in videoFileMap: " + folderName);
//     }
// }



function createNewSequenceFromClips(folderName,videoFileMap) {
    // 创建新的序列，将视频文件添加到序列中【模拟终端的拖入视频操作】
    if (videoFileMap.hasOwnProperty(folderName)) {
        // 创建序列文件夹
        var newFolder = createSequenceFolder(folderName);
        // 获取文件夹名称
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
