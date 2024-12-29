// var pythonScriptPath = "/path/to/your/script.py";
// var command = "python " + pythonScriptPath;  // 也可以改为 python3

// var command = "dir";
// // D:\workspace\AutoVidEditor\jsx
// var file = new File("D:\\workspace\\AutoVidEditor\\jsx\\bat\\tempScript.bat");  // 创建一个临时文件
// file.open("w");
// file.write(command);
// file.close();
// alert("临时脚本已创建：" + file.fsName);
// file.execute();  // 执行临时脚本


var command = "cd /d D:\\workspace\\AutoVidEditor\\jsx\\bat && dir > tempResult.txt";  // 先切换目录，再执行 dir 命令并将输出重定向到 tempResult.txt

// 临时脚本的路径
var batFilePath = "D:\\workspace\\AutoVidEditor\\jsx\\bat\\tempScript.bat";  

// 创建临时 BAT 文件
var file = new File(batFilePath);
file.open("w");
file.write(command);
file.close();
alert("临时脚本已创建：" + file.fsName);

// 执行临时脚本
file.execute();

// 等待命令执行完成后，读取结果文件
var resultFile = new File("D:\\workspace\\AutoVidEditor\\jsx\\bat\\tempResult.txt");
while (!resultFile.exists) {
    $.sleep(100);  // 等待文件生成
}

resultFile.open("r");
var resultContent = resultFile.read();
resultFile.close();

// 显示结果
alert("脚本执行结果：\n" + resultContent);

// 可选：删除临时文件
// resultFile.remove();
// file.remove();
