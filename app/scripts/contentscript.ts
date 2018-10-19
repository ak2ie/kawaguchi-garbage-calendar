// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly';

import { GarbageCalendar } from './GarbageCalendar';
import * as toastr from 'toastr';

/*
 * ------------------------------------------
 *   メイン処理
 * ------------------------------------------
 */
let contentScripts = new GarbageCalendar();
try {
    contentScripts.highlightToday();
} catch (e) {
    console.error(e);
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    switch (request.action) {
        case 'backgroundColorChanged':
            // オプションで背景色が変更されたときに即時反映する
            console.log('背景色を変更します');
            await contentScripts.highlightToday();
            break;

        default:
            break;
    }
});

/*
 * ------------------------------------------
 *   機能紹介
 * ------------------------------------------
 */
function notifyFeature() {
    const message: { [key: string]: string } = {
        '0.1.1': 'カレンダーの背景色を変更できるようになりました。詳しくは<a href="#" id="open-option-page" style="text-decoration: underline;">設定ページ</a>をご覧ください。',
        '0.1.3': 'カレンダーが強調表示されない場合がある問題を修正しました。'
    };

    toastr.options.closeButton = true;
    toastr.options.positionClass = 'toast-bottom-right';
    toastr.options.showDuration = 300;
    toastr.options.hideDuration = 5000;
    toastr.options.timeOut = 5000;
    toastr.options.extendedTimeOut = 2000;
    toastr.options.showEasing = 'swing';
    toastr.options.hideEasing = 'linear';
    toastr.options.showMethod = 'fadeIn';
    toastr.options.hideMethod = 'fadeOut';

    const manifest = chrome.runtime.getManifest();
    if (message[manifest.version] !== undefined) {
        toastr.info(message[manifest.version], '川口ゴミカレンダー便利ツール');
    }

    // 拡張機能のオプションを開く設定
    const openOptionLink = document.getElementById('open-option-page');
    if (openOptionLink !== null) {
        openOptionLink.addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: 'openOptionPage' }, function (response) {
            });
        });
    }
}

chrome.storage.sync.get('isFirstShow', (result) => {
    const manifest = chrome.runtime.getManifest();
    const currentVersion = manifest.version;

    if (result !== undefined) {
        if (!('isFirstShow' in result) || result['isFirstShow'][currentVersion] === true) {
            notifyFeature();

            // 機能紹介を表示済であることを記録
            chrome.storage.sync.set({ isFirstShow: { [currentVersion]: false } }, () => { });
        }
    }
});