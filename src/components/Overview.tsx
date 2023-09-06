import { useContext, useEffect, useState } from "react";
import { AssetResponse, Crypto, RespToCrypto, START_CRYPTO, headers } from './cryptoUtil.ts';
import { usePrevious } from "@/hooks/usePrevious.ts";
import { AssetsContext } from "@/AppContext.ts";

import './Overview.css'
import './Card.css'


function Row({ asset }: { asset: string}){
    const [cryptoData, setCryptoData] = useState<Crypto>(START_CRYPTO);
    const oldValue = usePrevious<Crypto>(cryptoData, START_CRYPTO);
 
    const getCryptoInfo = () => {
        /*const response = await fetch(`https://api.coincap.io/v2/assets/${asset}`);
        const jsonData = await response.json();
        
        setCryptoData(jsonData.data as Crypto);*/
        fetch(`https://api.coincap.io/v2/assets/${asset}`, {method: "GET", headers: headers})
            .then( (resp) => resp.json())
            .then( (json: AssetResponse) => setCryptoData(RespToCrypto(json.data)))  
            .catch( (err) => console.error(err));
    };

    useEffect(() => {
        getCryptoInfo();
        const int = setInterval( () => getCryptoInfo(), 10000);

        return () => {clearInterval(int)}   //stop api calls when component get unmounted
    }, []);

    const priceIncrCond: boolean = (cryptoData.priceUsd - oldValue.priceUsd) > 0;
    const changeIncr24Hr: boolean = cryptoData.changePercent24Hr > 0;

    if(cryptoData === START_CRYPTO) return(<></>);
    return(
        <tr key={asset}>
            <td key={asset+'Title'}>
                <span className="name" key={asset+'Name'}>{cryptoData?.name}</span> 
                <span className="symbol" key={asset+'Sym'}> ({cryptoData?.symbol})</span>
            </td>
                
            <td className={priceIncrCond ? 'priceUpAnim' : 'priceDownAnim'} key={asset+'Price'}>{Number(cryptoData?.priceUsd).toFixed(3)}$</td>
            <td className={changeIncr24Hr ? 'priceUpAnim' : 'priceDownAnim'} key={asset+'Pct'}>{changeIncr24Hr? '+' : ''}{Number(cryptoData?.changePercent24Hr).toFixed(2)}%</td>
            <td key={asset+'Cap'}>{(cryptoData?.marketCapUsd/10**9).toFixed(2)}B$</td>
        </tr>
    );
}

export default function Overview() {
    const ALL_ASSETS = useContext(AssetsContext);

    return (
    <div className="BT table-responsive">
        <table className="table table-hover">
            <thead key='thead'>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Change</th>
                    <th>Market Cap</th>
                </tr>
            </thead>

            <tbody key='tbody' className="table-group-divider">
                {ALL_ASSETS.slice(0, 50).map( ( el: string ) => (<Row asset={el} key={el}/>))}
            </tbody>
        </table>
    </div>
    );
}