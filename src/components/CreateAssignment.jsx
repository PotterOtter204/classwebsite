// CourseForm.js
import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link,useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { v4 as uuidv4 } from 'uuid';
import "./createAssignment.css"
import { db } from '../firebase-config';
import dayjs from 'dayjs';
import { updateAssignments } from '../services/upDateAssignments';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const CreateAssignment= () => {
  
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
    const [language, setLanguage] = useState("python");

    const[ testInstructions, setTestInstruction] = useState("Tests should exit with code 0 only when all tests pass")


  const handleChange = (event) => {
    setAssignTo(event.target.value);
  };
const handleLanguageChange = (event) =>{
  setLanguage(event.target.value)

  if(event.target.value==="python"){
    setTestInstruction("Tests should exit with code 0 only when all tests pass")
    setTests('from user_code import *')
  }
  if(event.target.value==="java"){
    setTestInstruction("Tests should exit with code 0 only when all tests pass, import any functions necessary from UserSolution.java")
    setStarterCode(`
    public class UserSolution {
      public static void main(String[] args) {
            
      }
      
  }
    `)

    setTests(
      `public class TestSolution {
        public static void main(String[] args) {
            
        }      
    }
      `
    )
  
  }

  
}
    useEffect(() => {
      const savedAssignment = localStorage.getItem('assignment');
    if (savedAssignment) {
      
      const assignmentData = JSON.parse(savedAssignment);

      if(assignmentData.name !== ''){
        console.log(assignmentData.name)
        setName(assignmentData.name || '');
        setDescription(assignmentData.description || '');
        setInstruction(assignmentData.instruction || '');
        setTests(assignmentData.tests || 'from user_code import *');
        setStarterCode(assignmentData.startercode || '');
        setUsername(assignmentData.username || "");
        setAssignTo(assignmentData.assignTo || '');
        setLanguage(assignmentData.language || "python");
        setDate(dayjs(assignmentData.date));
        setClassList(assignmentData.classList)

      }
     
      // Add any other state variables you wish to restore
    }else{
      console.log("not saved")
      if (location.state) {
        
        console.log(location.state.classes)
        setClassList(location.state.classes);
        setUsername(location.state.userName)
      } else {
        console.log('No state');
      }
    }
      
      
    }, [location]);

    useEffect(() => {
      const assignmentData = {
        name,
        description,
        instruction,
        tests,
        startercode,
        username,
        assignTo,
        language,
        date,
        classList
        // Add any other state variables you wish to save
      };
      localStorage.setItem('assignment', JSON.stringify(assignmentData));
    }, [name, description, instruction, tests, startercode, username, assignTo, language, date,classList]);
  
    function clearAssignment(){
      localStorage.removeItem('assignment');
      navigate("/");
    }
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !tests || !name || !instruction) {
      alert('Please fill all the fields');
      return;
    }


    localStorage.removeItem('assignment');
    const courseRef = doc(db, 'assignmentsKEC', name);
    

    const uniqueId = uuidv4();

 
 
    const newAssignment = {
       
      description: name,
      instruction: instruction,
      tests: tests,
      startercode: startercode,
      teacher: username,
      uniqueID: uniqueId,
      completed: false,
      studentWork: "",
      feedback: "",
      language: language,
      date: date
    
  }
  console.log(newAssignment)
  if (assignTo !== ''){
    console.log(assignTo)
    updateAssignments(assignTo, newAssignment)
  }
    try {
      await setDoc(courseRef, newAssignment, { merge: true });

      setDescription('');
      setInstruction('');
      alert('Data saved successfully!');

      navigate("/")
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const tryOut =  () => {
    if ( !tests || !name || !instruction) {
      alert('Please fill all the fields');
      return;
    }


console.log(name)
    const courseRef = doc(db, 'assignmentsKEC', name);
    

    const uniqueId = uuidv4();

 
 
    const newAssignment = {
       
      description: name,
      instruction: instruction,
      tests: tests,
      startercode: startercode,
      teacher: username,
      uniqueID: uniqueId,
      completed: false,
      studentWork: "",
      feedback: "",
      language: language,
      date: date
    
  }
  console.log(newAssignment)
  
    navigate("/assignment", { state: { assignment: newAssignment, uid: 9} }); 
   
    }
    useEffect(() => {
      console.log(name); // This should log after the state is set
    }, [name]);

  return (
    <div>
      <Button onClick={clearAssignment}>clear assignment</Button>
    <form onSubmit={handleSubmit}>
    <div sx={{marginBottom: "10px"}}>
    {username ? `Hello, ${username}!` : 'Not signed in'} <br />
      <label htmlFor="module">Assignment Name:</label>
      <input type="text" id="name" className="full-width-input" value={name} onChange={(e) => setName(e.target.value)} />
    </div>
    <label >Due date:</label><br/>
    <DatePicker
          sx={{marginTop: "5px"}}
          value={date}
          onChange={(newValue) => setDate(newValue)}
        />
    <Box sx={{ minWidth: 120, marginTop: "10px" }}>
    <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">Class to Assign to</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={assignTo}
    label="Class"
    onChange={handleChange}
  >
    {classList.map(function(data) {
      return (
       
          <MenuItem key={data.className} value={data.classCode}>{data.className}</MenuItem>
       
      )
    })}
  </Select></FormControl></Box>
  <Box sx={{ minWidth: 120, marginTop: "10px" }}>
    <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">Language</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={language}
    label="Class"
    onChange={handleLanguageChange}
  >
 
       
          <MenuItem key={1} value={"python"}>python</MenuItem>
          <MenuItem key={1} value={"java"}>java</MenuItem>
       
      
  </Select></FormControl></Box>
  
    <div>
      <label htmlFor="instruction">Instruction:</label>
      <textarea id="instruction" className="full-width-input" value={instruction} onChange={(e) => setInstruction(e.target.value)} />
    </div>
    <div>
      <label htmlFor="tests">Tests:</label>
      <div>{testInstructions}</div>
      <textarea id="tests" className="full-width-input" value={tests} onChange={(e) => setTests(e.target.value)} />
    </div>
    <div>
      <label htmlFor="startercode">startercode:</label>
      <textarea id="startercode" className="full-width-input" value={startercode} onChange={(e) => setStarterCode(e.target.value)} />
    </div>
    <Button type="submit"  >Submit</Button>
    
    
  </form>

`<Button variant='contained' color="success"  onClick={tryOut}>Try it out</Button>

</div>
  );
};

export default CreateAssignment;
