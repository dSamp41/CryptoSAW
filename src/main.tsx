import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { getAuth } from 'firebase/auth'
import { arrayRemove, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebaseConf.ts'
import { NotifEvent} from './components/cryptoUtil.ts';

import './index.css'


if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register("../serviceWorker.js")
    .then((registration) => {
      console.log("Service worker successfully registered: ", registration ); 
      console.log(`Scope: ${registration.scope}`)})
    .catch((err) => console.error("Service worker failed to install: ", err));
}



//OFFLINE HANDLING
window.addEventListener("online",  () => {console.log("You are online!")});
window.addEventListener("offline", () => {
  console.log("Oh no, you lost your network connection.");
  navigator.serviceWorker.controller?.postMessage({type: 'OFFLINE'})
});




//NOTIFICATION HANDLING
if(!("Notification" in window)){
    alert("This browser does not support desktop notification");
}
else{
    Notification.requestPermission()
      .then( (permission) => {
        if (permission !== 'granted') console.error("Permission was not granted.")
      })
      .catch( (error) => console.log(error));
}


export function sendNotification(message: string) {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } 
    else if (Notification.permission === "granted") {
        navigator.serviceWorker.ready
          .then( (registration) => {registration.showNotification(message, {vibrate: [200, 100, 200]})})
          .catch( (error) => console.log(error));
    } 
    else if (Notification.permission !== "denied") {
        Notification.requestPermission()
            .then((permission) => {
                // If the user accepts, create a notification
                if (permission === "granted") {
                    navigator.serviceWorker.ready
                    .then((registration) => {registration.showNotification(message, {vibrate: [200, 100, 200]})})
                    .catch((err) => console.error(err));
                }
            })
            .catch((err) => console.error(err));
    }
  
    // if user has denied notifications, no need to bother them.
}


//PERIODIC BACKGROUND SYNC
async function checkNotificationEvent(){
  //get notifEvent from db;
  const user = getAuth().currentUser;
  
  if(!user) return;
  const docRef = doc(db, 'users', user.uid)
  const docSnap = await getDoc(docRef)

  if(!docSnap.exists()) return;
  
  const notifEvents: NotifEvent[] = docSnap.data().notificationEvents as NotifEvent[];

  for(const el of notifEvents){
    const {asset, direction, value} = el;
    fetch(`https://api.coincap.io/v2/assets/${asset}`)
      .then((resp) => resp.json())
      .then((json) => {
        const jsonData = json.data;
        const actualPrice = parseFloat(jsonData.priceUsd);

        //check if one event is verified; delete if it is
        const underPriceCond: boolean = (direction === 'Under') && (actualPrice < value);
        const overPriceCond: boolean = (direction === 'Over') && (actualPrice > value);

        if(underPriceCond || overPriceCond){
          sendNotification(`${asset} is ${direction.toLowerCase()} ${value}$!!`);
          updateDoc(docRef, {notificationEvents: arrayRemove(el)});
        }
      })
      .catch((err) => console.log(err))
  }
  
  return;
}

const mins_millis = 60 * 1000; 
setTimeout(checkNotificationEvent, 3 * mins_millis);



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)