// Service Worker for 手搖飲日記
const CACHE_NAME = "drink-diary-v1";
const urlsToCache = [
  "/",
  "/index.html",
];

// 安裝 Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// 攔截請求，提供快取或網路回應
self.addEventListener("fetch", (event) => {
  // 只快取 GET 請求
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果有快取，返回快取
      if (response) {
        return response;
      }

      // 否則從網路獲取
      return fetch(event.request)
        .then((response) => {
          // 檢查回應是否有效
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          // 複製回應以進行快取
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // 網路失敗時，如果是導航請求，返回快取的 index.html
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});

// 清理舊的快取
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
