// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'openOptionPage':
      // 拡張機能のオプションを開く（Content Scriptから叩けなかった）
      chrome.runtime.openOptionsPage(() => {});
    break;
  }
});