# Find and Replace in Folder for Obsidian

![Plugin Version](https://img.shields.io/badge/version-1.1.0-blue)

这是一个为 [Obsidian.md](https://obsidian.md) 设计的插件，允许用户在一个指定的文件夹内，对所有笔记进行批量的查找和替换操作。

## 功能特性

- 📂 **文件夹选择器**：自动扫描并列出所有文件夹，方便选择。
- 🔍 **统一的输入界面**：在同一个对话框内输入查找和替换的内容。
- ⚙️ **灵活的选项**：支持区分大小写和使用正则表达式。
- ✅ **便捷的入口**：在侧边栏和命令面板中均可快速启动。

## 如何使用

1.  从 Obsidian 的命令面板 (`Ctrl/Cmd + P`) 运行 "对文件夹进行批量查找替换" 命令，或者点击左侧功能区的图标。
2.  在弹出的窗口中：
    - 选择你想要操作的文件夹。
    - 输入要查找的文本。
    - 输入要替换成的文本。
    - 根据需要开启“区分大小写”或“使用正则表达式”选项。
3.  点击 "执行替换" 按钮。
4.  插件会对目标文件夹内的所有 `.md` 文件执行操作。

**⚠️ 警告：** 此操作无法撤销，请在操作前务必备份您的仓库。

## 安装

### 手动安装

1.  从 [GitHub Releases](https://github.com/hailey07/find-replace-in-folder) 页面下载最新的 `main.js` 和 `manifest.json` 文件。
2.  将这两个文件放入你的 Obsidian 仓库的 `.obsidian/plugins/your-plugin-id/` 文件夹中 (例如 `.obsidian/plugins/find-replace-in-folder/`)。
3.  重启 Obsidian，然后在设置中启用此插件。
