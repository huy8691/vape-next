import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import { doAddDeviceToken } from 'pages/_common/setting/notification-configuration/apiNotificationConfig'

const firebaseConfig = {
  apiKey: 'AIzaSyA1p1rArL25-bPR1cgHZh_bogayUE6tBTU',
  authDomain: 'twss-manager-app.firebaseapp.com',
  projectId: 'twss-manager-app',
  storageBucket: 'twss-manager-app.appspot.com',
  messagingSenderId: '555500415268',
  appId: '1:555500415268:web:bf92816633710cfdd8abb1',
  measurementId: 'G-C83H2YD2VN',
}

export const firebaseApp = initializeApp(firebaseConfig)
// const messaging = getMessaging(firebaseApp)

export const fetchToken = () => {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      getToken(getMessaging(firebaseApp), {
        vapidKey:
          'BCNycPBjv4i9gtHc6oqSsEWuw35MmnocjAHqSUuddKaexMopvZOfrxuDlyeJHwlUK7hnvGdkrakp8_IKZjsT-X0',
      })
        .then((currentToken) => {
          if (currentToken) {
            localStorage.setItem('token-device', currentToken)
            doAddDeviceToken(currentToken).catch(() => {
              console.log('An error occurred while retrieving token.')
            })
          }
        })
        .catch((err) => {
          console.log('An error occurred while retrieving token. ', err)
        })
    }
  })
}
