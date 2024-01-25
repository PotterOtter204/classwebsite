import { db} from "../firebase-config"
import { doc, getDoc } from "firebase/firestore";

export async function GetContent(course,module){
    const content = [
        {
        instruction: `When writing a program we store information in variables. Python doesn't require you to specify the variable type when you create it, it figures out the type based on the information you store. For example to store a number variable
        
     
        {numberVariable = 23}
  
    
        The variable numberVariable now stores the value 23. Because this number does not have a decimal python determines that this variable is of type Int. If the number you are storing has decimals it will be of type float. For example:
    

        {floatVariable = 43.6}
    
    In the code editor below make four variables, two of which should be floats and two of which should be ints.`,
    
    description: `the code has two int variables and two float variables`
        },
        {
            instruction: `Sometimes we want to store true and false values to control the logic of our code. These variables are called bools. you make them like this:
{booleanOne = true;
booleanTwo = false;}make two boolean variables and run your code`,
            description: `the code has two boolean variables.`
            },
            {
                instruction: `We will also frequently want to store text data. We store this kind of data in a string variable. like this:

                {stringOne = "surround your text with quotation marks"
stringTwo = 'You can also do single quotes'}
            make two different string variables and then run your code.`,
                description: `The code has two string variables`
                },
                {
                    instruction: `When we want to see the output of our code we can use a print statement. This will print whatever is in the brackets to the console. You use a print statement like this:

                    {print("Hello world")}
                you can also use print() to print variables like this:
                
                    {stringVar = "Example"
numberVariable = 22
print(numberVariable)
print(stringVar)}
                in the code editor make at least two variables and print them.`,
                    description: `The code has two variables both of which are printed to the console.`
                    
                },
                    {
                        instruction: `Now that we have learned to make variables lets do something with them.  Starting with the "+" operator. In python you can use the + operator with both strings and number variables. When used with number variables it works exactly like it does in math.

                        {num = 5
                        numTwo = 10s
                        answer = num + numTwo
                        print(answer)}
                    output: 15
                    
                    You can also use the "+" operator with strings like this
                    
                        {stringOne = "This is a "
                        stringTwo = "test."
                        print(stringOne + stringTwo)}
                    output:  This is a test.
                    
                    In the editor make two string variables, add them together then print out the results. Do the same with two number variables.`,
                        description: `The code has two string variables and two number variables. The string variables are added together and the results is printed. The number variables are added together and the result is printed.`
                        
                    },
                        {
                            instruction:`Sometimes you need to combine variables of different types. If you want to insert a number into a string you can use the function str() like this:
                            {num = 5
                            numberAsString = str(num)}
                            you can then add that new variable to a string like this:
                            {stringVar = "I have " + numberAsString + " apples."
                        print(stringVar)}
                        output:I have 5 apples
                        In the editor create a number variable and a string variable then use the str() function to add them together.
                            `,
                            description:"The code has a number variable, and a string variable. The str() method is used"
                        },
                        {
                            instruction:`You will also sometimes want to do math with a number that is stored as a string. You can convert a string that contains only numbers to either a float or an int, then do any math you need to do with it.
                            {numberString = "43"
                        floatString = "22.2"
                    result = int(numberString) + float(floatString)
                print(result)}
                output:65.2
                in the editor create a float and an int then multiply them and print the result.`,
                            description:"the code has two strings, both of which are turned into either a float or an int, then multiplied together."
                        }
                       
]


const docRef = doc(db, "courses", course);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    const data = docSnap.data()
  console.log(data[module]);
return data[module]
} else {
  // doc.data() will be undefined in this case
  console.log("No such document!");
  return content;
}





}