import { App, Modal, Setting } from 'obsidian';

// 定义了用户提交时返回的数据结构
interface FindReplaceResult {
    folder: string;
    find: string;
    replace: string;
    caseSensitive: boolean;
    useRegex: boolean;
}

export class FindReplaceModal extends Modal {
    result: FindReplaceResult = {
        folder: '',
        find: '',
        replace: '',
        caseSensitive: true,
        useRegex: false,
    };

    onSubmit: (result: FindReplaceResult) => void;

    constructor(app: App, onSubmit: (result: FindReplaceResult) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: '批量查找和替换' });

        // 1. 文件夹选择器
        const folders = this.getFolders();
        if (folders.size > 0) {
            this.result.folder = folders.values().next().value;
        }
        new Setting(contentEl)
            .setName('选择文件夹')
            .setDesc('选择要进行操作的目标文件夹。')
            .addDropdown(dropdown => {
                folders.forEach(folder => {
                    dropdown.addOption(folder, folder);
                });
                dropdown.setValue(this.result.folder);
                dropdown.onChange(value => {
                    this.result.folder = value;
                });
            });

        // 2. 查找内容输入框
        new Setting(contentEl)
            .setName('查找内容')
            .addText(text => text
                .setPlaceholder('输入要查找的文本...')
                .setValue(this.result.find)
                .onChange(value => {
                    this.result.find = value;
                }));

        // 3. 替换内容输入框
        new Setting(contentEl)
            .setName('替换为')
            .addText(text => text
                .setPlaceholder('输入要替换的文本...')
                .setValue(this.result.replace)
                .onChange(value => {
                    this.result.replace = value;
                }));

        // ========================================================== //
        //                      *** 修改部分开始 ***                    //
        // ========================================================== //
        
        // 4. 选项 (已拆分为两个独立的设置)

        // 区分大小写选项
        new Setting(contentEl)
            .setName('区分大小写')
            .setDesc('开启后，"Apple" 和 "apple" 将被视为不同的词。')
            .addToggle(toggle => toggle
                .setValue(this.result.caseSensitive)
                .onChange(value => {
                    this.result.caseSensitive = value;
                }));

        // 使用正则表达式选项
        new Setting(contentEl)
            .setName('使用正则表达式')
            .setDesc('开启后，查找内容将被作为正则表达式进行匹配。')
            .addToggle(toggle => toggle
                .setValue(this.result.useRegex)
                .onChange(value => {
                    this.result.useRegex = value;
                }));
        
        // ========================================================== //
        //                      *** 修改部分结束 ***                    //
        // ========================================================== //

        // 5. 提交按钮
        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('执行替换')
                .setCta()
                .onClick(() => {
                    this.onSubmit(this.result);
                    this.close();
                }));
    }

    getFolders(): Set<string> {
        const folderSet = new Set<string>();
        folderSet.add("/");
        this.app.vault.getAllLoadedFiles().forEach(file => {
            if (file.parent && file.parent.path) {
                folderSet.add(file.parent.path);
            }
        });
        return folderSet;
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
