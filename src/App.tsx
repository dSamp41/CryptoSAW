import { useState, Suspense, lazy, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Home from './components/Home'

import Wallet from './components/Wallet'
//import {LoginForm} from './components/LoginForm_2.0'
//import Overview from './components/Overview'
//import Selection from './components/Selection'
const LoginForm =  lazy(() => import('./components/LoginForm_2.0'));
const Overview = lazy(() => import('./components/Overview'));
const Selection = lazy(() => import('./components/Selection'));

/*const Wallet = lazy(() => import('./components/Wallet'));
const LoginForm = lazy(() => import('./components/LoginForm'));
*/

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebaseConf'
import { AssetsContext, UserContext } from './AppContext'

import './App.css'

/*
const req = await fetch(`https://api.coincap.io/v2/assets/`)
const json = await req.json();
const ASSETS: string[] = json.data.map((el: any) => (el.id))*/


function App() {
  const [userAssets, setUserAssets] = useState<string[]>([]);
  const [ASSETS, setASSETS] = useState<string[]>([])

  useEffect(() => {
    fetch(`https://api.coincap.io/v2/assets/`)
      .then((resp) => resp.json())
      .then((json) => setASSETS(json.data.map((el: any) => (el.id as string))))
      .catch((err) => console.error(err))
  }, [])

  
  onAuthStateChanged( getAuth(), (user) => {
    if(user){
      const docRef = doc(db, 'users', user.uid)

      getDoc(docRef)
        .then((docSnap) => {          
          if(docSnap.exists()){
            setUserAssets(docSnap.data().assets);
          }
        })
        .catch((err) => console.error(err))
    }
  })

  
  return (
    <div className='App'>
      <Header className='headerPos'/>
      <div className='mainPos'>
        <AssetsContext.Provider value={ASSETS}>
          <UserContext.Provider value={userAssets}>
            <Suspense fallback={<p>Loading</p>}>
              <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/overview' element={<Overview/>}/>
                <Route path='/login' element={<LoginForm/>}/>
                <Route path='/wallet' element={<Wallet/>}/>
                <Route path='/selection' element={<Selection/>}/>
              </Routes>
            </Suspense>
          </UserContext.Provider>
        </AssetsContext.Provider>
      </div>
    </div>
  );
}

export default App
