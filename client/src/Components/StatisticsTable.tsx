import { Classes, FormGroup, HTMLTable, Icon, Intent } from "@blueprintjs/core";
import React from "react";

interface IProps {
    countryBalance: any[];
    selectedCountries: string[];
    metric: string;
    display: number;
    label: string;
}

export function StatisticsTable(props: IProps) {

    const topExporters: Array<{reporter_iso: string, export_value: number, import_value: number}>
            = props.countryBalance.sort(
                (a, b) => ( a[props.metric] < b[props.metric] ? 1 : -1
                )).slice(0, props.display - 1);

    const dataRows = prepareTableRows(topExporters, props.metric);

    const tableBody = dataRows.map((row) => {
        return(
            <tr key={row.countryCode}>
                <td style={{width: "10%"}}>{row.action}</td>
                <td style={{width: "30%"}}>{row.country}</td>
                <td style={{width: "30%"}}>{row.value}</td>
            </tr>
        );
    });

    return (
        <div>
            <HTMLTable bordered={true} condensed={true} striped={true}>
                <thead>
                    <tr>
                        <th>{""}</th>
                        <th>{"Country"}</th>
                        <th>{props.label}</th>
                    </tr>
                </thead>
                <tbody>{tableBody}</tbody>
            </HTMLTable>
        </div>
    );

}

function prepareTableRows(
    topExporters: Array<{reporter_iso: string, export_value: number, import_value: number}>,
    metric: string,
) {
    const rows: Array<{
        countryCode: string,
        rawValue: number,
        action: JSX.Element,
        country: JSX.Element,
        value: JSX.Element,
    }> = [];

    topExporters.forEach( (e) => {
        const val = metric === "export_value" ? e.export_value : e.import_value;

        const action = <div> > </div>;

        const country = <div> {e.reporter_iso}</div>;

        const value = <div> {val} {"USD"}</div>;
        rows.push({
            action,
            country,
            countryCode: e.reporter_iso,
            rawValue: val,
            value,
        });
    },
    );

    return rows;
}
