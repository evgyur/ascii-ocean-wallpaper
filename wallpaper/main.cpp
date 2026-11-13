#include <QGuiApplication>
#include <QQuickView>
#include <QtWebEngineQuick/QtWebEngineQuick>
#include <LayerShellQt/Window>
#include <QFileSystemWatcher>
#include <QFileInfo>
#include <QDir>
#include <QTimer>
#include <QDebug>
#include <QQuickItem>
#include <QScreen>
#include <QLocalSocket>
#include <QJsonDocument>
#include <QJsonObject>
#include <memory>
int main(int argc, char **argv) {
 QtWebEngineQuick::initialize();
 QGuiApplication app(argc, argv);
 app.setQuitOnLastWindowClosed(false);
 const auto home = QDir::homePath();
 const auto dir = home + "/.local/state/omarchy/current";
 const auto selected = dir + "/background";
 const auto target = home + "/.config/omarchy/backgrounds/white/ascii-ocean-live.png";
 const auto qml = home + "/.local/share/ascii-ocean-wallpaper/view.qml";
 std::unique_ptr<QQuickView> view;
 auto update = [&]() {
  bool active = QFileInfo(selected).canonicalFilePath() == QFileInfo(target).canonicalFilePath() && QFileInfo(target).exists();
  if (!active) { if (view) { view.reset(); qInfo() << "Ocean stopped: background changed"; } return; }
  if (view) return;
  auto candidate = std::make_unique<QQuickView>();
  candidate->setFlags(Qt::FramelessWindowHint | Qt::WindowTransparentForInput | Qt::WindowDoesNotAcceptFocus);
  auto layer = LayerShellQt::Window::get(candidate.get());
  layer->setScope("ascii-ocean-wallpaper");
  layer->setLayer(LayerShellQt::Window::LayerBottom);
  layer->setAnchors(LayerShellQt::Window::Anchors(LayerShellQt::Window::AnchorTop) | LayerShellQt::Window::AnchorBottom | LayerShellQt::Window::AnchorLeft | LayerShellQt::Window::AnchorRight);
  layer->setExclusiveZone(-1);
  layer->setKeyboardInteractivity(LayerShellQt::Window::KeyboardInteractivityNone);
  candidate->setResizeMode(QQuickView::SizeRootObjectToView);
  candidate->setSource(QUrl::fromLocalFile(qml));
  if (candidate->status() == QQuickView::Error) { qCritical() << "Ocean view failed"; return; }
  candidate->show(); view = std::move(candidate);
  qInfo() << "Ocean started";
 };
 // The wallpaper is click-through. Read only cursor position from Hyprland IPC,
 // without intercepting pointer input or recording coordinates.
 QTimer cursorTimer;
 cursorTimer.setInterval(100);
 bool cursorRequestPending = false;
 QObject::connect(&cursorTimer, &QTimer::timeout, &app, [&]() {
  if (!view || cursorRequestPending) return;
  const auto runtime = qEnvironmentVariable("XDG_RUNTIME_DIR");
  const auto instance = qEnvironmentVariable("HYPRLAND_INSTANCE_SIGNATURE");
  if (runtime.isEmpty() || instance.isEmpty()) return;
  auto *socket = new QLocalSocket(&app);
  auto *response = new QByteArray;
  cursorRequestPending = true;
  QObject::connect(socket, &QLocalSocket::connected, socket, [socket]() { socket->write("j/cursorpos"); });
  QObject::connect(socket, &QLocalSocket::readyRead, socket, [socket, response]() { response->append(socket->readAll()); });
  auto finish = [&, socket, response]() {
   if (socket->property("finished").toBool()) return;
   socket->setProperty("finished", true);
   response->append(socket->readAll());
   const auto doc = QJsonDocument::fromJson(*response);
   if (view && doc.isObject() && doc.object().contains("x") && doc.object().contains("y")) {
    const auto point = QPoint(doc.object().value("x").toInt(), doc.object().value("y").toInt());
    const auto geometry = view->screen()->geometry();
    const auto local = point - geometry.topLeft();
    QMetaObject::invokeMethod(view->rootObject(), "updatePointer", Q_ARG(QVariant, local.x()), Q_ARG(QVariant, local.y()), Q_ARG(QVariant, geometry.contains(point)));
   } else if (view) {
    QMetaObject::invokeMethod(view->rootObject(), "updatePointer", Q_ARG(QVariant, 0), Q_ARG(QVariant, 0), Q_ARG(QVariant, false));
   }
   delete response;
   cursorRequestPending = false;
   socket->deleteLater();
  };
  QObject::connect(socket, &QLocalSocket::disconnected, socket, finish);
  QObject::connect(socket, &QLocalSocket::errorOccurred, socket, [socket, finish](QLocalSocket::LocalSocketError) {
   if (socket->state() == QLocalSocket::UnconnectedState) finish();
  });
  QTimer::singleShot(1000, socket, [socket]() { if (socket->state() != QLocalSocket::UnconnectedState) socket->abort(); });
  socket->connectToServer(runtime + "/hypr/" + instance + "/.socket.sock");
 });
 cursorTimer.start();
 QFileSystemWatcher watcher;
 watcher.addPath(dir);
 QObject::connect(&watcher, &QFileSystemWatcher::directoryChanged, &app, [&](const QString &) { update(); });
 QTimer::singleShot(0, &app, update);
 return app.exec();
}
