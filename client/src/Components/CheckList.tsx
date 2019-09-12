import * as React from "react";

import { Alignment, Checkbox, Label } from "@blueprintjs/core";



export interface IProps {
    countryBalance: any[];
    selectedCountries: string[];
    metric: string;
    display: number;
    label: string;
}

export function CheckboxExample (props: IProps) {

    const conf = {
        alignIndicator: Alignment.LEFT,
        disabled: false,
        inline: false,
        large: false,
    };

    const topExporters = props.countryBalance.sort(
        (a, b) => (a.export_value < b.export_value) ? 1 : -1
    ).slice(0, props.display-1) 
    
    const checkboxes = topExporters.map( (e, i)=> {
        return(
         
            <Checkbox {...conf} key={i} label={e.reporter_iso + ' ' + e.export_value }/>
            
        )
    })
    
    
    return (
            <div>    
                <Label>{props.label}</Label>
                {props.countryBalance.length}{' '}{topExporters.length} {' '} {checkboxes.length}
          
                {checkboxes}
            
            </div>
    );

    
}