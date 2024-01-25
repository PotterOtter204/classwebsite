import { db} from "../firebase-config"
import { doc, getDoc } from "firebase/firestore";


export async function getAssignment(course, module){

    const docRef = doc(db, "assignments", course);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data()
 
    return data[module]
    } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    }

return null
}