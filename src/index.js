import AuthComponent from "./components/AuthComponent"
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import AssignmentView from './components/AssignmentView';

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
        element: <AssignmentForm />
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
      }
      
       
       ],
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

