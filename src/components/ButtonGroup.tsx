import * as ToggleGroup from '@radix-ui/react-toggle-group';
import './Card.css'
import { useState } from 'react';

export function ButtonGroup(){
    const [value, setValue] = useState('Under');

    return(
        <ToggleGroup.Root 
            className="ToggleGroup" id ="ToggleGroup" type="single" 
            value={value} aria-label="Text alignment"
            onValueChange={(value) => {if (value) setValue(value)}}
        >
            <ToggleGroup.Item className={`btn btn-outline-danger ToggleGroupItem ${value === "Under"? 'active' : ''}`} name ='Under' value="Under">
                Under
            </ToggleGroup.Item>
            <ToggleGroup.Item className={`btn btn-outline-success ToggleGroupItem ${value === "Over"? 'active' : ''}`} name ='Over' value="Over">
                Over
            </ToggleGroup.Item>

        </ToggleGroup.Root>
    );
}