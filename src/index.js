import AuthComponent from "./components/AuthComponent"
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import AssignmentView from './components/AssignmentView';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ProgramView from './components/ProgramView';

import CourseForm from './components/CourseForm';
import AssignmentForm from './components/AssignmentForm';
import Home from './components/home';
import StudentWork from './components/StudentWork';
import CreateAssignment from './components/CreateAssignment';
import CheckStudent from './components/CheckStudent';
import Assignments from './components/Assignments';
import AddStudent from './components/AddStudent';
import TeacherView from './components/TeacherView';
import AssignWork from './components/AssignWork';

import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword ,onAuthStateChanged,} from "@firebase/auth";
import ClassView from "./components/classView";
import StudentView from "./components/StudentView";
import EditAssignment from "./components/EditAssignment";


function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out, redirect to sign-in page
        navigate('/signin');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  // Render children if user is authenticated
  return user ? children : null;
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <ProtectedRoute><Home /></ProtectedRoute>
      },
      {
        path: "/programview",
        element: <ProgramView />,
      },
      {
        path: "/assignment",
        element: <AssignmentView />,
      },
      {
        path: "/courseform",
        element: <CourseForm />
      },
      {
        path: "/assignmentform",
        element: <ProtectedRoute><AssignmentForm /></ProtectedRoute>
      }
      ,
      {
        path: "/home",
        element: <Home/>
      },

      {
        path: "/studentwork",
        element: <StudentWork />
      },

      {
        path: "/teacherview",
        element: <ProtectedRoute><TeacherView /></ProtectedRoute>
      }
      ,
      {
        path: "/createassignment",
        element: <ProtectedRoute><CreateAssignment/></ProtectedRoute>
      }
      ,
      {
        path: "/checkstudents",
        element: <CheckStudent/>
      },

      {
        path: "/checkwork",
        element: <Assignments />
      },

      {
        path: "/addstudents",
        element: <AddStudent />
      }
      ,

      {
        path: "/assignwork",
        element: <AssignWork/>
      },

      {
        path: "/signin",
        element: <AuthComponent />
      },
      {
        path: "/classview",
        element: <ClassView />
      },
      {
        path: "/studentview",
        element: <StudentView />
      },
      {
        path: "/editassignment",
        element: <EditAssignment/>
      }
      
      
       
       ],
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
    <RouterProvider router={router} />
    </LocalizationProvider>
  </React.StrictMode>
);

