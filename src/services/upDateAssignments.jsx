import { db } from "../firebase-config";
import { collection, query, where, getDocs, writeBatch } from "firebase/firestore";

export async function updateAssignments(classId, assignment) {
  console.log(classId);
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
      // Check if the user already has assignments and if any of them have the same uniqueID as the new assignment
      const assignmentIndex = user.assignments ? user.assignments.findIndex(assignmentItem => assignmentItem.uniqueID === assignment.uniqueID) : -1;

      let updatedAssignments;
      if (assignmentIndex === -1) {
        // If no existing assignment with the same uniqueID, add the new assignment to the list
        updatedAssignments = user.assignments ? [...user.assignments, assignment] : [assignment];
      } else {
        // If an assignment with the same uniqueID exists, update that assignment
        console.log(assignment.instruction)
        updatedAssignments = [...user.assignments];
        updatedAssignments[assignmentIndex].instruction = assignment.instruction; 
        updatedAssignments[assignmentIndex].startercode = assignment.startercode; 
        updatedAssignments[assignmentIndex].tests = assignment.tests;
        updatedAssignments[assignmentIndex].date = assignment.date ?? new Date().toISOString() // Use current date as fallback

        //updatedAssignments[assignmentIndex].date = assignment.date; // Replace the existing assignment with the new one
      }

      const docRef = doc.ref; // Get the reference to the document
      batch.update(docRef, { assignments: updatedAssignments });
    });

    await batch.commit(); // Commit the batch
    console.log('Batch update successful');
  } catch (error) {
    console.error("Error updating documents: ", error);
  }
};
