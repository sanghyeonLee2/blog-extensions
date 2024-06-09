document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("fetchContent");
  button.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ["./scripts/content.js"],
        },
        () => {
          // content.js 파일이 실행된 후, 현재 탭에 메시지를 보냅니다.
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "fetchBlogContent" },
            (response) => {
              console.log("Received response:", response); // 디버깅용 로그 추가
              if (response && response.predictions && response.probabilities) {
                const predictions = response.predictions;
                const probabilities = response.probabilities;

                const resultElement = document.getElementById("result"); // 결과를 표시할 요소의 ID
                const rateResultElement = document.getElementById("rateResult"); // 결과를 표시할 요소의 ID
                if (predictions[0] === 0) {
                  resultElement.textContent = "홍보성이 아닙니다";
                  rateResultElement.textContent =
                    "리뷰가 홍보성일 확률 : " +
                    probabilities[0][0].toFixed(1) +
                    "%";
                } else {
                  resultElement.textContent = "홍보성입니다";
                  rateResultElement.textContent =
                    "리뷰가 홍보성일 확률 : " +
                    (100 - probabilities[0][0].toFixed(1)) +
                    "%";
                }
              } else {
                console.error("Invalid response structure:", response);
              }
            }
          );
        }
      );
    });
  });
});
