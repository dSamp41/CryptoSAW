import { useState, useEffect } from 'react';
import { Crypto, NotifEvent, START_CRYPTO } from './cryptoUtil.ts';
import { usePrevious } from '@/hooks/usePrevious.ts';
import { getAuth } from 'firebase/auth';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConf.ts';
import { ButtonGroup } from './ButtonGroup.tsx';

import './Card.css';




const DeleteIcon = () => {
  return(
    <svg className='btnStyle deleteBtn' height="1.7em" viewBox="0 0 16 16">
      <path d="M9.414 8l2.122-2.121-1.415-1.415L8 6.586 5.879 4.464 4.464 5.88 6.586 8l-2.122 2.121 1.415 1.415L8 9.414l2.121 2.122 1.415-1.415L9.414 8zM0 8c0 4.418 3.59 8 8 8 4.418 0 8-3.59 8-8 0-4.418-3.59-8-8-8-4.418 0-8 3.59-8 8zm2 0c0-3.307 2.686-6 6-6 3.307 0 6 2.686 6 6 0 3.307-2.686 6-6 6-3.307 0-6-2.686-6-6z" fillRule="evenodd"/>
    </svg>
  );
}

const NotificationIcon = () => {
  return(
    <svg className='btnStyle notifBtn' height="1.7em" viewBox="0 0 800 800">
      <path d="M0,400C0,620.9,179.5,800,400,800c220.9,0,400-179.5,400-400C800,179.1,620.5,0,400,0,179.1,0,0,179.5,0,400Zm100,0c0-165.35,134.3-300,300-300,165.35,0,300,134.3,300,300,0,165.35-134.3,300-300,300C234.65,700,100,565.7,100,400Z"/>
      <path d="M400,155.71a33.59,33.59,0,0,0-33.58,33.58v15.57A134.25,134.25,0,0,0,265.68,334.8V469.12L231.31,495h0a22.39,22.39,0,0,0,12,41.27H556.71a22.39,22.39,0,0,0,12-41.27l-34.41-25.89V334.8A134.25,134.25,0,0,0,433.58,204.86V189.29A33.59,33.59,0,0,0,400,155.71Zm-44.77,403a44.77,44.77,0,1,0,89.54,0Z"/>
    </svg>
  );
}

function Modal ({asset}: {asset: string}) {
  const modalId = asset + "NotifModal";
  const inputId= `${asset}ValueInput`;

  function saveNotifEvent(){
    const user = getAuth().currentUser;
    if(!user) return;
    
    let cryptoNotifEvent: NotifEvent = {asset: '', direction: '', value: 0};

    if(document.getElementById('ToggleGroup')){
      const selectedBtn = document.getElementsByClassName('btn active')[0] as HTMLButtonElement;
      const numInput = document.getElementById(inputId) as HTMLInputElement;
      
      if(selectedBtn) {
        cryptoNotifEvent = {asset: asset, direction: selectedBtn.name, value: Number(numInput.value)};
      }
    }

    const docRef = doc(db, 'users', user.uid)
    getDoc(docRef)
      .then((docSnap) => {
        if(docSnap.exists()) updateDoc(docRef, {notificationEvents: arrayUnion(cryptoNotifEvent)})
      })
      .catch((err) => console.error(err))

    document.getElementById(modalId)?.classList.remove('show');   
  }


  return (
    <div className="modal fade" id={modalId} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          
          <div className="modal-header">
            <h1 className="modal-title fs-5">Setta un evento da notificare per {asset}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          
          <div className="modal-body">
            <form>
              <ButtonGroup />
              <input type='number' id={inputId} placeholder='Value'></input>
            </form>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={saveNotifEvent}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}


export function CardElem ({asset}: {asset: string} ){
  const [cryptoData, setCryptoData] = useState<Crypto>(START_CRYPTO);
  const [timestamp, setTimestamp] = useState<number>(0);
  const oldValue = usePrevious<Crypto>(cryptoData, START_CRYPTO);

  const modalId: string = asset + "NotifModal";

  //connect to coincap API
  const getCryptoInfo = () => {
    fetch(`https://api.coincap.io/v2/assets/${asset}`)
      .then((response) => {
        if(response.ok) return response.json()
        else throw new Error("Not 2xx response")})
      .then((json) => {
        setCryptoData(json.data as Crypto);  
        setTimestamp(json.timestamp as number);
      })
      .catch((err) => console.error(err))
  };

  useEffect(() => {
    getCryptoInfo();
    const int = setInterval( () => getCryptoInfo(), 10000);

    return () => {clearInterval(int)}
  }, []);

  function deleteAsset(){
    const auth = getAuth();
    const user = auth.currentUser;
        
    if(user){
      const docRef = doc(db, 'users', user.uid)
      
      getDoc(docRef)
        .then((docSnap) => { 
          if(docSnap.exists())  
            updateDoc(docRef, {assets: arrayRemove(asset)})
        })
        .catch((err) => console.log(err))
    }
  }

  

  const priceIncrCond = (cryptoData.priceUsd - oldValue.priceUsd) >= 0;
  
  if(cryptoData === undefined || cryptoData === START_CRYPTO) return (<></>);
  return(
    <div className='cardArea'>
      <MainInfo c={cryptoData} ts={timestamp} priceIncrCond={priceIncrCond}/>

      <div className='btnArea'>
        <button className='shellBtn' type='button' data-bs-toggle="modal" data-bs-target={"#" + modalId}>
          <NotificationIcon/>
        </button>

        {/* Modal to set event to notificate */}
        <Modal asset={asset}/>


        <button className='shellBtn' onClick={deleteAsset}>
          <DeleteIcon></DeleteIcon>
        </button>
      </div>
    </div>
  );
  
}
  
  
//Main view of the card
function MainInfo({c, ts, priceIncrCond}: {c: Crypto, ts: number, priceIncrCond: boolean}){
  const d = new Date(ts)
  const pctIncrCond: boolean = Number(c.changePercent24Hr) > 0;


    return(
      <div className='card'>
        <h1 className='cardText'>{c.name}</h1> 
        <h1 className={priceIncrCond ? 'cardPrice priceUp' : 'cardPrice priceDown'}>{
          (Number(c.priceUsd) < 0.01)? Number(c.priceUsd).toFixed(3) 
                                  : Number(c.priceUsd).toFixed(2)} $</h1>
        <h3 className={ pctIncrCond? 'cardPct priceUp' : 'cardPct priceDown'}>{pctIncrCond? '+' : ''}{Number(c.changePercent24Hr).toPrecision(2)}%</h3>
        <p className='cardDate'>Last update: {d.toLocaleTimeString()}</p>
      </div>
    );
}