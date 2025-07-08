import { App, Plugin, PluginSettingTab, Setting, Modal, Notice } from 'obsidian';
import { FindReplaceModal } from './FindReplaceModal'; // 我们将创建这个文件

export default class FindReplaceInFolderPlugin extends Plugin {

	async onload() {
		// 在左侧功能区添加一个图标
		this.addRibbonIcon('file-search-2', '批量查找替换', (evt: MouseEvent) => {
			this.openFindReplaceModal();
		});

		// 添加一个命令，可以通过 Ctrl/Cmd + P 调用
		this.addCommand({
			id: 'open-find-replace-modal',
			name: '对文件夹进行批量查找替换',
			callback: () => {
				this.openFindReplaceModal();
			}
		});
	}

	onunload() {
		// 插件卸载时需要清理的资源
	}

    openFindReplaceModal() {
        new FindReplaceModal(this.app, (result) => {
            // 这是当用户在 Modal 中点击 "替换" 按钮后执行的回调函数
            this.performReplacement(result.folder, result.find, result.replace, result.caseSensitive, result.useRegex);
        }).open();
    }

    async performReplacement(folderPath: string, searchTerm: string, replaceTerm: string, caseSensitive: boolean, useRegex: boolean) {
        if (!searchTerm) {
            new Notice("查找内容不能为空！");
            return;
        }

        new Notice("正在开始批量替换...", 3000);

        const allMarkdownFiles = this.app.vault.getMarkdownFiles();
        let filesToProcess;

        if (folderPath === "/") { // 根目录
            filesToProcess = allMarkdownFiles;
        } else {
            filesToProcess = allMarkdownFiles.filter(file => file.path.startsWith(folderPath + '/'));
        }

        if (filesToProcess.length === 0) {
            new Notice(`在文件夹 "${folderPath}" 中未找到任何 Markdown 文件。`);
            return;
        }

        let modifiedFileCount = 0;
        let searchRegex: RegExp;

        try {
            if (useRegex) {
                // 如果使用正则，构建正则表达式
                // 'g' for global, 'i' for case-insensitive
                const flags = 'g' + (caseSensitive ? '' : 'i');
                searchRegex = new RegExp(searchTerm, flags);
            }
        } catch (e) {
            new Notice("无效的正则表达式: " + e.message);
            return;
        }


        for (const file of filesToProcess) {
            try {
                const originalContent = await this.app.vault.read(file);
                let newContent: string;

                if (useRegex) {
                    newContent = originalContent.replace(searchRegex, replaceTerm);
                } else {
                    // 普通文本替换
                    if (caseSensitive) {
                        newContent = originalContent.replaceAll(searchTerm, replaceTerm);
                    } else {
                        // 不区分大小写的普通文本替换需要用正则实现
                        const flags = 'gi';
                        const tempRegex = new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), flags);
                        newContent = originalContent.replace(tempRegex, replaceTerm);
                    }
                }

                if (originalContent !== newContent) {
                    await this.app.vault.modify(file, newContent);
                    modifiedFileCount++;
                }
            } catch (error) {
                console.error(`处理文件 ${file.path} 时出错:`, error);
            }
        }
        
        const folderDisplayName = folderPath === "/" ? "整个仓库" : `文件夹 "${folderPath}"`;
        new Notice(`操作完成！\n在 ${folderDisplayName} 中，共修改了 ${modifiedFileCount} 个文件。`, 10000);
    }
}
