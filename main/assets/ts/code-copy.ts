import * as params from '@params';

/**
 * 项目级覆盖（上游对应文件：hugo-theme-stack v4.0.3 assets/ts/code-copy.ts）
 *
 * 相对上游只有两处定制，来自原 fork 的 assets/ts/main.ts：
 *   1. 按钮显示语言名，即「复制 bash」而不是「复制」；
 *   2. 复制成功后 1 秒，恢复成「复制 bash」而不是「复制」。
 * 其余（剪贴板可用性守卫、文案本地化、失败提示）沿用上游实现。
 * 升级主题时请比对上游同名文件是否有修复需要同步。
 */
export function setupCodeCopy() {
    /**
     * Add copy button to code block
    */
    const highlights = document.querySelectorAll('.article-content div.highlight');
    const copyText = params.codeblock.copy,
        copiedText = params.codeblock.copied;

    if (!navigator.clipboard) {
        /// Clipboard API is only supported in secure contexts (HTTPS)
        console.warn('Clipboard API not supported, copy button will not work.');
        return;
    }

    highlights.forEach(highlight => {
        const copyButton = document.createElement('button');
        copyButton.classList.add('copyCodeButton');
        highlight.appendChild(copyButton);

        const codeBlock = highlight.querySelector('code[data-lang]');
        if (!codeBlock) {
            copyButton.textContent = copyText;
            return;
        }

        const lang = codeBlock.getAttribute('data-lang') || 'text';
        const buttonLabel = `${copyText} ${lang}`;
        copyButton.textContent = buttonLabel;

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(codeBlock.textContent)
                .then(() => {
                    copyButton.textContent = copiedText;

                    setTimeout(() => {
                        copyButton.textContent = buttonLabel;
                    }, 1000);
                })
                .catch(err => {
                    alert(err)
                    console.log('Something went wrong', err);
                });
        });
    });
};