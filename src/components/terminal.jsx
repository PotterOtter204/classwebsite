import React, { useState, useEffect, useRef } from "react";
import { Stack, Form, Button} from "react-bootstrap"
import '../App.css'

function Terminal() {
  const [output, setOutput] = useState(["Welcome to the terminal!"]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleInputKeyPress = (event) => {
    if (event.key === "Enter") {
      setOutput([...output, `> ${inputValue}`]);
      setInputValue("");

      
    }
  };

  

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="terminal">
      {output.map((line, index) => (
        <p key={index}>{line}</p>
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
  );
}

export default Terminal;
