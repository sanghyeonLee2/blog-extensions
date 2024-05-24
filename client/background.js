chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
    // 컨텍스트 메뉴 아이템 생성
    chrome.contextMenus.create({
        id: 'fetchPageTitle',
        title: 'Fetch Page Title',
        contexts: ['link'],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log(info)
    if (info.menuItemId === 'fetchPageTitle') {
        fetch(info.linkUrl)
            .then(response => response.text())
            .then(html => {
                console.log(html)
                const matches = html.match(/<title>(.*?)<\/title>/);
                const title = matches && matches[1] ? matches[1] : "Title not found";
                console.log(title); // 콘솔에 타이틀을 출력합니다.
                // 여기에서 더 많은 동작을 추가할 수 있습니다. 예를 들어, 결과를 탭에 메시지로 보낼 수 있습니다.
            })
            .catch(error => console.error('Error fetching the page:', error));
    }
});
