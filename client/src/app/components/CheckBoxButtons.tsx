import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props{
    items: string[];
    checked: string[];
    onChange: (items:string[]) => void;
}

export default function CheckBoxButtons({ items, checked, onChange }: Props) {

    const [checkedItems, setCheckedItems] = useState(checked || []);

    function handleChecked(value: string){
        const currentIndex = checkedItems.findIndex(i => i === value);

        let newChecked: string[] = [];

        if(currentIndex == -1){
            newChecked = [...checkedItems, value];
        }else{
            newChecked = checkedItems.filter(i => i !== value);
        }

        setCheckedItems(newChecked);
        onChange(newChecked);
    }

    return (
        <FormGroup sx={{ mb: 2, p: 2 }}>
            {items.map(item => (
                <FormControlLabel control={<Checkbox checked={checkedItems.indexOf(item) !== -1} onClick={() => handleChecked(item)} />} 
                    label={item} key={item} />
            ))}
        </FormGroup>
    )
}