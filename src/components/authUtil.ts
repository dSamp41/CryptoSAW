import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signInWithPopup, GoogleAuthProvider, signOut, GithubAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { app, db } from '../firebaseConf'
import { collection, getDocs, query, where, setDoc, doc, WithFieldValue, DocumentData } from 'firebase/firestore';
import { sendNotification } from '@/main';
import toast from 'react-hot-toast';
import { FirebaseError } from 'firebase/app';

export function validateEmail(email: string): boolean {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    return emailRegex.test(email);
}

export function validatePassword(pw: string): boolean {
    //Minimum 8 characters,; one uppercase letter, one lowercase letter, one number and one special character:
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

    return pwRegex.test(pw);
}


function UserInfoSkeleton(uid: string, username: string, provider: string, email: string): WithFieldValue<DocumentData> {
    return {
        uid: uid,
        name: username,
        authProvider: provider,
        email: email,
        assets: [],
        notificationEvents: []
    }
}

const auth = getAuth(app);

//Google auth
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        
        if (docs.docs.length === 0) {
            await setDoc(doc(db, "users", user.uid), UserInfoSkeleton(user.uid, user.displayName || '', "google", user.email || ''));

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
            await setDoc(doc(db, "users", user.uid), UserInfoSkeleton(user.uid, user.displayName ||  '', 'github', user.email || ''));
        }
        sendNotification("You are logged in!");
    } 
    catch(err) {
        if(err instanceof Error){
            console.error(err);
        }
    }
}



//Local Auth
export async function registerWithEmailPwd(email: string, password: string, username: string){
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;

        await setDoc(doc(db, "users", user.uid), UserInfoSkeleton(user.uid, username, "local", email ))

        sendNotification("Welcome!");
    }
    catch(error){
        if(error instanceof FirebaseError){
            switch(error.code){
                case 'auth/invalid-email':
                case 'auth/weak-password':{
                    toast.error('Invalid email address or password');
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
    }
}



export async function loginWithEmailPwd(email: string, password: string){
    /*signInWithEmailAndPassword(auth, email, password)
        .then(() => sendNotification("You are logged in!"))
        .catch((error: FirebaseError) => {
            switch(error.code){
                case "auth/invalid-email":
                case "auth/wrong-password":
                case "auth/user-not-found": {
                    toast.error("Wrong email address or password.");
                    break;
                }
                case "auth/user-disabled": {
                    toast.error("This account is disabled");
                    break;
                }
            }
        })*/

        try{
            await signInWithEmailAndPassword(auth, email, password);
            sendNotification("You are logged in!")
        }
        catch(error){
            if(error instanceof FirebaseError)
            switch(error.code){
                case "auth/invalid-email":
                case "auth/wrong-password":
                case "auth/user-not-found": {
                    toast.error("Wrong email address or password.");
                    break;
                }
                case "auth/user-disabled": {
                    toast.error("This account is disabled");
                    break;
                }
                default: {
                    console.error(error)
                }
            }
        }




}

export function logout(){
    signOut(auth)
        .then(() => {
            sendNotification('Goodbye!');
        })
        .catch((error: Error) => {console.error(error.message)})
}

export function resetPw(email: string){
    sendPasswordResetEmail(auth, email)
        .catch((err) => console.error(err))
}