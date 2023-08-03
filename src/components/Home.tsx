import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import './Home.css'

export default function Home(){
    const [isLogged, setIsLogged] = useState<boolean>(false);
    
    onAuthStateChanged( getAuth(), async (user) => {
        if(user){
            setIsLogged(true);     
        }
        else{
            setIsLogged(false);
        }
    })
  
    
  return(
    <div className="startText">
      <h1>Welcome to CryptoSAW!</h1>
      { isLogged
        ? <p className='text'>You can check your <Link to="/wallet" className='links'>wallet</Link> to see the latest crypto market movements</p>
        : <p className='text'>To start you can view the <Link to="/overview" className='links'>Overview</Link> of crypto markets but to fully enjoy the app you should <Link to="/login" className='links'>sign up</Link> or <Link to="/login" className='links'>login</Link></p>
      }
    </div>
  );
}
