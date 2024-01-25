import React, { useState, useEffect, useRef } from 'react';

import { Button,Grid, IconButton, Tab, Tabs,CircularProgress } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AceEditor from 'react-ace';
import '../App.css'
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';

import Instruction from './instruction';

export default function InPageTextEdit(props) {
  const [value, setValue] = useState('');
  const [plan, setPlan] = useState([])
  const [socket, setSocket] = useState(null);
  const [output, setOutput] = useState(["Terminal"]);
  const [inputValue, setInputValue] = useState("");
  const [pendingSocketSend, setPendingSocketSend] = useState(false);
  const inputRef = useRef(null);
  const wsRef = useRef(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [feedback, setFeedback] = useState("")
  const [submitB, setSubmitB] = useState(true)
  const [beenRun, SetBeenRun] = useState(false)

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
  const exCode = `
  if(x ==2):
    print(x)
  `
  const exDescription = "The code should have two if statements one using '==' the other using '!='"
  const handleSubmitPress = () =>{
    //replace with code message
    const message = [{role: "system", content:"You are a helpful assistant helping a student learn to code."},
    {role: "user", content: "you are helping a student learn to code you will be given some code and a description of what that code should contain. If the code matches the description respond with 'Good Job!'. If it does not match explain what need to be fixed. Don't give code that will exactly match the description."},
    {role: "user", content: "Code:"+exCode+"Description:"+exDescription},
    {role: "assistant", content: "Your code is not quite right. It should contain two if statements one using '=' one using '!=' you only have one if statement"},
    {role: "user", content: "Code:"+value+"Description:"+props.description}
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
    console.log("run code")
    SetBeenRun(true)
    if (socket) {
      console.log("socket")

      socket.send(JSON.stringify({ type: 'runCode', data: { code: value } }));
    }
  };



  return (
    <div >
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Instructions" />
        <Tab disabled={!feedback.length>0} label="Feedback" />
      </Tabs>
      <div className='bottom-padding'>
      {tabIndex==0 &&<Instruction text={props.text}/>}
      {tabIndex==1 && <div><Instruction text={feedback}/></div>}
      </div>
    <Grid container direction="row">
       <Grid item xs={8}>
      <div className="editor-controls">
        <IconButton onClick={runCode} style={{ alignItems: "flex-start" }} color="success">
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
    <Button onClick={props.onFinishEditing} color="success" style={{ margin: '20px' }} variant="contained">Next</Button>
     
    </div>
      </div>

      </Grid>
      </Grid>

      </div>
  );
}
