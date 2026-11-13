import QtQuick
import QtWebEngine
WebEngineView {
    url: Qt.resolvedUrl("index.html")
    settings.localContentCanAccessRemoteUrls: false
    backgroundColor: "white"
    onLoadingChanged: function(request) {
        if (request.status === WebEngineLoadingInfo.LoadFailedStatus) console.error("Ocean failed:", request.errorString)
        if (request.status === WebEngineLoadingInfo.LoadSucceededStatus) console.log("Ocean ready")
    }
}
