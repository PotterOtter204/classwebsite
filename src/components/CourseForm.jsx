// CourseForm.js
import React, { useState } from 'react';
import { collection, doc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import { db } from '../firebase-config';

const CourseForm = () => {
  const [course, setCourse] = useState('');
  const [module, setModule] = useState('');
  const [description, setDescription] = useState('');
  const [instruction, setInstruction] = useState('');
  const [index, setIndex] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course || !module || !description || !instruction) {
      alert('Please fill all the fields');
      return;
    }

    const courseRef = doc(db, 'courses', course);
    const moduleData = { description, instruction };
    if(index.length > 0){
        const newIndex = parseInt(index);

    try {
      // First, remove the old value at the index
      await setDoc(courseRef, {
        [module]: arrayRemove({ ...moduleData, index: newIndex }),
      }, { merge: true });

      // Then, add the new value with the updated index
      await setDoc(courseRef, {
        [module]: arrayUnion({ ...moduleData, index: newIndex }),
      }, { merge: true });

      setCourse('');
      setModule('');
      setDescription('');
      setInstruction('');
      setIndex(''); // Clear the index field
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }

    }else{
        try {
            await setDoc(courseRef, {
              [module]: arrayUnion(moduleData)
            }, { merge: true });
      
            setCourse('');
            setModule('');
            setDescription('');
            setInstruction('');
            alert('Data updated successfully!');
          } catch (error) {
            console.error('Error saving data:', error);
          }
    }
    
  };

  return (
    <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="course">Course:</label>
      <input type="text" id="course" className="full-width-input" value={course} onChange={(e) => setCourse(e.target.value)} />
    </div>
    <div>
      <label htmlFor="module">Module:</label>
      <input type="text" id="module" className="full-width-input" value={module} onChange={(e) => setModule(e.target.value)} />
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
        <label htmlFor="index">Index:</label>
        <input type="number" id="index" className="full-width-input" value={index} onChange={(e) => setIndex(e.target.value)} />
      </div>
    <button type="submit">Submit</button>
  </form>
  );
};

export default CourseForm;
