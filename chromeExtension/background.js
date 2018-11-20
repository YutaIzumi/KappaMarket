// main.htmlを新しいタブで開く
var showMainPage = function() {
    chrome.tabs.create({
      // url:'html/main.html'
      url:'http://kappaichiba.html.xdomain.jp/html/main.html'
    });
  };
   
  (function() {
    chrome.browserAction.onClicked.addListener(showMainPage);
  }) ();