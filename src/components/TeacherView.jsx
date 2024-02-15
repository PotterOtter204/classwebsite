
import React from 'react'
import { useEffect, useState } from 'react';
import { collection, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase-config';
import "./TeacherView.css"
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';






export default function TeacherView({user, uid}) {



const [classes, setClasses] = useState([])
const navigate = useNavigate();
const [newClass, setNewClass] = useState(false)

const [newClassCode, setNewClassCode] = useState("")
const [newClassName, setNewClassName] = useState("")

useEffect(() => {
 setNewClassCode(generateRandomString())
 setClasses(user.classes)
}, []);
console.log(classes.length)
const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !newClassCode|| !newClassName ) {
      alert('Please fill all the fields');
      return;
    }



    const courseRef = doc(db, 'users', uid);

    user.classes.push(
        {
            className: newClassName,
            classCode: newClassCode
        }
    )
   

    try {
      await setDoc(courseRef, user, { merge: true } );

      setClasses(user.classes)
      alert('Class Added!');
      setNewClass(false)
      setNewClassCode(generateRandomString)
      setNewClassName("")
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
const handleNewClass = () =>{
setNewClass(true)
}

function generateRandomString() {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for (var i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
const  handleClassClick= (classID) => {
  navigate("/classview", { state: { classId: classID} });
}

const handleNewAssignment = () =>{
  navigate("/createassignment", { state: {  userName: user.userName, classes:classes} });
}

  return (
    <div>
      <h3>

     
      Hi {user.userName}!
      </h3>
        <Grid container spacing={2}>
        <Grid item xs={6}>
        <Button onClick={handleNewAssignment} variant='contained'> Create Assignment</Button>

</Grid>
            <Grid item xs={6}>
            <Button onClick={handleNewClass} variant='contained'> Add New Class </Button>
            </Grid>
            <Grid item xs={12}>
                
                 
                {classes.map((classItem, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card onClick={() => handleClassClick(classItem.classCode)} sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            borderRadius: '16px',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Add transition for smoothness
            '&:hover': {
                transform: 'scale(1.05)', // Slightly increase the size
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow for depth
                cursor: 'pointer', // Change cursor to indicate clickability
            }
        }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {classItem.className}
              </Typography>
              <Typography>
                Class Code: {classItem.classCode}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
            </Grid>
           
        </Grid>

       { newClass && <div className='resultsView'>
        <button style={{ float: 'right' }} onClick={() => setNewClass(false)}>close</button>
        
        <form onSubmit={handleSubmit}>
        <div>
      <label htmlFor="description">Class Name:</label>
      <input type="text" id="description" className="full-width-input" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} />
    </div>
    <div>
      <label htmlFor="instruction">Class Code:</label>
     <div>{newClassCode}</div>
    </div>
    <button style={{ float: 'right' }}  className='submit' type="submit">Submit</button>
            </form> </div>}
    </div>
  )
}
