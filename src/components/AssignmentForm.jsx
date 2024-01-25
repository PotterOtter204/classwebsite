// CourseForm.js
import React, { useState } from 'react';
import { collection, doc, setDoc, arrayUnion } from 'firebase/firestore';

import { db } from '../firebase-config';

const AssignmentForm = () => {
  const [course, setCourse] = useState('');
  const [module, setModule] = useState('');
  const [description, setDescription] = useState('');
  const [instruction, setInstruction] = useState('');
    const [next, setNext] = useState('')
    const [startercode, setStarterCode] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course || !module || !description || !instruction) {
      alert('Please fill all the fields');
      return;
    }

    const courseRef = doc(db, 'assignments', course);
    const moduleData = { description, instruction };

    try {
      await setDoc(courseRef, {
        [module]: {
          description: description,
          instruction: instruction,
          next: next,
          startercode: startercode
        }
      }, { merge: true });

      setDescription('');
      setInstruction('');
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
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
      <label htmlFor="next">next:</label>
      <textarea id="next" className="full-width-input" value={next} onChange={(e) => setNext(e.target.value)} />
    </div>
    <div>
      <label htmlFor="startercode">startercode:</label>
      <textarea id="startercode" className="full-width-input" value={startercode} onChange={(e) => setStarterCode(e.target.value)} />
    </div>
    <button type="submit">Submit</button>
  </form>
  );
};

export default AssignmentForm;
