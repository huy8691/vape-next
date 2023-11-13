/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
)

// Initialize the Firebase app in the service worker by passing the generated config
firebase.initializeApp({
  apiKey: 'AIzaSyA1p1rArL25-bPR1cgHZh_bogayUE6tBTU',
  authDomain: 'twss-manager-app.firebaseapp.com',
  projectId: 'twss-manager-app',
  storageBucket: 'twss-manager-app.appspot.com',
  messagingSenderId: '555500415268',
  appId: '1:555500415268:web:bf92816633710cfdd8abb1',
  measurementId: 'G-C83H2YD2VN',
})

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message', payload)

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js', { scope: './' })
      .then(function (registration) {
        console.log('Service Worker Registered')
        setTimeout(() => {
          registration.showNotification(payload.data.title, {
            body: payload.data.body,
            data: payload.data.link,
          })
          registration.update()
        }, 100)
      })
      .catch(function (err) {
        console.log('Service Worker Failed to Register', err)
      })
  }
})
