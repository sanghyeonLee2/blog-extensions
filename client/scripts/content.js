chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'modifyDOM') {
        // 여기에 DOM을 수정하는 코드를 작성합니다.
        console.log('DOM을 수정합니다.');
    }
});