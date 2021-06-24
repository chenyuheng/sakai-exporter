# Sakai 站点资源导出器

导出一个sakai站点的全部资源的脚本。最后输出一个zip包。

写得比较急，代码难看，肯定也有很多bug，暂时只求能用就行。

## 用法

使用chrome登录sakai，进入想导出资源的站点，按F12进入js命令控制台，一行行地输入以下语句：

```javascript
$("head").append($("<script></script>").attr("src", "https://cdn.jsdelivr.net/gh/chenyuheng/sakai-exporter/exporter.js"));

$("head").append($("<script></script>").attr("src", "https://cdn.jsdelivr.net/gh/chenyuheng/sakai-exporter/jszip.js"));

run();
```

然后再等着就行了，文件大就慢，文件小就快。

## 基本流程

首先获取资源页面的url。然后展开全部文件夹。再依次下载文件并存入zip对象中，最后生成并下载zip文件。

## 已知的bug

* 特殊文件类型，比如网址不太支持，暂时直接跳过。
* 文件夹命名可能与显示的有差异，目测原因是老师给文件夹改过名，下载下来的文件夹名字是最开始创建文件夹时的命名。
* 导出zip文件时可能会卡住。

## 感谢

[jszip](https://stuk.github.io/jszip/)：一个挺方便的处理zip文件的js库。

