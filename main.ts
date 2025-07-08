// main.ts
import { App, Plugin, Notice } from 'obsidian';
import { FindReplaceModal } from './FindReplaceModal';
import { getLocaleStrings, LocalizedStrings } from './lang';

export default class FindReplaceInFolderPlugin extends Plugin {
    private t: LocalizedStrings;

    async onload() {
        this.setLanguage();

        // ======================= 【最终解决方案】 =======================
        // 1. 我们调用 on() 方法并存储返回的 EventRef 对象。
        // 2. 我们使用 `as any` 来强制绕过 TypeScript 的类型检查，因为它不知道 'language-change'。
        const langChangeEventRef = this.app.workspace.on('language-change' as any, () => {
            this.setLanguage();
            // 注意: Ribbon 和命令名称需要重启 Obsidian 才能刷新。
        });

        // 3. 我们使用 this.register() 注册一个【清理函数】。
        //    当插件卸载时，这个函数会被调用，从而安全地注销我们的事件监听。
        this.register(() => {
            this.app.workspace.offref(langChangeEventRef);
        });
        // =============================================================

        this.addRibbonIcon('file-search-2', this.t.ribbonTooltip, () => {
            this.openFindReplaceModal();
        });

        this.addCommand({
            id: 'open-find-replace-modal',
            name: this.t.commandName,
            callback: () => {
                this.openFindReplaceModal();
            }
        });
    }

    // unload 函数可以留空，因为 this.register() 已经帮我们处理了所有清理工作。
    onunload() {}

    setLanguage() {
        this.t = getLocaleStrings();
    }

    openFindReplaceModal() {
        new FindReplaceModal(this.app, this.t, (result) => {
            this.performReplacement(result.folder, result.find, result.replace, result.caseSensitive, result.useRegex);
        }).open();
    }

    async performReplacement(folderPath: string, searchTerm: string, replaceTerm: string, caseSensitive: boolean, useRegex: boolean) {
        if (!searchTerm) {
            new Notice(this.t.errorFindInputEmpty);
            return;
        }

        new Notice(this.t.infoStarting, 3000);

        const allMarkdownFiles = this.app.vault.getMarkdownFiles();
        let filesToProcess;

        if (folderPath === "/") {
            filesToProcess = allMarkdownFiles;
        } else {
            filesToProcess = allMarkdownFiles.filter(file => file.path.startsWith(folderPath + '/'));
        }

        const folderDisplayName = folderPath === "/" ? (this.t.folderSettingName === '选择文件夹' ? '整个仓库' : 'the entire vault') : folderPath;

        if (filesToProcess.length === 0) {
            new Notice(this.t.infoNoFilesFound(folderDisplayName));
            return;
        }

        let modifiedFileCount = 0;

        try {
            let searchRegex: RegExp | null = null;
            if (useRegex) {
                const flags = 'g' + (caseSensitive ? '' : 'i');
                searchRegex = new RegExp(searchTerm, flags);
            }

            for (const file of filesToProcess) {
                const originalContent = await this.app.vault.read(file);
                let newContent: string;

                if (useRegex && searchRegex) {
                    newContent = originalContent.replace(searchRegex, replaceTerm);
                } else {
                    if (caseSensitive) {
                        newContent = originalContent.replaceAll(searchTerm, replaceTerm);
                    } else {
                        const flags = 'gi';
                        const tempRegex = new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), flags);
                        newContent = originalContent.replace(tempRegex, replaceTerm);
                    }
                }

                if (originalContent !== newContent) {
                    await this.app.vault.modify(file, newContent);
                    modifiedFileCount++;
                }
            }
            
            new Notice(this.t.successResults(modifiedFileCount, folderDisplayName), 10000);

        } catch (e) {
            if (e instanceof SyntaxError) {
                new Notice(this.t.errorInvalidRegex(e.message));
            } else {
                console.error("批量替换时发生未知错误:", e);
                new Notice("An unknown error occurred during replacement.");
            }
        }
    }
}
