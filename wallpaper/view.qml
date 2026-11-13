import QtQuick
import QtWebEngine
WebEngineView {
    url: Qt.resolvedUrl("index.html")
    settings.localContentCanAccessRemoteUrls: false
    backgroundColor: "white"
    property bool pointerBridgeReady: false
    function updatePointer(x, y, active) {
        runJavaScript("typeof window.setOceanPointer === 'function' && (window.setOceanPointer(" + x + "," + y + "," + active + "), true)", function(ok) {
            if (ok && !pointerBridgeReady) { pointerBridgeReady = true; console.log("Ocean cursor bridge ready") }
        })
    }
    onLoadingChanged: function(request) {
        if (request.status === WebEngineLoadingInfo.LoadFailedStatus) console.error("Ocean failed:", request.errorString)
        if (request.status === WebEngineLoadingInfo.LoadSucceededStatus) console.log("Ocean ready")
    }
}
