import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';
import { collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db } from "../firebase-config";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from "@mui/material/Button"
import { useNavigate } from 'react-router-dom';
import AssignmentList from './AssignmentList';
import { deleteAssignment } from '../services/deleteAssignment';

export default function ClassView() {

  const [studentList, setStudentList] = useState([])
  const [displayAss, setDisplayAss] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();
  const { classId } = location.state || {};
  const [value, setValue] = React.useState('1');

  const [assignmentData , setAssignmentData] = useState([])
  function compileAssignments(students) {
    const assignments = new Map();

    students.forEach(student => {
        student.assignments.forEach(assignment => {
            if (assignments.has(assignment.uniqueID)) {
                const existingAssignment = assignments.get(assignment.uniqueID);
                existingAssignment.totalStudents += 1;
                if (assignment.completed) {
                    existingAssignment.completedStudents += 1;
                }
            } else {
                assignments.set(assignment.uniqueID, {
                    description: assignment.description,
                    uniqueID:assignment.uniqueID,
                    instruction: assignment.instruction,
                    startercode: assignment.startercode,
                    tests: assignment.tests,
                    teacher: assignment.teacher,
                    totalStudents: 1,
                    completedStudents: assignment.completed ? 1 : 0
                });
            }
        });
    });

    return Array.from(assignments.values());
}
  async function getStudents(){
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("classCode", "==", classId));
      const snapshot = await getDocs(q);
  
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }
  
      let students = [];
      snapshot.forEach(doc => {
        const studentData = doc.data();
      studentData.uid = doc.id; // Add the document ID as "uid"
      students.push(studentData);
      });
      setStudentList(students);
      const assData = compileAssignments(students)
      setAssignmentData(assData)
    } catch (error) {
      console.error("Error fetching students: ", error);
    }
  }
  
  const  handleStudentClick= (studentID, uid) => {
    console.log(uid)
    navigate("/studentview", { state: { studentId: studentID, uid: uid} });
  }

  const handleAssignmentClick = (assignment) =>{
    navigate("/editassignment", { state: { assignment: assignment, classId:classId} })
  }
  useEffect(() => {
    if (classId) {
      getStudents();
    }
  }, [classId]);

  const handleChange = (event, newValue) => {
    console.log(newValue)
    setValue(newValue);
  };

  const handleDelete = (uniqueID) =>{
    deleteAssignment(uniqueID, classId)
  }

  function displayAssignments(){
    setDisplayAss(!displayAss)
  }

  return   <Box sx={{ width: '100%' }}>
  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
    <Tab label="Students" value="1" />
            <Tab label="Assignments" value="2" />
            <Tab label="Assign Work" value="3"/> 
    </Tabs>

    
  </Box>
  {value==1 && <div value={value} index={0}>
  <div>
{studentList.map(student => (
<Card onClick={() => handleStudentClick(student.userName, student.uid)} key={student.userName} variant="outlined" sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            borderRadius: '16px',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Add transition for smoothness
            '&:hover': {
                transform: 'scale(1.0)', // Slightly increase the size
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow for depth
                cursor: 'pointer', // Change cursor to indicate clickability
            }
        }}>
  <CardContent>
    <Typography color="textSecondary" gutterBottom>
      Student Name
    </Typography>
    <Typography variant="h5" component="h2">
      {student.userName}
    </Typography>
  </CardContent>
</Card>
))}
</div>
  </div>}

  {value==2 && <div value={value} index={1}>
  <div>
            {assignmentData.map((assignment, index) => (
                <Card key={index} style={{ margin: '10px' }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {assignment.description}
                        </Typography>
                        <Typography color="text.secondary">
                            Total Students: {assignment.totalStudents}
                        </Typography>
                        <Typography color="text.secondary">
                            Completed: {assignment.completedStudents}
                        </Typography>
                        <Button onClick={() => handleAssignmentClick(assignment)} >Edit</Button>
                        <Button onClick={() => handleDelete(assignment.uniqueID)}>Delete</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
  </div>}

  {value==3 &&
  <AssignmentList classId={classId}/>}
  
 
 
</Box> ;
}
