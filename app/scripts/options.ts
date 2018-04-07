// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

interface HTMLElementEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

const colorList: HTMLElement | null = document.getElementById('color-list');
if (colorList != null) {
    colorList.addEventListener('click', (e: HTMLElementEvent) => {
        let color = e.target.className;

        if (color.startsWith('kawaguchi-garbage-calendar-')) {
            chrome.storage.sync.set({
                'backgroundColor': color
            }, () => {
                const status = document.getElementById('status');
                if (status != null) {
                    // メッセージを表示
                    status.textContent = '保存しました';
                    setTimeout(function () {
                        status.textContent = '';
                    }, 750);
                }

                // ゴミカレンダーを開いていたら背景色を変える
                chrome.tabs.query({ url: 'http://kawaguchi-gomimaru.jp/calendar/*' }, (tabs) => {
                    for (let index = 0; index < tabs.length; index++) {
                        const tab = tabs[index];
                        if (tab.id !== undefined) {
                            chrome.tabs.sendMessage(tab.id, { action: 'backgroundColorChanged' }, () => { });
                        }
                    }
                });
            });
        }
    });
}