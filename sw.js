self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      if (cs.length > 0) return cs[0].focus();
      return clients.openWindow('./health-companion.html');
    })
  );
});

self.addEventListener('message', e => {
  if (!e.data || e.data.type !== 'SCHEDULE_ALL') return;
  e.data.list.forEach(item => {
    if (item.delay > 0) {
      setTimeout(() => {
        self.registration.showNotification(item.title, {
          body: item.body,
          icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22><text y=%2252%22 font-size=%2252%22>🌿</text></svg>',
          tag: item.id, renotify: true, vibrate: [200, 100, 200], requireInteraction: false
        });
      }, item.delay);
    }
  });
});
