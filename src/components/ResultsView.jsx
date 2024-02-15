import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

import "./ResultsView.css"
import { Button } from '@mui/material'
import { db } from "../firebase-config";
export default function ResultsView({assignmentList, uid, currentAssignment, setViewAssignment}) {

const [newFeedback, setNewFeedback] = useState(currentAssignment.feedback )
  
async function updateUser() {
  // Reference to the user's document
  console.log(uid)
  const docRef = doc(db, "users", uid);

  try {
    // Get the current document
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Extract assignments list
     
      // Find the index of the assignment to update
      const assignmentIndex = assignmentList.findIndex(ass => ass.uniqueID === currentAssignment.uniqueID);

      if (assignmentIndex !== -1) {
        // Update the specific assignment
        assignmentList[assignmentIndex].completed = true;
        assignmentList[assignmentIndex].feedback = newFeedback;
      

        // Prepare the update object
        const updateObject = {};
        updateObject[`assignments`] = assignmentList; // This updates the entire assignments array

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



return (
    <div className='resultsView'>
    <button style={{ float: 'right' }} onClick={() => setViewAssignment(false)}>Close</button> <br/>
    <h3>Student Work:</h3>
    <div className="studentWork">
        {currentAssignment.studentWork}
    </div>

    <div>

      <h3>Feedback:</h3>

      <TextField rows={4} multiline fullWidth value={newFeedback} onChange={(e) => setNewFeedback(e.target.value)} id="outlined-basic" variant="outlined" />


      <Button onClick={updateUser}style={{ float: 'right', marginTop: "5px" }} variant='contained'>Submit</Button>
    </div>
</div>
  )
}
