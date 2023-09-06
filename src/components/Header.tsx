import { logout } from './authUtil';
import { Link } from 'react-router-dom';

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
                        <Link className="dropdown-item" to="/selection">Manage wallet</Link>
                    </li>
                    <li>
                        <Link className="redTxt dropdown-item" to="/" onClick={logout}>Logout</Link>
                    </li>

                </ul>
            </li>
        </ul>
    );
}

export default function Header({isLoggedIn, username}: {isLoggedIn: boolean, username: string}) {  

    return (
        <nav className="navbar navbar-expand-lg header">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">CryptoSAW</Link>
                
                <button className="navbar-toggler" type="button"
                    data-bs-toggle="collapse" data-bs-target="#navbarNav" data-bs-auto-close="true" 
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
                        : 
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        }

                    </ul>

                    {isLoggedIn ? <UserMenu username={username}/> : <></>}

                </div>
            </div>
        </nav>
    );
}