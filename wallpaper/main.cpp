#include <QGuiApplication>
#include <QQuickView>
#include <QtWebEngineQuick/QtWebEngineQuick>
#include <LayerShellQt/Window>
#include <QFileSystemWatcher>
#include <QFileInfo>
#include <QDir>
#include <QTimer>
#include <QDebug>
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
 QFileSystemWatcher watcher;
 watcher.addPath(dir);
 QObject::connect(&watcher, &QFileSystemWatcher::directoryChanged, &app, [&](const QString &) { update(); });
 QTimer::singleShot(0, &app, update);
 return app.exec();
}
