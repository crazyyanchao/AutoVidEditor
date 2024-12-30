# 视频自动剪辑(AutoVidEditor)

1. 视频读取（PR软件支持的格式-MP4）
2. 解析视频（时间轴文字）
3. 视频分段（按照文字稿要求分段视频）
4. 视频分段重排序（按照文字稿要求重排序视频分段）
5. 生成最终需要的视频（PR软件的工程文件）

## PR软件下载

[Premiere 2020](https://www.rjctx.com/410.html)
[Premiere 2024](https://www.tzsucai.com/softdetail/383.html)

## PR插件开发工具下载

[CEP-Resources/ExtendScript-Toolkit/AdobeExtendScriptToolkit_4_LS22.exe](https://github.com/Adobe-CEP/CEP-Resources/blob/master/ExtendScript-Toolkit/Readme.md)

## 怎么生成PR的工程文件？

## PR插件开发

1. 从PR读取视频时间轴
2. 解析视频（时间轴文字）
3. 视频分段（按照文字稿要求分段视频）
4. 视频分段重排序（按照文字稿要求重排序视频分段）




## ExtendScript资料

### 辅助工具
- Script Listener

Script Listener是Adobe社区里推出的辅助工具，可以随时记录用户对Adobe宿主程序的操作，然后生成ExtendScript脚本文件在桌面上供用户查看和选用——使用这种方式生成ExtendScript代码，可以让开发者省去很多学习Extendscript API的成本。

- JSX.js

JSX.js是提供给CEP应用的JavaScript环境一个JS库，可以代替原生的方法来引入ExtendScript的文件或执行Extendscript的代码，它解决了一个很重要的痛点——提供了执行ExtendScript的报错信息（这比起原生调用ExtendScript代码执行得到一句evalScript error体验要强上很多倍）。

- ExtendScript Debugger

这是目前Adobe官方提供的，当前版本唯一用来调试ExtendScript的工具。它是一个VSCode Debugger插件，可以像其它的VScode Debugger一样，提供相关报错信息，实现断点调试的功能。

### 参考链接

- [Adobe Photoshop Scripting](https://www.adobe.com/devnet/photoshop/scripting.html)
- [Configure your extension in manifest.xml](https://github.com/Adobe-CEP/Getting-Started-guides#2-configure-your-extension-in-manifestxml)
- [CSInterface.js](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_10.x/CSInterface.js)
- [Applications Integrated with CEP](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md#applications-integrated-with-cep)
- [JSON3](https://github.com/bestiejs/json3)
- [LumpyChen/CEP-Test](https://github.com/LumpyChen/CEP-Test)
- [Package Distribute Install Guide](https://github.com/Adobe-CEP/Getting-Started-guides/tree/master/Package%20Distribute%20Install#package-distribute-install-guide)
- [Script Listener](https://helpx.adobe.com/photoshop/kb/downloadable-plugins-and-content.html#ScriptingListenerplugin)
- [JSX.js](https://creative-scripts.com/jsx-js/)
- [ExtendScript Debugger](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug)
- [CEP Intro](https://github.com/Adobe-CEP/CEP-Resources)
- [nullice的Adobe CEP扩展开发教程](http://nullice.com/archives/category/note/%E8%BD%AF%E4%BB%B6%E6%95%99%E7%A8%8B/adobe-cep)
- [Photoshop Scripting Documentation](https://www.notion.so/a908db4f72a74854b36c10e72a69b751)
- [Photoshop-CC-Javascript-Ref-2019](https://wwwimages2.adobe.com/content/dam/acom/en/devnet/photoshop/pdfs/photoshop-cc-javascript-ref-2019.pdf)
- [Adobe CEP | 目录结构及各文件解析](https://www.wujiayi.vip/index.php/archives/579/)
- [Premiere Pro Scripting Guide](https://ppro-scripting.docsforadobe.dev/index.html)



