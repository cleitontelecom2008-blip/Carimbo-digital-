// MODO MANUTENÇÃO — substitui o sw.js antigo
const CACHE_NAME = 'carimbo-manutencao-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting(); // ativa na hora, sem esperar fechar o app
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(['./manutencao.html']))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim()) // assume as abas abertas
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(c => c.navigate(c.url))) // recarrega quem está com o app aberto
  );
});

// Toda navegação mostra a página de manutenção
self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(caches.match('./manutencao.html'));
  }
});
