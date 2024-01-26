
import React from 'react'
import { useEffect, useState } from 'react';
import { collection, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase-config';
import "./TeacherView.css"

import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';


export default function TeacherView({user, uid}) {

const [classes, setClasses] = useState([])

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
console.log(user)
  return (
    <div>Teacher Screen

        <Grid container>
            <Grid item xs={12}>
<Link to="/createassignment" state={{username: user.userName, classes: classes}}>Create assignment</Link>
            </Grid>
            <Grid item xs={12}>
                <Button onClick={handleNewClass} variant='contained'> Add New Class </Button>
                 
                {classes.map((classItem, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {classItem.className}
              </Typography>
              <Typography>
                {classItem.classCode}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
            </Grid>
           
        </Grid>

       { newClass && <div className='newClass'><form onSubmit={handleSubmit}>
        <div>
      <label htmlFor="description">Class Name:</label>
      <input type="text" id="description" className="full-width-input" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} />
    </div>
    <div>
      <label htmlFor="instruction">Class Code:</label>
      <textarea id="instruction" className="full-width-input" value={newClassCode} onChange={(e) => setNewClassCode(e.target.value)} />
    </div>
    <button className='submit' type="submit">Submit</button>
            </form> </div>}
    </div>
  )
}
