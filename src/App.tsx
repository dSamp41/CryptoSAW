import { useState, Suspense, lazy, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Home from './components/Home'
import Loading from './components/Loading';
const Wallet = lazy(() => import('./components/Wallet'));
const LoginForm =  lazy(() => import('./components/LoginForm'));
const Overview = lazy(() => import('./components/Overview'));
const Selection = lazy(() => import('./components/Selection'));

import { Toaster } from "react-hot-toast";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebaseConf'
import { AssetsContext, UserContext } from './AppContext'
import { AllAssetsResponse, AssetDataObj, headers } from './components/cryptoUtil';

import './App.css'


function App() {
  const [userAssets, setUserAssets] = useState<string[]>([]);
  const [ASSETS, setASSETS] = useState<string[]>([])

  useEffect(() => {
    fetch(`https://api.coincap.io/v2/assets/`, {method: "GET", headers: headers})
      .then((resp) => resp.json())
      .then((json: AllAssetsResponse) => setASSETS(json.data.map((el: AssetDataObj) => (el.id))))
      .catch((err) => console.error(err))
  }, [])

  
  onAuthStateChanged( getAuth(), (user) => {
    if(!user) return;
    
    const docRef = doc(db, 'users', user.uid)
    getDoc(docRef)
      .then((docSnap) => {          
        if(docSnap.exists()){ 
          setUserAssets(docSnap.data().assets as string[]);
        }
      })
      .catch((err) => console.error(err))
  })

  
  return (
    <div className='App'>
      <Header className='headerPos'/>
      <div className='mainPos'>
        <AssetsContext.Provider value={ASSETS}>
          <UserContext.Provider value={userAssets}>
            <Suspense fallback={<Loading/>}>
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

        <Toaster position='bottom-center'/>
      </div>
    </div>
  );
}

export default App
