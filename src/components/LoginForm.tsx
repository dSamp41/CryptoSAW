import { useEffect, useState } from "react";
import { loginWithEmailPwd, registerWithEmailPwd, signInWithGoogle, signInWithGithub, resetPw, validateEmail, validatePassword } from "./authUtil"
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

import './MobileLoginForm.css'
import './LoginForm.css';

type AuthFunction = () => void;
type ChangeFunction = (e: React.ChangeEvent<HTMLInputElement>) => void;


function GithubIcon(): JSX.Element{
    return <svg height="1em" viewBox="0 0 496 512">
        <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
    </svg>
}

const passwordDetail = () => {
    toast("Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character", 
        {icon: '🔑',position: 'bottom-center'})
}


function MobileLoginForm({githubAuth, googleAuth, register, login, resetPassword, changeUsername, changeEmail, changePw}: 
    {githubAuth: AuthFunction, googleAuth: AuthFunction, register: AuthFunction, login: AuthFunction, resetPassword: AuthFunction,
        changeUsername: ChangeFunction, changeEmail: ChangeFunction, changePw: ChangeFunction}){

    return( 
        <div className="main container">
			<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.8/css/all.css"></link>
            <input id="chk" type="checkbox" aria-hidden="true"></input>

            <div className="login">
                <form className='loginForm'>
                    <label className='loginLabel' htmlFor="chk" aria-hidden="true">Login</label>
					<div className="social-container">
                        <a className="social" onClick={githubAuth} aria-label="Login with Github"><GithubIcon/></a>
                        <a className="social" onClick={googleAuth} aria-label="Login with Github"><i className="fab fa-google"></i></a>
                    </div>
                    
                    <span>or use your account</span>
                    <input className='inputBox' type="email" placeholder="Email" id ='emailLoginBox' onChange={changeEmail}/>
                    <input className='inputBox' type="password" placeholder="Password" onChange={changePw}/>
                    <a className="resetPw" onClick={resetPassword} href='#' title='Inserisci'>Forgot password?</a>
                    <button className='ghost' onClick={login} type='button'>Login</button>
                </form>
            </div>

			<div className="SU">
				<form>
					<label htmlFor="chk" aria-hidden="true">Sign Up</label>
					<div className="social-container">
                        <a className="social" onClick={githubAuth} aria-label="Register with Github"><GithubIcon/></a>
                        <a className="social" onClick={googleAuth} aria-label="Register with Google"><i className="fab fa-google"></i></a>
                    </div>

					<input id='usernameRegBox' className='inputBox' type="text" name="email" placeholder="Username" onChange={changeUsername}></input>
					<input id='emailRegBox' className='inputBox' type="email" name="email" placeholder="Email" onChange={changeEmail}></input>
					<input id='pwRegBox' className='inputBox' type="password" name="pswd" placeholder="Password" onChange={changePw} onClick={passwordDetail}></input>
                    
                    <button className='button' onClick={register} type='button'>Signup</button>
				</form>
			</div>
        </div>
    );
}


