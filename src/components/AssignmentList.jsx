import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { Card, CardContent, CardActions, Button, Typography, Box } from '@mui/material';
import { collection, getDocs } from "firebase/firestore";
import { updateAssignments } from '../services/upDateAssignments';
import "./ResultsView.css"

const AssignmentList = ({classId}) => {
  const [assignments, setAssignments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
        const querySnapshot = await getDocs(collection(db, "assignmentsKEC"));
      const assignmentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(assignmentsData)
      setAssignments(assignmentsData);
    };

    fetchAssignments();
  }, []);

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAssignClick = (assignment) => {
    updateAssignments(classId, assignment)
  };
  const styles = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px', // Adjust the gap as needed
      marginBottom: '32px', // Adds space below the AssignmentList
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'flex-end', // Positions buttons to the right
    },
    expandContent: {
      paddingTop: '16px', // Adds space above the expanded content
    },
  };



  return (
    <Box style={styles.root}>
      {assignments.map((assignment) => (
        <Card key={assignment.id} variant="outlined" style={styles.card}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {assignment.description}
            </Typography>
            <Typography variant="body2" component="p" style={{ whiteSpace: expandedId === assignment.id ? 'normal' : 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {assignment.instruction}
            </Typography>
            {expandedId === assignment.id && (
              <div style={styles.expandContent}>
                <Typography variant="body2" component="div">
                  starter code: <br />
                  <div className="studentWork">
                  {assignment.startercode}
                  </div>
                </Typography>
                <Typography variant="body2" component="div">
                  Tests: <br />
                  <div className="studentWork">
                  {assignment.tests}
                  </div>
                </Typography>
              </div>
            )}
          </CardContent>
          <CardActions style={styles.cardActions}>
            <Button size="small" onClick={() => handleExpandClick(assignment.id)}>Expand</Button>
            <Button size="small" onClick={() => handleAssignClick(assignment)}>Assign</Button>
            
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default AssignmentList;
