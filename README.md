# 《拱廊街计划》 · Le Livre des passages

一份持续补充的可视化读书导览，以及一款独立的巴黎漫游剧情游戏。

**[打开网站](https://arcades-paris-reading-atlas.moderncrumb2.chatgpt.site/) · [进入游戏](https://arcades-paris-reading-atlas.moderncrumb2.chatgpt.site/game.html)**

![巴黎油画地图](dist/assets/unique/painted-paris-map.jpg)

## 可以体验什么

- 全书七大部分、36个卷轴、51个目录条目，保留2207段导览材料。
- 巴黎记忆：35处地点的介绍、插图及卷轴线索。
- 巴黎人物：42位具名人物、15类群体的身份说明与材料索引。
- 151幅图像画廊，支持检索、分类和完整画幅查看。
- 独立剧情游戏：以本雅明朋友的身份走过12站，和城市群体交谈、选择回应、收集手札。
- 17张原创虚构玩家及NPC透明立绘，本雅明另有三种神态；每次只显示当前发言者。

## 本地运行

项目是原生 HTML、CSS 与 JavaScript，无需构建，也不需要 API 密钥。

直接打开 `dist/index.html` 或 `dist/game.html` 即可。也可以在仓库目录运行：

```sh
python -m http.server 8080 --directory dist
```

然后访问 `http://localhost:8080/`。存档与阅读记录保存在当前浏览器的 localStorage 中。

## 文件结构

```text
dist/
  index.html          全书导览入口
  game.html           独立游戏入口
  data.js             导览结构与材料
  atlas-data.js       地点、人物与群体索引
  atlas-intros.js     身份简介与外部资料
  novel-data.js       游戏剧情与背景
  novel-core.js       游戏状态与分支
  novel.js            游戏界面
  assets/             本地插图、角色与背景
docs/                 版本与素材说明
```

## 内容与素材说明

导览材料包括摘引与解读，仍有目录材料待补，引用版本和页码尚需继续校对。网站不是经校勘的原著全文。

游戏人物、画刊事件与对话为文学创作；观点台词标注为改写，不冒充本雅明逐字引文。AI插图属于艺术演绎，不能作为历史肖像或建筑复原。

历史照片及透纳、毕沙罗等画作的来源和用途，可在网站“版本与资料说明”与图像画廊查看。仓库暂未为第三方引文与素材统一指定许可。

设计参考开源 Taste-skill；视频制作工具导航见 [awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills)。

## 进展

当前已完成两种选择路线的12章流程检查、角色显示和旧存档兼容检查，以及36卷、2207段材料、画廊和92份身份介绍的完整性检查。欢迎反馈阅读线索、文字和交互问题。
