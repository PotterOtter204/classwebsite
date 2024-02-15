import React from 'react'

import { useLocation } from 'react-router-dom';
import { collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db } from "../firebase-config";
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';

import ResultsView from './ResultsView';
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';


export default function StudentView() {
    const [assignmentList, setAssignmentList] = useState([])
    const [currentAssignment, setCurrentAssignment] = useState({})
    const [viewAssignment, setViewAssignment] = useState(false)
    const location = useLocation();
    const { studentId, uid } = location.state || {};

    async function getAssignments(){
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("userName", "==", studentId));
            const snapshot = await getDocs(q);
        
            if (snapshot.empty) {
              console.log('No matching documents.');
              return;
            }
        
            // Checking if there are any documents in the snapshot
            if (!snapshot.empty) {
                // Getting the first document
                const doc = snapshot.docs[0];
                // Setting the assignments from the first document
                const assignments = doc.data().assignments;
                setAssignmentList(assignments);
                console.log(assignments);
            }
            
          } catch (error) {
            console.error("Error fetching Assignments: ", error);
          }
    }
    

    useEffect(() => {
        if (studentId) {
          getAssignments();
        }
      }, [studentId]);

function handleAssignmentClick(ass){
    
setCurrentAssignment(ass)
setViewAssignment(true)
}
  return (
    <div>
      <h2>{studentId}</h2>
    Assignments:
    {assignmentList.length === 0 ? (
        // Center the CircularProgress component
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      ) : (assignmentList.map(ass => (
      <Card onClick={() => handleAssignmentClick(ass)} key={ass.uniqueID} variant="outlined" sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: '16px',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
            transform: 'scale(1.01)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
        }
      }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Assignment
          </Typography>
          <Typography variant="h5" component="h2">
            {ass.description}
          </Typography>
          {/* Icon to indicate completion status */}
          {ass.completed ? (
            <CheckCircleOutline color="success" />
          ) : (
<HighlightOff color="error" />
          )}
        </CardContent>
      </Card>
    )))}
    {viewAssignment && <ResultsView assignmentList={assignmentList} uid={uid} setViewAssignment={setViewAssignment} currentAssignment={currentAssignment} />}
  </div>
  )
}
