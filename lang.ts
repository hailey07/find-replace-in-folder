// lang.ts

import { moment } from 'obsidian';

export interface LocalizedStrings {
    ribbonTooltip: string;
    commandName: string;

    modalTitle: string;
    folderSettingName: string;
    folderSettingDesc: string;
    findSettingName: string;
    findSettingPlaceholder: string;
    replaceSettingName: string;
    replaceSettingPlaceholder: string;
    caseSensitiveName: string;
    caseSensitiveDesc: string;
    useRegexName: string;
    useRegexDesc: string;
    submitButtonText: string;

    errorFindInputEmpty: string;
    infoStarting: string;
    errorInvalidRegex: (error: string) => string;
    infoNoFilesFound: (folder: string) => string;
    successResults: (count: number, folder: string) => string;
}

const translations: Record<string, Partial<LocalizedStrings>> = {
    // 英文 (默认)
    en: {
        ribbonTooltip: 'Batch Find and Replace',
        commandName: 'Find and replace in folder',
        modalTitle: 'Batch Find and Replace',
        folderSettingName: 'Select Folder',
        folderSettingDesc: 'Choose the target folder for the operation.',
        findSettingName: 'Find',
        findSettingPlaceholder: 'Enter text to find...',
        replaceSettingName: 'Replace with',
        replaceSettingPlaceholder: 'Enter text to replace...',
        caseSensitiveName: 'Case sensitive',
        caseSensitiveDesc: 'If enabled, "Apple" and "apple" will be treated as different words.',
        useRegexName: 'Use regular expression',
        useRegexDesc: 'If enabled, the find input will be treated as a regular expression.',
        submitButtonText: 'Execute Replace',
        errorFindInputEmpty: 'Find input cannot be empty!',
        infoStarting: 'Starting batch replacement...',
        errorInvalidRegex: (error) => `Invalid regular expression: ${error}`,
        infoNoFilesFound: (folder) => `No Markdown files found in folder "${folder}".`,
        successResults: (count, folder) => `Operation complete! ${count} files were modified in ${folder}.`,
    },
    // 中文
    zh: {
        ribbonTooltip: '批量查找替换',
        commandName: '对文件夹进行批量查找替换',
        modalTitle: '批量查找和替换',
        folderSettingName: '选择文件夹',
        folderSettingDesc: '选择要进行操作的目标文件夹。',
        findSettingName: '查找内容',
        findSettingPlaceholder: '输入要查找的文本...',
        replaceSettingName: '替换为',
        replaceSettingPlaceholder: '输入要替换的文本...',
        caseSensitiveName: '区分大小写',
        caseSensitiveDesc: '开启后，"Apple" 和 "apple" 将被视为不同的词。',
        useRegexName: '使用正则表达式',
        useRegexDesc: '开启后，查找内容将被作为正则表达式进行匹配。',
        submitButtonText: '执行替换',
        errorFindInputEmpty: '查找内容不能为空！',
        infoStarting: '正在开始批量替换...',
        errorInvalidRegex: (error) => `无效的正则表达式: ${error}`,
        infoNoFilesFound: (folder) => `在文件夹 "${folder}" 中未找到任何 Markdown 文件。`,
        successResults: (count, folder) => `操作完成！在 ${folder} 中，共修改了 ${count} 个文件。`,
    },
};

// ================== 【最终修复逻辑】 ==================
export function getLocaleStrings(): LocalizedStrings {
    const lang = moment.locale(); // e.g., 'en', 'zh', 'zh-cn'

    // 1. 尝试完全匹配 (e.g., 'zh-cn')
    // 2. 如果失败，尝试匹配主要语言 (e.g., 'zh')
    // 3. 如果还失败，回退到英文 'en'
    const langStrings = translations[lang] || translations[lang.split('-')[0]] || translations['en'];
    
    // 返回一个完整的对象，用英文作为备用，防止部分翻译缺失
    return { ...translations.en, ...langStrings } as LocalizedStrings;
}
