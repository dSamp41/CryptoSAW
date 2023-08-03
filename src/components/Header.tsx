import { useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { logout } from './authUtil';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConf';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Header.css'


function UserMenu({username}: {username: string} ){
    return(
        <ul className="navbar-nav justify-content-end">
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"> 
                    <i className="bi bi-person-fill"></i>  
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li className='usernameTxt'>{username}</li>
                    <li><hr className="dropdown-divider"></hr></li>
                    <li>
                        <Link className="dropdown-item" to="/selection">Gestisci wallet</Link>
                    </li>
                    <li>
                        <Link className="redTxt dropdown-item" to="/" onClick={logout}>Logout</Link>
                    </li>

                </ul>
            </li>
        </ul>
    );
}

export default function Header({className}: {className: string}) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');

    onAuthStateChanged( getAuth(), async (user) => {
        if(user){
            setIsLoggedIn(true);

            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                setUsername(docSnap.data().name as string);
            }
        }
        else{
            setIsLoggedIn(false);
        }
    });
    

    return (
        <nav className={`navbar navbar-expand-lg header ${className}`}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">CryptoSAW</Link>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" data-bs-auto-close="true" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="navbar-nav">
                            <Link className="nav-link" aria-current="page" to="/overview">Overview</Link>
                        </li>

                        {isLoggedIn ? 
                            <li className="nav-item" >
                                <Link className="nav-link" to="/wallet">Wallet</Link>
                            </li>
                            : <></> 
                        }

                        {isLoggedIn? <></> : 
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        }

                    </ul>

                    {isLoggedIn? <UserMenu username={username}/>: <></>}

                </div>
            </div>
        </nav>
    );
}