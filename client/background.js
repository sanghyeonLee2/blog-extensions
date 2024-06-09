// 확장 프로그램이 설치될 때 실행되는 코드
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  setupContextMenu();
});

// 컨텍스트 메뉴 설정 함수
function setupContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "fetchPageTitle",
      title: "홍보성 체크",
      contexts: ["link"],
    });
  });
}

// 컨텍스트 메뉴 클릭 이벤트 리스너
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "fetchPageTitle") {
    executeFetchPageTitleScript(tab.id, info.linkUrl);
  }
});

// 스크립트 실행 및 메시지 보내는 함수
async function executeFetchPageTitleScript(tabId, linkUrl) {
  try {
    await executeScriptAsync({
      target: { tabId: tabId },
      files: ["./scripts/content.js"],
    });

    const response = await sendMessageAsync(tabId, {
      action: "fetchPageTitle",
      url: linkUrl,
    });
    console.log("Page title:", response);
  } catch (error) {
    console.error(error);
  }
}

// chrome.scripting.executeScript를 Promise로 래핑한 함수
function executeScriptAsync(details) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(details, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        resolve();
      }
    });
  });
}

// chrome.tabs.sendMessage를 Promise로 래핑한 함수
function sendMessageAsync(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        resolve(response);
      }
    });
  });
}
