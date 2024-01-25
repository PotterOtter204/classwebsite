// CourseForm.js
import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { db } from '../firebase-config';

const CreateAssignment= () => {
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instruction, setInstruction] = useState('');
    const [tests, setTests] = useState('')
    const [startercode, setStarterCode] = useState('')




    const [username, setUsername] = useState(null);

    
  const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !tests || !description || !instruction) {
      alert('Please fill all the fields');
      return;
    }



    const courseRef = doc(db, 'assignmentsKEC', name);
    const moduleData = { description, instruction };

    try {
      await setDoc(courseRef, {
       
          description: description,
          instruction: instruction,
          tests: tests,
          startercode: startercode,
          teacher: username
        
      }, { merge: true });

      setDescription('');
      setInstruction('');
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, set the username
            setUsername(user.displayName || user.email); // Assuming the username is stored in 'displayName'
        } else {
            // User is signed out
            setUsername(null);
        }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
}, []);



  return (
    <form onSubmit={handleSubmit}>
    <div>
    {username ? `Hello, ${username}!` : 'Not signed in'} <br />
      <label htmlFor="module">Name:</label>
      <input type="text" id="name" className="full-width-input" value={name} onChange={(e) => setName(e.target.value)} />
    </div>
    <div>
      <label htmlFor="description">Description:</label>
      <input type="text" id="description" className="full-width-input" value={description} onChange={(e) => setDescription(e.target.value)} />
    </div>
    <div>
      <label htmlFor="instruction">Instruction:</label>
      <textarea id="instruction" className="full-width-input" value={instruction} onChange={(e) => setInstruction(e.target.value)} />
    </div>
    <div>
      <label htmlFor="tests">Tests:</label>
      <textarea id="tests" className="full-width-input" value={tests} onChange={(e) => setTests(e.target.value)} />
    </div>
    <div>
      <label htmlFor="startercode">startercode:</label>
      <textarea id="startercode" className="full-width-input" value={startercode} onChange={(e) => setStarterCode(e.target.value)} />
    </div>
    <button type="submit">Submit</button>
  </form>
  );
};

export default CreateAssignment;
