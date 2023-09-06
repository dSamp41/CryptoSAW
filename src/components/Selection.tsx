import { useContext, useState } from 'react';
import Select, { MultiValue } from "react-select";
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConf';
import { getAuth } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { AssetsContext, UserContext } from '@/AppContext';
import { sendNotification } from '@/main';

import './Selection.css'

interface MyOption{
  label: string;
  value: string
}

const toTitleCase = (s: string) => (s.charAt(0).toUpperCase() + s.slice(1))

function arrToOption(arr: string[]): MyOption[]{
  return arr.map( (el) => ({label: toTitleCase(el), value: el}) );
}


export default function Selection(){
    const ASSETS: string[] = useContext(AssetsContext);
    const OPTIONS: MyOption[] = arrToOption(ASSETS);

    const userAssets: string[] = useContext(UserContext);
    const defaultVal: MyOption[] = arrToOption(userAssets);

    const [selectedVals, setSelectedVals] = useState<MyOption[]>([]); //useRef????
    const navigate = useNavigate();

    function handleChange(selectedOptions: MultiValue<MyOption>){
        setSelectedVals(selectedOptions as MyOption[]);
    }

    // Convert the state selectedVals to match the required format for react-select
    const selectedOptions = selectedVals.map((v) => ({
        value: v.value,
        label: v.label,
    }));
    
    // Send selectedOpts into "asset" field in users/*user.id*
    async function sendNewAssets(){
        const newArr: string[] = selectedOptions.map((el) => (el.value))
        const auth = getAuth();
        const user = auth.currentUser;
        
        if(user){
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                const oldAssets: string[] = docSnap.data().assets;

                for(const el of newArr){
                    const elemInDb: boolean = oldAssets.includes(el);
                    if(elemInDb === false){
                        await updateDoc(docRef, {assets: arrayUnion(el)})
                    } 
                }
            }
        }
        
        sendNotification("The selected assets have been added to your wallet");
        navigate('/wallet');
    }

    return(<>
        <Select
            defaultValue={defaultVal}
            
            value={selectedOptions}
            closeMenuOnSelect={false}
            isMulti
            name="crypto"
            options={OPTIONS}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleChange}
        />

        <Link to="/wallet"><button className="confBtn" onClick={sendNewAssets}>CONFIRM</button></Link>
    </>);
}
