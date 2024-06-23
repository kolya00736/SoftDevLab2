var GHPATH = '/SoftDevLab2';
var APP_PREFIX = 'password-manager-cache-';
var VERSION = 'v1';

var URLS = [    
	`${GHPATH}/`,
	`${GHPATH}/index.html`,
	`${GHPATH}/favicon.png`,
	'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css'
]

var CACHE_NAME = APP_PREFIX + VERSION
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(function (request) {
			if (request) {
				return request;
			}
			return fetch(event.request);
		})
	)
})

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(URLS);
		})
	)
})

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(function (keyList) {
			var cacheWhitelist = keyList.filter(function (key) {
				return key.indexOf(APP_PREFIX)
			});
			cacheWhitelist.push(CACHE_NAME);
			
			return Promise.all(keyList.map(function (key, i) {
				if (cacheWhitelist.indexOf(key) === -1) {
					return caches.delete(keyList[i])
				}
			}));
		})
	)
})