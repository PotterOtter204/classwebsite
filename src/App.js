import logo from './logo.svg';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {   faLock, faHome, faPerson, } from '@fortawesome/free-solid-svg-icons';
import { Nav, Navbar, Container,  Offcanvas } from "react-bootstrap"

import { Button,  } from "@mui/material"

import { getAuth,  signOut  } from 'firebase/auth';

import { Outlet } from "react-router-dom";
export default function App() {
  const auth = getAuth();
 const sign_out = () => {
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
  }
 


  const expand = 'xxl';
  return (
    <div style={{ padding: "40px" }} className="outerdiv">
    <Navbar bg="dark" variant="dark" expand={expand} className="navbar fixed-top navbar-light bg-dark">
      <Container fluid>
      
        

        
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
             
             
            <Nav.Link href="/"><FontAwesomeIcon icon={faHome} className="mr-2"/>  &nbsp;Home</Nav.Link>
              <Nav.Link href="/teacherview"><FontAwesomeIcon icon={faPerson} className="mr-2"/>  &nbsp;Account</Nav.Link>
              <Nav.Link href="/"><FontAwesomeIcon icon={faLock} className="mr-2" />
              
            &nbsp;Change Password </Nav.Link> 
              
              
              <Button onClick={sign_out} className="btn btn-primary btn-sm" >Sign Out</Button>:
             
              
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>

  <br/>
                 
    <div className="detail">
      <Outlet className="allContent" />
    </div>
   



  </div>

  )
}

