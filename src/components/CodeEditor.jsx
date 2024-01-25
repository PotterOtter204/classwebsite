import React, { useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python"; // Import Python mode
import "ace-builds/src-noconflict/theme-monokai"; // Import theme of your choice

const CodeEditor = () => {
  const [code, setCode] = useState("");

  const handleInputChange = (newCode) => {
    setCode(newCode);
  };

  return (
    <div>
      <AceEditor
        mode="python"
        theme="monokai"
        value={code}
        onChange={handleInputChange}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        width="100%"
        height="400px"
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
        }}
      />
      {/* Rest of your component */}
    </div>
  );
};

export default CodeEditor;
