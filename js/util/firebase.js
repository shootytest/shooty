import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDPDdw78hG6FDQd-JGddqDet7KJ6bqk3po",
  authDomain: "shoot-y.firebaseapp.com",
  databaseURL: "https://shoot-y-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shoot-y",
  storageBucket: "shoot-y.appspot.com",
  messagingSenderId: "324241652647",
  appId: "1:324241652647:web:b5bc2fda02d7124125d482",
  measurementId: "G-NXPTLLM8MD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();

export const firebase = {};

firebase.listen = function(path, listener) {
  onValue(ref(db, path), (snapshot) => {
    listener(snapshot.val());
  });
}

firebase.get = function(path, getter_function) {
  onValue(ref(db, path), (snapshot) => {
    getter_function(snapshot.val());
  }, {
    onlyOnce: true,
  });
}

firebase.set = function(path, value) {
  set(ref(db, path), value);
}

firebase.update = function(updates) {
  update(ref(db), updates);
}