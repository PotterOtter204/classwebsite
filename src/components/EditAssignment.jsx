// CourseForm.js
import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link,useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { v4 as uuidv4 } from 'uuid';
import "./createAssignment.css"
import { db } from '../firebase-config';
import { updateAssignments } from '../services/upDateAssignments';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from 'dayjs';


const EditAssignment= () => {
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instruction, setInstruction] = useState('');
    const [tests, setTests] = useState('from user_code import *')
    const [startercode, setStarterCode] = useState('')
const [username ,setUsername] = useState("")
const [date, setDate] = useState(dayjs('2024-02-01'));

    const [classList, setClassList] = useState([])
    const location = useLocation();
    const navigate = useNavigate();
    const [assignTo, setAssignTo] = useState('');
    const { assignment, classId} = location.state || {};

  const handleChange = (event) => {
    setAssignTo(event.target.value);
  };

    useEffect(() => {
      
      if (location.state) {       
       setName(assignment.description)
        setInstruction(assignment.instruction)
        setTests(assignment.tests)
        setStarterCode(assignment.startercode)

      } else {
        console.log('No state');
      }
    }, [assignment]);

    
  const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !tests || !name || !instruction) {
      alert('Please fill all the fields');
      return;
    }


    const newAssignment = {
       
      description: name,
      instruction: instruction,
      tests: tests,
      startercode: startercode,
      teacher: assignment.teacher,
      uniqueID: assignment.uniqueID,
      completed: assignment.completed,
      studentWork: "",
      feedback: "",
      language: assignment.language,
    
  }
  console.log(newAssignment)

    try {
      
        updateAssignments(classId,newAssignment)
      navigate("/")
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

 



  return (
    <form onSubmit={handleSubmit}>
    <div sx={{marginBottom: "10px"}}>
    {username ? `Hello, ${username}!` : 'Not signed in'} <br />
      <label htmlFor="module">Assignment Name:</label>
      <input type="text" id="name" className="full-width-input" value={name} onChange={(e) => setName(e.target.value)} />
    </div>
    
    <Box sx={{ minWidth: 120, marginTop: "10px" }}>
    <FormControl fullWidth>
</FormControl></Box>
  
    <div>
      <label htmlFor="instruction">Instruction:</label>
      <textarea id="instruction" className="full-width-input" value={instruction} onChange={(e) => setInstruction(e.target.value)} />
    </div>
    <div>
      <label htmlFor="tests">Tests:</label>
      <div>Tests should exit with code 0 only when all tests pass</div>
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

export default EditAssignment;
