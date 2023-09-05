import { CardElem } from './Card';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '@/AppContext';

import './Wallet.css';

function CardView({ assets }: { assets: string[] }){
    return(
        <ScrollArea.Root className="ScrollAreaRoot">
            <ScrollArea.Viewport className="ScrollAreaViewport">
                <div style={{ padding: '15px 20px' }}>
                    <div className="Text">My Coins</div>
                    
                    <div className='cardsArea'>
                        {assets.map((tag) => (<CardElem key={tag} asset={tag}/>))}
                    </div>

                </div>
            </ScrollArea.Viewport>

            <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
                <ScrollArea.Thumb className="ScrollAreaThumb" />
            </ScrollArea.Scrollbar>

            <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
            
            <ScrollArea.Thumb className="ScrollAreaThumb" />
                </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="ScrollAreaCorner" />
        </ScrollArea.Root>

    );
}

export default function Wallet(){
    const userAssets = useContext(UserContext);

    return(<>
        <p>Welcome in the Personal Area.<br></br>This is your Wallet.</p>
        <CardView assets={userAssets}/>
        <Link to="/selection">
            <button className='addBtn'>ADD MORE</button>
        </Link>
    </>);

}