import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getDatabase, ref, set, onValue, update, increment } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
  return onValue(ref(db, path), (snapshot) => {
    listener(snapshot.val());
  });
}

firebase.get = function(path, getter_function) {
  return onValue(ref(db, path), (snapshot) => {
    getter_function(snapshot.val());
  }, {
    onlyOnce: true,
  });
}

// not a ti-basic reference
firebase.getkey = function(path, getter_function) {
  return onValue(ref(db, path), (snapshot) => {
    // there must be a more efficient way to do this
    getter_function(Object.keys(snapshot.val()));
  }, {
    onlyOnce: true,
  });
}

firebase.set = function(path, value) {
  return set(ref(db, path), value);
}

firebase.update = function(updates) {
  return update(ref(db), updates);
}

firebase.increment = function(path, number = 1) {
  return set(ref(db, path), increment(number));
}