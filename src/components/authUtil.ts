import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, GithubAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { app, db } from '../firebaseConf'
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import { sendNotification } from '@/main';


export function validateEmail(email: string): boolean {
    const emailRegExp = new RegExp("/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/");
    
    if (emailRegExp.test(email)){
        return true;
    }
    return false;
}

const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
  if (user){
    console.debug(`User: ${user.uid}`);
  }
  else{
    console.debug("No user")
  }
})



//Google auth
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        
        if (docs.docs.length === 0) {
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                assets: [''],
                notificationEvents: []
            });

            sendNotification("You are logged in!");
        }
    } 
    catch (err) {
        switch(err){
            case 'auth/cancelled-popup-request': {
                console.error('Closed popup');
                break;
            }
        }
    }
};


//Github auth
const ghProvider = new GithubAuthProvider()

export async function signInWithGithub(){
  try {
    const res = await signInWithPopup(auth, ghProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    
    if (docs.docs.length === 0) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "github",
        email: user.email,
        assets: [''],
        notificationEvents: []
      });
    }
    sendNotification("You are logged in!");
  } catch (err) {
    if(err instanceof Error){
      console.error(err);
      alert(err.message);
    }
  }
}


export function loginWithEmailPwd(email: string, password: string){

    signInWithEmailAndPassword(auth, email, password)
        .then(() => sendNotification("You are logged in!"))
        .catch((error) => {
            switch(error.code){
                case "auth/invalid-email":
                case "auth/wrong-password":
                case "auth/user-not-found": {
                    alert("Wrong email address or password.");
                    break;
                }
                case "auth/user-disabled":
                case "user-disabled": {
                    alert("This account is disabled");
                    break;
                }
            }
        }
    )
}

export async function registerWithEmailPwd(email: string, password: string, username: string){
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: username,
            authProvider: "local",
            email: email,
            assets: [],
            notificationEvents: []
        })

        sendNotification("Welcome!");
    }
    catch(error){
        switch(error){
            case 'auth/invalid-email':
            case 'auth/weak-password':{
                alert('Invalid email address or password');
                break;
            }
            case 'auth/network-request-failed': {
                console.error('Network request failed');
                break;
            }
            default: {
                console.error(error)
            }
        }
    }


    /*createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
            const user = res.user;

            addDoc(collection(db, "users"), {
                uid: user.uid,
                name: username,
                authProvider: "local",
                email: email,
                assets: ['']
            })
        })
        .catch((error) => {
            switch(error.code){
                case 'auth/invalid-email':
                case 'auth/weak-password':{
                    alert('Invalid email address or password');
                    break;
                }
                default: {
                    console.log(error)
                }
            }
        })*/
}

export function logout(){
    signOut(auth)
        .then(() => {
            sendNotification('Goodbye!');
            console.log("Successful logout")
        })
        .catch((error) => {if(error instanceof Error) alert(error.message)})
}

export function resetPw(email: string){
    sendPasswordResetEmail(auth, email);
}