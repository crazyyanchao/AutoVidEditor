// 导入jQuery请求接口
// import jQuery
// #include "jquery-3.7.1.min.js";

// 下载jQuery文件
function download_jQuery() {
    var url = "https://code.jquery.com/jquery-3.7.1.min.js";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("下载jQuery文件成功");
            var blob = xhr.response;
            var reader = new FileReader();
            reader.onload = function (e) {
                var content = e.target.result;
                var file = new File([content], "jquery-3.7.1.min.js", { type: "application/javascript" });
                saveAs(file);
            };
            reader.readAsText(blob);
        }
    };
    xhr.send();
}

function request_api(url, data) {

    try {
        // 导入jQuery库
        $.evalFile("D:\\workspace\\AutoVidEditor\\jsx\\jquery-3.7.1.min.js");
        alert("导入jQuery库成功");
        var settings = {
  "url": url,
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Authorization": "Bearer sk-4ed55739649245619b7a6451f8b927e3",
    "Content-Type": "application/json",
    "Cookie": "HWWAFSESID=6f621586271267c04f8; HWWAFSESTIME=1735466192395"
  },
  "data": data};
        alert("请求参数：" + JSON.stringify(settings));
        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    } catch (error) {
        // 捕获任何错误并提示
        alert("请求接口时发生错误: " + error.message + "\n" + error.stack);
    }
}     

function test() {
    alert('<div>test</div>');
}

  

