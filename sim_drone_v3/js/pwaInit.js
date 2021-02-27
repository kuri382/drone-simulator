// Detects if device is on iOS 
const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test( userAgent );
}
// Detects if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// Checks if should display install popup notification:
if (isIos() && !isInStandaloneMode()) {
    this.setState({ showInstallMessage: true });
    alert("ホーム画面に追加することで，アプリになります");
}

// manifestのlinkタグを生成
function setManifest(path) {
    const manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = path;
    document.head.appendChild(manifest);
}

// OSに応じて読み込むmanifestを変更
var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf("iphone") > 0 || userAgent.indexOf("ipad") > 0) {
    setManifest('manifest_ios.json')
} else {
    setManifest('manifest.json')
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service_worker.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
    });
}''