import React, { useState } from 'react';
import './HoverComponent.css'; // import your CSS file
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,updateProfile } from "@firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore"; 
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { db } from '../firebase-config';
const AuthComponent = () => {
    const [isSignUp, setIsSignUp] = useState(false); // true for sign up, false for sign in
//create the navigate object 
  const navigate = useNavigate();

  //a stateful variable for each input
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole]= useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [classCode, setClassCode] = useState("");

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    const handleChange = (event) => {
      setRole(event.target.value);
    };

  const handleSubmit = (e) => {
      e.preventDefault(); // Prevents the default form submission behavior

      // Perform validation checks here
      // For example, checking if all fields are filled, if passwords match, etc.

      // If validation passes, process the form data
      // This could involve sending a request to a server or handling data in some other way
//
    //get the auth object
     const auth = getAuth();

    //if on sign up page create a new user
    if(isSignUp){
     
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 

          
          const user = userCredential.user;

          addUser(user.uid)

          

          //add the userName to the users profile it can't be added when the user is created
          updateProfile(user, {
            displayName: userName
          }).then(() => {
            console.log('Username updated successfully!');
          }).catch((error) => {
            console.error('Error updating username:', error);
          });
          console.log(user)

          //navigate to the home page on successful user creation
          navigate("/")
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
           console.log(errorMessage)
          // ..
        });
    }else{

      //if on the sign in page just sign them in
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
      

        //navigate to the home page on succesful sign in
        navigate("/")
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
      });
    }
      console.log("Form Submitted");

     
  };


async function addUser(uid){
  await setDoc(doc(db, "users", uid), {
    userName: userName,
    role: role,
    classCode: classCode,
    classes: []
  });

}

    return (
        <div className="hover-component">
            <div className="toggle-switch">
                <button onClick={toggleForm}>
                    {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
                </button>
            </div>
          {/*if signUp is true it shows the div with className signup-form if false it shows the div with className signin-form */}
            {isSignUp ? (
                <div className="signup-form">
                  <form onSubmit={handleSubmit} className="form">
                      <h2>Sign Up</h2>

                      <Box sx={{ minWidth: 120 }}>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Role</InputLabel>
                            <Select
                              labelId="role-label"
                              id="roleselect"
                              value={role}
                              label="Role"
                              onChange={handleChange}
                            >
                              <MenuItem value={"Teacher"}>Teacher</MenuItem>
                              <MenuItem value={"Student"}>Student</MenuItem>
                             
                            </Select>
                          </FormControl>
                        </Box>
                        {role === 'Student' &&<input type="text" placeholder="Class Code"
                       value={classCode}
                       onChange={(e) => setClassCode(e.target.value)}

                       required />}
                     <input type="text" placeholder="Username"
                       value={userName}
                       onChange={(e) => setUserName(e.target.value)}

                       required />
                      <input type="email" placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        
                        required />
                      <input type="password" placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                      <input type="password" placeholder="Confirm Password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required />
                      <button type="submit">Sign Up</button>
                  </form>
                </div>
            ) : (
                <div className="signin-form">
                    <form onSubmit={handleSubmit} className="form">
                        <h2>Sign In</h2>
                        <input type="email" placeholder="Email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required />
                        <input type="password" placeholder="Password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required />
                        <button type="submit">Sign In</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AuthComponent;
