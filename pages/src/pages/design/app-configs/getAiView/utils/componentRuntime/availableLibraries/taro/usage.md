# 简介

- Taro API

### defineAppConfig
在当前环境下，tabBar.list[number].iconPath、tabBar.list[number].selectedIconPath使用网络图片进行配置

注意：底部导航必须使用 defineAppConfig 进行 tabBar.list 的配置，禁止编写自定义 UI 代码实现

### ScrollView
在当前环境下，页面级滚动禁止使用 ScrollView 组件实现，页面自带了滚动能力

### 根节点
在当前环境下，根节点的样式必须使用 `height: 100%;`，禁止使用 `height: 100vh;`、`min-height: 100vh;`