const BigLoginForm = ({githubAuth, googleAuth, register, login, resetPassword, changeUsername, changeEmail, changePw}: 
    {githubAuth: (a: unknown) => void, googleAuth: (a: unknown) => void, 
        register: (a: unknown) => void, login: (a: unknown) => void, resetPassword: (a: unknown) => void,
        changeUsername: (e: React.ChangeEvent<HTMLInputElement>) => void,
        changeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void,
        changePw: (e: React.ChangeEvent<HTMLInputElement>) => void
    }) => {
    
    const [containerClass, setContainerClass] = useState<string>('container');

    const signInClk = () => {
        setContainerClass('container');
    };
    
    const signUpClk = () => {
        setContainerClass('container right-panel-active');
    };


    return(
    <div id="form">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.8/css/all.css"></link>
        <div className={containerClass} id="container">
            {/*log in form*/}
            <div className="form-container sign-in-container">
                <form action="#">
                    <h1>Login</h1>
                    <div className="social-container">
                        <a className="social" onClick={githubAuth} aria-label="Login with Github"><GithubIcon/></a>
                        <a className="social" onClick={googleAuth} aria-label="Login with Google"><i className="fab fa-google"></i></a>
                    </div>

                    <span>or use your account</span>
                    <input className='inputBox' type="email" placeholder="Email" onChange={changeEmail} />
                    <input className='inputBox' type="password" placeholder="Password" onChange={changePw}/>

                    <a className="resetPw" onClick={resetPassword}>Forgot password?</a>
                    <button className="create"onClick={login} type='button'>Login</button>
                </form>
            </div>

            {/* switcher */}            
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Welcome Back!</h1>
                        <p>If you already got an account, login</p>
                        <button className="ghost" id="signIn" onClick={signInClk}>Login</button>
                    </div>

                    <div className="overlay-panel overlay-right">
                        <h1>First time around here?</h1>
                        <p>Enter your data and hop on 🚀</p>
                        <button className="ghost" id="signUp" onClick={signUpClk}>Create an account</button>
                    </div>
                </div>
            </div>

            { /* SignUp form */ }
            <div className="form-container sign-up-container">
                <form action="#">
                    <h1>Sign Up</h1>
                    <div className="social-container">
                        <a href="#" className="social" onClick={githubAuth} aria-label="Register with Github"><GithubIcon/></a>
                        <a href="#" className="social" onClick={googleAuth} aria-label="Register with Google"><i className="fab fa-google"></i></a>
                    </div>

                    <span>or use your info</span>
                    <input className='inputBox' type="username" id='usernameRegBox' placeholder="Username" onChange={changeUsername} />
                    <input className='inputBox' type="email"    id='emailRegBox'    placeholder="Email"    onChange={changeEmail} />
                    <input className='inputBox' type="password" id='pwRegBox'       placeholder="Password" onChange={changePw} onClick={passwordDetail}/>
                    
                    <button className="create" type='button' onClick={register}>Create account</button>
                </form>
            </div>

        </div>
    </div>);
}


export default function LoginForm(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [bigScreenCond, setBigScreenCond] = useState<boolean>(window.innerWidth > 768);
    const navigate = useNavigate();
    
    const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
    const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const changePw = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    const GithubSignIn = () => {
        signInWithGithub()
            .then(() => navigate('/wallet'))
            .catch((err) => console.log(err))
    }

    const GoogleSignIn = () => {
        signInWithGoogle()
            .then(() => navigate('/wallet'))
            .catch((err) => console.log(err))
    }

    const register = () => {
        const usernameRegBox = document.getElementById('usernameRegBox');
        const emailRegBox = document.getElementById('emailRegBox');
        const pwRegBox = document.getElementById('pwRegBox');


        if(!username){
            usernameRegBox!.setAttribute('class', 'inputBox error');
            toast.error('Username can\'t be empty!')
        }
        if(!validateEmail(email)){
            emailRegBox!.setAttribute('class', 'inputBox error');
            toast.error('Invalid email!');
        }
        if(!validatePassword(password)) {
            pwRegBox!.setAttribute('class', 'inputBox error'); 
            toast.error('Invalid password!'); 
        }

        if(username && validateEmail(email) && validatePassword(password)){ 
            registerWithEmailPwd(email, password, username)
                .then( () => navigate('/wallet'))
                .catch( (err) => console.error(err));
        }
        else return;
    }

    const login = () => {
        if(!validateEmail(email) || !validatePassword(password)){
            toast.error('Email or password is invalid');
            return;
        }

        loginWithEmailPwd(email, password)
            .then(() => navigate('/wallet'))
            .catch( (err) => console.error(err));
    }

    const resetPassword = () => {
        if(validateEmail(email)) {
            resetPw(email);
            toast.success('Reset mail has been sent');
        }
        else toast.error("Insert a valid email address in the box");
    }



    useEffect(() => { 
        setBigScreenCond(window.innerWidth > 768);
    }, [])

    return (bigScreenCond 
        ? <BigLoginForm 
                githubAuth={GithubSignIn} googleAuth={GoogleSignIn} 
                register={register} login={login} resetPassword={resetPassword} 
                changeUsername={changeUsername} changeEmail={changeEmail} changePw={changePw}/>

        : <MobileLoginForm 
                githubAuth={GithubSignIn} googleAuth={GoogleSignIn} 
                register={register} login={login} resetPassword={resetPassword} 
                changeUsername={changeUsername} changeEmail={changeEmail} changePw={changePw}/>
    );
}