import { db } from "../firebase-config";
import { collection, query, where, getDocs, writeBatch } from "firebase/firestore";

export async function deleteAssignment(uniqueID, classId) {

  
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("classCode", "==", classId));
        const snapshot = await getDocs(q);
    
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }
    
        const batch = writeBatch(db);
    
        snapshot.docs.forEach((doc) => {
          const user = doc.data();
          if (user.assignments) {
              // Check if the user already has assignments and if any of them have the same uniqueID as the new assignment
              const assignmentIndex = user.assignments.findIndex(assignment => assignment.uniqueID === uniqueID);
    
              // Proceed only if an assignment with the specified uniqueID is found
              if (assignmentIndex !== -1) {
                  let updatedAssignments = [...user.assignments];
                  updatedAssignments.splice(assignmentIndex, 1);
                  
                  // Update the document with the new assignments array
                  const docRef = doc.ref; // Get the reference to the document
                  batch.update(docRef, { assignments: updatedAssignments });
              }
          }
        });
    
        await batch.commit(); // Commit the batch
        console.log('Batch update successful');
    } catch (error) {
        console.error("Error updating documents: ", error);
    }
}
