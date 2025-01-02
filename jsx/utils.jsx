function createSequenceFolder(folderName) {
    // 创建保存序列的文件夹
    folderSequence = "sequences-" + folderName;
    var existingFolder = getBinByName(app.project.rootItem, folderSequence);
    if (existingFolder) {
        deleteBinAndContents(existingFolder);
        // alert("已删除文件夹：" + key);
    }
    var project = app.project;
    var rootItem = project.rootItem;
    var newFolder = rootItem.createBin(folderSequence);
    return newFolder
}

// 根据文件夹名称获取已存在的文件夹（Bin）
function getBinByName(rootItem, binName) {
    for (var i = 0; i < rootItem.children.numItems; i++) {
        if (rootItem.children[i].name === binName) {
            result = rootItem.children[i];
            return result
        }
    }
    return null; // 如果没有找到，返回 null
}

// 删除文件夹及其所有内容
function deleteBinAndContents(bin) {
    try {
        if (!bin || !bin.children) {
            throw new Error("文件夹不存在或未正确加载");
        }

        var items = bin.children;
        // 删除文件夹中的所有子项
        for (var i = items.numItems - 1; i >= 0; i--) {
            if (items[i] && typeof items[i].remove === "function") {
                items[i].deleteBin();
            }
        }
        bin.deleteBin(); // 删除空文件夹
    } catch (error) {
        alert("删除文件夹时发生错误: " + error.message);
    }
}

function saveProject(projectPath) {
    try {
        // 保存项目文件
        app.project.saveAs(projectFilePath);
        // alert("项目已保存: " + projectPath);
    } catch (error) {
        // 捕获并提示错误
        alert("保存项目时发生错误: " + error.message);
    }
}

function createProject(projectPath) {
    try {
        var projectFile = new File(projectPath);

        // 检查项目文件是否已经存在
        if (projectFile.exists) {
            // 删除已存在的项目文件
            projectFile.remove();
            // alert("已删除旧项目文件: " + projectPath);
        }

        // 创建新的 PR 项目
        app.newProject(projectPath);
        // alert("新项目已创建: " + projectPath);
        
    } catch (error) {
        // 捕获并提示错误
        alert("创建项目时发生错误: " + error.message);
    }
}
