import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button,Grid, IconButton, Tab, Tabs,CircularProgress } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AceEditor from 'react-ace';
import '../App.css'
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import { useLocation } from 'react-router-dom';
import Instruction from './instruction';
import { getAssignment } from '../services/getAssignment';
import SuccessPopup from './SuccessPopup';
import { useNavigate } from 'react-router-dom';
import { db } from "../firebase-config";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import ReactDOM from 'react-dom';

import Editor from '@monaco-editor/react';



export default function AssignmentView() {
    
    const [value, setValue] = useState("");
    const location = useLocation();
    const [socket, setSocket] = useState(null);
    const [output, setOutput] = useState(["Terminal"]);
    const [inputValue, setInputValue] = useState("");
    const [instruction, setInstruction] = useState("")
    const navigate = useNavigate()
    const inputRef = useRef(null);
  
    const [tabIndex, setTabIndex] = useState(0);
    const [feedback, setFeedback] = useState("")
    const [submitB, setSubmitB] = useState(true)
    const [beenRun, SetBeenRun] = useState(false)
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 5; // Maximum number of retries
    const initialRetryDelay = 1000; // Initial retry delay in ms (1 second)
    const retryMultiplier = 2; // Multiplier for exponential backoff
  
  const [isSocket, setIsSocket] = useState(false);

  const [testPassed, setTestPassed] = useState(false);
  const [message, setMessage] = useState("")
  
 

  const { assignment, uid} = location.state || {};



  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }
  useEffect(() => {
    
    if(!socket){
      setIsSocket(true)
    }

}, [socket])

  useEffect(() => {
    
      getPlan() 
    
  }, [assignment])

  async function updateUser(currentValue) {
    // Reference to the user's document
    const docRef = doc(db, "users", uid);
    console.log(currentValue)
  
    try {
      // Get the current document
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        // Extract assignments list
        const assignments = docSnap.data().assignments || [];
        // Find the index of the assignment to update
        const assignmentIndex = assignments.findIndex(ass => ass.uniqueID === assignment.uniqueID);
  
        if (assignmentIndex !== -1) {
          // Update the specific assignment
          assignments[assignmentIndex].completed = true;
          assignments[assignmentIndex].feedback = "All tests passed. Good Job!";
          assignments[assignmentIndex].studentWork = currentValue;

          console.log(assignments[assignmentIndex])
  
          // Prepare the update object
          const updateObject = {};
          updateObject[`assignments`] = assignments; // This updates the entire assignments array
  
          // Update the document with the modified assignments
          await updateDoc(docRef, updateObject);
          console.log("Assignment updated successfully.");
        } else {
          console.log("Assignment not found.");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  }

  async function getPlan(){
    
    
    console.log(assignment.language)
    setInstruction(assignment.instruction)

    if(assignment.completed){
      setFeedback(assignment.feedback)
      setTabIndex(1)
      if(assignment.studentWork.length !== 0){
        setValue(assignment.studentWork)
      }
      
    }else{
      setValue(assignment.startercode)
    }
    
  }
  
    const handleInputKeyPress = async (event) => {
      if (event.key === "Enter") {
        const newOutput = [...output, `> ${inputValue}`];
        setOutput(newOutput);
        setInputValue("")
     
        if (socket) {
          socket.send(JSON.stringify({ type: "userInput", data: { userInput: inputValue } }));
        }
      }
    };
  
    const handleSubmitPress = () =>{


      if (socket) {
        console.log("socket connection established")
  
        socket.send(JSON.stringify({ type: 'submit', data: { userCode: editorRef.current.getValue(), testCode:  assignment.tests, language: assignment.language } }));
      }else{
        setMessage("no server connection")
      }
    }
  
 
  
    
  
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };

    useEffect(() => {
      const connectWebSocket = () => {
        const ws = new WebSocket('wss://code-teacher-w3zznkfv6a-uc.a.run.app');
  
        ws.onopen = () => {
          console.log("WebSocket connection established");
          setSocket(ws);
          setRetryCount(0); // Reset retry count on successful connection
        };
  
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          ws.close(); // Ensure the socket is closed before retrying
        };
  
        ws.onclose = () => {
          console.log("WebSocket connection closed");
          setSocket(null);
  
          if (retryCount < maxRetries) {
            const delay = initialRetryDelay * Math.pow(retryMultiplier, retryCount);
            setTimeout(() => {
              console.log(`Attempting to reconnect... (Attempt ${retryCount + 1})`);
              setRetryCount(retryCount + 1);
              connectWebSocket(); // Attempt to reconnect
            }, delay);
          }
        };
  
        // Existing ws.onmessage handler
        ws.onmessage = (event) => {
        
          const { type, data, testPassed } = JSON.parse(event.data);
    
          if (type === 'output') {
            
              setOutput((prevOutput) => [...prevOutput, data]);
           
          }
    
          if (type === 'inputRequest') {
            console.log("input")
            inputRef.current.focus();
          }
    
          if (type === 'exit'){
            console.log("exit code: "+ data)
            if(data === 0 ){
              //set submit button to active
            }
  
            if(testPassed){
              setFeedback("All tests passed. Good Job!")
              setTabIndex(1)
              setTestPassed(true)
  
            }
            
          }
        };
  
        return () => {
          ws.close();
        };
      };
  
      if (!socket) {
        connectWebSocket();
      }
    }, [socket, retryCount, maxRetries, initialRetryDelay, retryMultiplier]);
  
  
  
    
    const handleCodeInputChange = (newCode) => {
      setValue(newCode);
    };
  
    const handleTabChange = (event, newValue) => {
      setTabIndex(newValue);
    };

    
    
  
    const runCode = () => {
      SetBeenRun(true)
      if (socket) {
        console.log("socket")
  
        socket.send(JSON.stringify({ type: 'runCode', data: { code: editorRef.current.getValue(), language: assignment.language } }));
      }else{
        setMessage("no connection to server, try refreshing")
      }
    };
    function finishedEditing(){
      navigate("/")
    }

    useEffect(() => {
      // This effect will run whenever `value` changes.
      if (socket && testPassed ) {
        if(uid !== 9){
          updateUser(editorRef.current.getValue());
        }else{
          console.log("test user")
        }
        
      }
    }, [socket, testPassed]); // Depend on `value`, `socket`, and `testPassed`.
    
  
    
    return (
      <div>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Instructions" />
          <Tab disabled={!feedback.length>0} label="Feedback" />
        </Tabs>
        <div className='bottom-padding'>
        {tabIndex==0 &&<Instruction text={instruction}/>}
        {tabIndex==1 && <div>{feedback}</div>}
        </div>
      <Grid container direction="row">
         <Grid item xs={8}>
        <div className="editor-controls">
          <IconButton onClick={runCode}>
            <PlayCircleIcon />
          </IconButton>
  
          <Editor
        height="60vh"
        defaultLanguage={assignment.language}
        defaultValue={assignment.startercode}
        onMount={handleEditorDidMount}
      />
           {/* <AceEditor
              mode="python"
              theme="monokai"
              value={value}
              onChange={handleCodeInputChange}
              name="code-editor"
              editorProps={{ $blockScrolling: true }}
              fontSize={14}
              highlightActiveLine={true}
              width="90%"
              height="300px"
              showPrintMargin= {false}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 4,
              }}
            /> */}
          
        </div>
        </Grid>
        <Grid item xs={4}>
        <div>
        
        <div className="terminal">
        {output.map((line, index) => (
            <React.Fragment key={index}>
              {line.split('\n').map((lineContent, i) => (
                <p key={`${index}-${i}`}>{lineContent}</p>
              ))}
            </React.Fragment>
          ))}
        <div>
          <span>{"> "}</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyPress}
          />
        </div>
      
      </div>
                <div className="d-flex justify-content-center">
      
      {!submitB ? <CircularProgress />:
      <Button disabled={!beenRun} onClick={handleSubmitPress} style={{ margin: '20px' }} variant="contained">Submit</Button>
              }
              
             
      <Button onClick={finishedEditing} color="success" style={{ margin: '20px' }} variant="contained">Home</Button>
     
      </div>
        </div>
  
        </Grid>
        </Grid>
  {!isSocket && <span>no server connection</span>}
  {message}
        </div>
    );
}
