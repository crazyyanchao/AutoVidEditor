
#include http.js
#include utils.jsx
#include tracks.jsx
#include import.jsx

function run() {
    // ============================自定义配置============================
    // 指定PR工程文件生成位置
    projectPath="D:\\pr-project\\test.prproj";

    // 项目中保存音频文件的文件夹
    audioFolder = "audios";
    // 视频文件
    mp4 = "C:\\Users\\admin\\AppData\\Local\\Temp\\gradio\\4f0ed949dd730e9a822afa0b3ca9560d61e77380d8fd69330d80a62990a24380\\E8AEBFE8B088.mp4";
    mp42 = "C:\\Users\\admin\\AppData\\Local\\Temp\\gradio\\da5dd37c8fa19c15357f652def3640f5d21ffa07b1ab5b34d1985d36eed79574\\E4B8BAE4BB80E4B988E8A681E5A49AE8AFBBE4B9A6EFBC9FE8BF99E698AFE68891E590ACE8BF87E69C80E5A5BDE79A84E7AD94E6A188-E78987E6AEB5.mp4"
    // videoFileMap={
    //     "video1":["C:\\Users\\admin\\Downloads\\C0761.mp4"],
    //     "video2":["C:\\Users\\admin\\Downloads\\C0761.mp4", mp4]
    // }
    videoFileMap={
        "video1":[mp4,mp42],
        "video2":[mp4,mp42],"video3":[mp4,mp42]
    }
    // 文字速记文件
    noteFilePath="D:\\workspace\\AutoVidEditor\\data\\note.json";
    // 成片脚本文件
    shotFilePath="D:\\workspace\\AutoVidEditor\\data\\shot.json";
    // 文字速记和成片脚本的关联文件
    

    // ============================Automated Video Editor============================
    runAutoVidEditor(projectPath,audioFolder,videoFileMap,noteFilePath,shotFilePath);
}

function runAutoVidEditor(projectPath,audioFolder,videoFileMap,noteFilePath,shotFilePath){
    // 1. 创建PR项目
    createProject(projectPath);

    // 2. 导入视频文件
    importVideo(videoFileMap);

    // 3. 将视频文件导入到时间线轨道
    // importVideoToTimeline(videoFileMap);
    importVideoToTracks(videoFileMap);

    // 4. 匹配速记与视频
    // importShot(noteFilePath, videoFileMap);

    // 5. 剪辑视频素材
    // editVideo(shotFilePath,videoFileMap);

    // 6. 保存工程文件
    // saveProject(projectPath);
}

function importShot(noteFilePath, videoFileMap) {
    // 匹配速记与视频：根据速记中的时间戳，将说话内容映射到对应的视频片段。
    try {
        // 读取速记文件
        var noteFile = new File(noteFilePath);
        if (!noteFile.exists) {
            alert("速记文件不存在: " + noteFilePath);
            return;
        } else {
            // alert("已找到速记文件: " + noteFilePath);
        }
        noteFile.open("r");
        var noteContent = noteFile.read();
        noteFile.close();
        var noteData = JSON.parse(noteContent);

        // 读取视频文件
        var videoData = {};
        for (var folderName in videoFileMap) {
            if (videoFileMap.hasOwnProperty(folderName)) {
                var videoFiles = videoFileMap[folderName];
                videoData[folderName] = videoFiles;
            }
        }
        alert("noteData: " + JSON.stringify(noteData));
        alert("videoData: " + JSON.stringify(videoData));

        // 匹配速记与视频
        // var sequence = app.project.activeSequence;
        // var transcriptData = /* 解析后的速记数据，包括时间戳、说话人和内容 */;

        // transcriptData.forEach(function(entry) {
        //     var timestamp = entry.timestamp; // 例如：00:02:15
        //     var speaker = entry.speaker;
        //     var content = entry.content;

        //     // 将时间戳转换为秒
        //     var timeInSeconds = convertTimestampToSeconds(timestamp);

        //     // 在指定时间位置创建标记
        //     var marker = sequence.markers.createMarker(timeInSeconds);
        //     marker.name = speaker;
        //     marker.comments = content;
        // });
        var shotData = matchShot(noteData, videoData);

        // 导入匹配后的速记与视频
        importShotToTimeline(shotData);

    } catch (error) {
        // 捕获任何错误并提示
        alert("导入速记时发生错误: " + error.message);
    }
}

function matchShot(noteData, videoData) {
    // 匹配速记与视频
    var shotData = {};
    for (var folderName in videoData) {
        if (videoData.hasOwnProperty(folderName)) {
            var videoFiles = videoData[folderName];
            var shots = [];
            for (var i = 0; i < noteData.length; i++) {
                var note = noteData[i];
                var shot = {};
                shot["note"] = note;
                shot["video"] = videoFiles[i % videoFiles.length];
                shots.push(shot);
            }
            shotData[folderName] = shots;
        }
    }
    return shotData;
}

function editVideo(shotFilePath, videoFileMap) {
    // 剪辑视频素材：根据成片脚本，将视频片段剪辑、重排、合并成成片。
    try {
        // 读取成片脚本文件
        var shotFile = new File(shotFilePath);
        if (!shotFile.exists) {
            alert("成片脚本文件不存在: " + shotFilePath);
            return;
        } else {
            // alert("已找到成片脚本文件: " + shotFilePath);
        }
        shotFile.open("r");
        var shotContent = shotFile.read();
        shotFile.close();
        var shotData = JSON.parse(shotContent);

        // 读取视频文件
        var videoData = {};
        for (var folderName in videoFileMap) {
            if (videoFileMap.hasOwnProperty(folderName)) {
                var videoFiles = videoFileMap[folderName];
                videoData[folderName] = videoFiles;
            }
        }
        // var sequence = app.project.activeSequence;
        // var finalScriptData = /* 解析后的成片脚本数据，包括时间戳和镜头信息 */;

        // finalScriptData.forEach(function(entry) {
        //     var startTimestamp = entry.startTimestamp;
        //     var endTimestamp = entry.endTimestamp;

        //     // 将时间戳转换为秒
        //     var startTime = convertTimestampToSeconds(startTimestamp);
        //     var endTime = convertTimestampToSeconds(endTimestamp);

        //     // 获取时间轴中的视频轨道
        //     var videoTrack = sequence.videoTracks[0]; // 假设使用第一个视频轨道
        //     var clips = videoTrack.clips;

        //     clips.forEach(function(clip) {
        //         if (clip.start <= startTime && clip.end >= endTime) {
        //             // 根据指定的开始和结束时间剪辑视频片段
        //             clip.inPoint = startTime;
        //             clip.outPoint = endTime;
        //         }
        //     });
        // });

        editVideoClip(shotData, videoData);

    } catch (error) {
        // 捕获任何错误并提示
        alert("剪辑视频素材时发生错误: " + error.message);
    }
}


run();

// 测试请求接口
// request_api("https://api.deepseek.com/chat/completions", { name: "test" });

// test();
