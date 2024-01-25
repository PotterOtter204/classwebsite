import { Button } from '@mui/material';
import React from 'react'
import { useState, useEffect} from 'react'
import { GetContent } from '../services/getContent';
import InPageTextEdit from './InPageTextEdit';

import { Link,useLocation } from "react-router-dom";
export default function ProgramView() {
    const [data, setData] = React.useState(null);
    const [plan, setPlan] = useState()
    const [planDisplay, setPlanDisplay] = useState([])
    const [index, setIndex] = useState(1)

    const [completedSection , setCompletedSection] = useState(false)
    
    
    const location = useLocation();
  const [module, setModule] = useState('');
  const [course, setCourse] = useState('');

  useEffect(() => {
    console.log('Location:', location);
    if (location.state) {
      console.log('State found');
      setModule(location.state.module);
      setCourse(location.state.course);
    } else {
      console.log('No state');
    }
  }, [location]);
    
    
    useEffect(() => {
      if(course.length>0){
        console.log(course)
        getPlan()
      }else{
        console.log('no course')
      }
        
      
      
      
    
    }, [course])

    async function getPlan(){
      const planny = await GetContent(course,module)
      setPlan(planny)
    }
    useEffect(() => {
      if(plan){
        setPlanDisplay(plan.slice(0, index));
      }
    
     
    
    }, [plan])

    function nextSection(){
      if( index  < plan.length){
        setIndex(prevIndex => prevIndex + 1);
      setPlanDisplay(plan.slice(0, index + 1));
      }else{
        setCompletedSection(true)
      }
      
    }
  
  //add unit assignment page


  return (
    <div>
    {planDisplay.map((item, itemIndex) => (
  <InPageTextEdit
    key={itemIndex}
    text={item.instruction}
    description={item.description}
    onFinishEditing={nextSection}
  />
))}
<div className="d-flex justify-content-center">
{completedSection  &&<Link to={"/assignment"} state ={{ module: module, course: course }}><Button variant="contained">Go to Assignment</Button></Link>}
</div>
    
    </div>
  )
}
