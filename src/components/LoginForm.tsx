/* eslint-disable*/
import { useEffect, useState } from "react";
import { loginWithEmailPwd, registerWithEmailPwd, signInWithGoogle, 
    signInWithGithub, resetPw, validateEmail } from "./authUtil"
import { useNavigate } from 'react-router-dom';

import './MobileLoginForm.css'
import "./LoginForm.css";
import { sendNotification } from "@/main";

function GithubIcon(){
    return <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
}


export function MobileLoginForm(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    function GoogleSignIn(){
        signInWithGoogle()
            .then(() => navigate('/wallet'))
            .catch((err) => console.log(err))
    }

    const register = () => {
        registerWithEmailPwd(email, password, username)
            .then( () => {navigate('/wallet')} );
    }

    const login = () => {
        if(!email || !password)
            alert('Email or password is invalid');

        loginWithEmailPwd(email, password)
        navigate('/wallet');
    }

    const resetPassword = () => {
        if(validateEmail(email)) resetPw(email);
        else alert("Insert a valid email address in the box");
    }

    return( 
        <div className="main container">
			<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.8/css/all.css"></link>
            <input id="chk" type="checkbox" aria-hidden="true"></input>

            <div className="login">
                <form className='loginForm'>
                    <label className='loginLabel' htmlFor="chk" aria-hidden="true">Accedi</label>
					<div className="social-container">
                        <a className="social" onClick={signInWithGithub}><GithubIcon/></a>
                        <a className="social" onClick={GoogleSignIn}><i className="fab fa-google"></i></a>
                    </div>
                    
                    <span>o usa il tuo account</span>
                    <input className='inputBox' type="email" placeholder="Email" id ='emailLoginBox' onChange={(e) => setEmail(e.target.value)}/>
                    <input className='inputBox' type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <a className="resetPw" onClick={resetPassword} href='#' title='Inserisci'>Password dimenticata?</a>
                    <button className='ghost' onClick={login} type='button'>Accedi</button>
                </form>
            </div>

			<div className="SU">
				<form>
					<label htmlFor="chk" aria-hidden="true">Registrati</label>
					<div className="social-container">
                        <a className="social" onClick={signInWithGithub}><GithubIcon/></a>
                        <a className="social" onClick={GoogleSignIn}><i className="fab fa-google"></i></a>
                    </div>
					
					<input id='usernameRegBox' className='inputBox' type="text" name="email" placeholder="Username" onChange={(e) => setUsername(e.target.value)}></input>
					<input id='emailRegBox' className='inputBox' type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}></input>
					<input id='pwRegBox' className='inputBox' type="password" name="pswd" placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
                    
                    <button className='button' onClick={register} type='button'>Signup</button>
				</form>
			</div>
	    </div>
    );
}


function BigLoginForm(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [containerClass, setContainerClass] = useState<string>('container');
    const navigate = useNavigate();

    function GoogleSignIn(){
        signInWithGoogle()
            .then(() => {sendNotification('Welcome back'); navigate('/wallet')})
            .catch((err) => console.log(err))
    }

    const register = () => {
        const usernameRegBox = document.getElementById('usernameRegBox');
        const emailRegBox = document.getElementById('emailRegBox');
        const pwRegBox = document.getElementById('pwRegBox');

        if(!username){
            usernameRegBox!.setAttribute('class', 'inputBox error');
            return;
        }
        if(!email){
            emailRegBox!.setAttribute('class', 'inputBox error');
            return;
        }
        if(!password){
            pwRegBox!.setAttribute('class', 'inputBox error');
            return;
        }

        registerWithEmailPwd(email, password, username).then( () => {navigate('/wallet')} );
    }

    const login = () => {
        if(!email || !password)
            alert('Email or password is invalid');

        loginWithEmailPwd(email, password)
        navigate('/wallet');
    }


    const signInClk = () => {
        setContainerClass('container');
    };
    
    const signUpClk = () => {
        setContainerClass('container right-panel-active');
    };

    const resetPassword = () => {
        if(validateEmail(email)) resetPw(email);
        else alert("Insert a valid email address in the box");
    }

    return(
    <div id="form">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.8/css/all.css"></link>
        <div className={containerClass} id="container">
            {/*log in form*/}
            <div className="form-container sign-in-container">
                <form action="#">
                    <h1>Accedi</h1>
                    <div className="social-container">
                        <a className="social" onClick={signInWithGithub}><GithubIcon/></a>
                        <a className="social" onClick={GoogleSignIn}><i className="fab fa-google"></i></a>
                    </div>
                    <span>o usa il tuo account</span>
                    <input className='inputBox' type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input className='inputBox' type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <a className="resetPw" onClick={resetPassword}>Password dimenticata?</a>
                    <button onClick={login} type='button'>Accedi</button>
                </form>
            </div>

            {/* switcher */}            
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Bentornato!</h1>
                        <p>Per accedere al tuo profilo, effettua il login</p>
                        <button className="ghost" id="signIn" onClick={signInClk}>Login</button>
                    </div>

                    <div className="overlay-panel overlay-right">
                        <h1>Prima volta da queste parti?</h1>
                        <p>Inserisci i tuoi dati e sali a bordo 🚀</p>
                        <button className="ghost" id="signUp" onClick={signUpClk}>Crea profilo</button>
                    </div>
                </div>
            </div>

            { /* SignUp form */ }
            <div className="form-container sign-up-container">
                <form action="#">
                    <h1>Crea Account</h1>
                    <div className="social-container">
                        <a href="#" className="social" onClick={signInWithGithub}><GithubIcon/></a>
                        <a href="#" className="social" onClick={GoogleSignIn}><i className="fab fa-google"></i></a>
                    </div>
                    <span>o usa l'email per registrarti</span>
                    <input id='usernameRegBox' className='inputBox' type="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    <input id='emailRegBox' className='inputBox' type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input id='pwRegBox' className='inputBox' type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button className="create" type='button' onClick={register}>Crea Account</button>
                </form>
            </div>

        </div>
    </div>);
}


export default function LoginForm(){
    const [bigScreenCond, setBigScreenCond] = useState<boolean>(window.innerWidth > 768);

    useEffect(() => { 
        setBigScreenCond(window.innerWidth > 768);
    }, [window.innerWidth])

    return (bigScreenCond ? <BigLoginForm /> : <MobileLoginForm/>);
}