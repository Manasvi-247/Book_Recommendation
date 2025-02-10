import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {  signOut   } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
window.logout = logout;

const firebaseConfig = {
  apiKey: "AIzaSyB50oHXItUqhtr6og2SyA-YjNJh3vquQKM",
  authDomain: "news-38eff.firebaseapp.com",
  projectId: "news-38eff",
  storageBucket: "news-38eff.firebasestorage.app",
  messagingSenderId: "248358233838",
  appId: "1:248358233838:web:32c2deec6f37057907f5ff"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html"
  }
});
function logout(){
  signOut(auth).then(() => {
      window.location.href = "login.html"
  }).catch((error) => {
        console.log("logout error")
      alert(error.message)
  // An error happened.

  });
}