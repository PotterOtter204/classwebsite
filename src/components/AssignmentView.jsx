
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


export default function AssignmentView(props) {
    
    const [value, setValue] = useState();
   
    const [socket, setSocket] = useState(null);
    const [output, setOutput] = useState(["Terminal"]);
    const [inputValue, setInputValue] = useState("");
    const [instruction, setInstruction] = useState("")
  
    const inputRef = useRef(null);
  
    const [tabIndex, setTabIndex] = useState(0);
    const [feedback, setFeedback] = useState("")
    const [submitB, setSubmitB] = useState(true)
    const [beenRun, SetBeenRun] = useState(false)
    const [description, setDescription] = useState("")
    const location = useLocation();
  const [module, setModule] = useState('');
  const [course, setCourse] = useState('');
  const [next, setNext] = useState("")

  useEffect(() => {
    console.log('Location:', location);
    if (location.state) {
      console.log('State found');
      setModule(location.state.module);
      setCourse(location.state.course);
    } else {
      console.log('No state');
    }
  }, [location]);

  useEffect(() => {
    if(course.length>0){
      console.log(course)
      getPlan()
    }else{
      console.log('no course')
    }
      
    
    
    
  
  }, [course])

  async function getPlan(){
    const planny = await getAssignment(course,module)
    console.log(planny)
    setValue(planny.startercode)
    setInstruction(planny.instruction)
    setDescription(planny.description)
    setNext(planny.next)
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
      //replace with code message
      const message = [{role: "system", content:"You are a helpful assistant helping s student learn to code."},
      {role: "user", content: "you are helping a student learn to code you will be given some code and a description of what that code should contan. If the code matches the description respond with 'Good Job'. If it does not match explain what is missing or what mistakes they made. You may give pseudocode, but no actual code."},
      {role: "user", content: "Code:"+value+"Description:"+description}
    ]
    setSubmitB(false)
    getData(message)
    }
  
    async function getData(plan){
      fetch("/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: plan }),
  })
    .then(response => response.json())
    .then(data => {
      setSubmitB(true)
      setFeedback(data);
      setTabIndex(1);
    })
    .catch(error => console.error(error));
  
  
    }
  
    
  
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };
  
  
    useEffect(() => {
      const ws = new WebSocket('ws://localhost:3001');
  
      ws.onopen = () => {
        setSocket(ws);
      };
      
  
      ws.onmessage = (event) => {
        
        const { type, data } = JSON.parse(event.data);
  
        if (type === 'output') {
          if( !data.includes("File")){
            setOutput((prevOutput) => [...prevOutput, data]);
          }
          
          console.log(data)
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
        }
      };
     
  
      ws.onclose = () => {
        setSocket(null);
      };
  
      return () => {
        ws.close();
      };
    }, []);
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
  
        socket.send(JSON.stringify({ type: 'runCode', data: { code: value } }));
      }
    };
    function finishedEditing(){
      //navigate to next module
    }
  
    const assignmentDescription = "use the variables in the editor to print out the sentence: 'In 2022 Aaron judge had an ops of 1.111 and an ops+ of 211.' You can recombine them in any way, but don't add any new text or numbers."
    
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
  
        
            <AceEditor
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
            />
          
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
              <Link to="/programview" state={{course:course, module: next}}>
             
      <Button onClick={finishedEditing} color="success" style={{ margin: '20px' }} variant="contained">Next</Button>
      </Link>
      </div>
        </div>
  
        </Grid>
        </Grid>
  
        </div>
    );
}
