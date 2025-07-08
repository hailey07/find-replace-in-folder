import { App, Modal, Setting } from 'obsidian';
import { LocalizedStrings } from './lang'; // 导入翻译接口

interface FindReplaceResult {
    folder: string;
    find: string;
    replace: string;
    caseSensitive: boolean;
    useRegex: boolean;
}

export class FindReplaceModal extends Modal {
    private result: FindReplaceResult = {
        folder: '',
        find: '',
        replace: '',
        caseSensitive: true,
        useRegex: false,
    };

    private t: LocalizedStrings; // 用于存储翻译
    private onSubmit: (result: FindReplaceResult) => void;

    // 修改构造函数，接收翻译对象 t
    constructor(app: App, t: LocalizedStrings, onSubmit: (result: FindReplaceResult) => void) {
        super(app);
        this.t = t;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        // 使用翻译设置标题
        contentEl.createEl('h2', { text: this.t.modalTitle });

        const folders = this.getFolders();
        if (folders.size > 0) {
            this.result.folder = folders.values().next().value;
        }
        new Setting(contentEl)
            .setName(this.t.folderSettingName)
            .setDesc(this.t.folderSettingDesc)
            .addDropdown(dropdown => {
                folders.forEach(folder => {
                    dropdown.addOption(folder, folder);
                });
                dropdown.setValue(this.result.folder);
                dropdown.onChange(value => {
                    this.result.folder = value;
                });
            });

        new Setting(contentEl)
            .setName(this.t.findSettingName)
            .addText(text => text
                .setPlaceholder(this.t.findSettingPlaceholder)
                .setValue(this.result.find)
                .onChange(value => {
                    this.result.find = value;
                }));

        new Setting(contentEl)
            .setName(this.t.replaceSettingName)
            .addText(text => text
                .setPlaceholder(this.t.replaceSettingPlaceholder)
                .setValue(this.result.replace)
                .onChange(value => {
                    this.result.replace = value;
                }));

        new Setting(contentEl)
            .setName(this.t.caseSensitiveName)
            .setDesc(this.t.caseSensitiveDesc)
            .addToggle(toggle => toggle
                .setValue(this.result.caseSensitive)
                .onChange(value => {
                    this.result.caseSensitive = value;
                }));

        new Setting(contentEl)
            .setName(this.t.useRegexName)
            .setDesc(this.t.useRegexDesc)
            .addToggle(toggle => toggle
                .setValue(this.result.useRegex)
                .onChange(value => {
                    this.result.useRegex = value;
                }));

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText(this.t.submitButtonText)
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
