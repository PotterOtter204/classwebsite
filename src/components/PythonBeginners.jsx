// Filename: PythonBeginnersAccordion.js

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PythonBeginnersAccordion = () => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Python Beginners</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          <Link to="/programview" state={{ module: "Module1", course: 'Python' }}>
          <ListItem >
            <ListItemText primary="Module 1" />
          </ListItem>
          </Link>
          <Link to="/programview" state={{ module: "Module2", course: 'Python' }}>
          <ListItem >
            <ListItemText primary="Module 2" />
          </ListItem>
          </Link>
          <Link to="/programview" state={{ module: "Module3", course: 'Python' }}>
          <ListItem >
            <ListItemText primary="Module 3" />
          </ListItem>
          </Link>
          <Link to="/programview" state={{ module: "Module4", course: 'Python' }}>
          <ListItem >
            <ListItemText primary="Module 4" />
          </ListItem>
          </Link>
          <Link to="/programview" state={{ module: "Module5", course: 'Python' }}>
          <ListItem >
            <ListItemText primary="Module 5" />
          </ListItem>
          </Link>
          <Link to="/programview" state={{ module: "Module6", course: 'Python' }}>
          <ListItem >
            <ListItemText primary="Module 6" />
          </ListItem>
          </Link>
          {/* ...add more ListItems for the remaining modules */}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default PythonBeginnersAccordion;
