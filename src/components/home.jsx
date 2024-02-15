import React from 'react';
import { doc, getDoc } from "firebase/firestore";
import '../App.css';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut  } from 'firebase/auth';

import { db } from '../firebase-config';
import CourseList from './courselist';
import TeacherView from './TeacherView';


const Home = () => {


  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);

useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, set the username
            setUid(user.uid)
           checkUser(user)
        } else {
            // User is signed out
           
        }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
}, []);

async function  checkUser(user){

const docRef = doc(db, "users", user.uid);
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
setRole( docSnap.data().role);
setUser(docSnap.data())


}
}
  return (
    <div className="home-page">

      {role === "Student" && <CourseList user={user} uid={uid}/>}
      {role === "Teacher" && <TeacherView user={user} uid={uid}/>}
  
    </div>
  );
};

export default Home;
