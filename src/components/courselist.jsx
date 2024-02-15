import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card'; 
import CardContent from '@mui/material/CardContent'; 
import Typography from '@mui/material/Typography'; 
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import HighlightOff from '@mui/icons-material/HighlightOff';

export default function CourseList({ user, uid }) {
  const navigate = useNavigate();

  function handleAssignmentClick(ass) {
    navigate("/assignment", { state: { assignment: ass, uid: uid} }); 
  }

  return (
    <div>
      Assignments:
      {user.assignments && user.assignments.length > 0 ? (
        user.assignments.map(ass => (
          <Card
            onClick={() => handleAssignmentClick(ass)}
            key={ass.uniqueID}
            variant="outlined"
            sx={{ 
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
            }}
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Assignment
              </Typography>
              <Typography variant="h5" component="h2">
                {ass.description}
              </Typography>
              {ass.completed ? (
                <CheckCircleOutline color="success" />
              ) : (
                <HighlightOff color="error" />
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <div>No assignments yet.</div>
      )}
    </div>
  );
}
