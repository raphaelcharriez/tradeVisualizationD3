import * as React from "react";

import { Button, MenuItem } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer, Select } from "@blueprintjs/select";
import {
    ICountry,
} from "../Types/index";

// Select<T> is a generic component to work with your data types.
// In TypeScript, you must first obtain a non-generic reference:

export interface IProps {
    selectedCountry: ICountry;
    countries: ICountry[];
    selectCountry: (countryToSelect: ICountry) => void;
}

export function CountrySelect(props: IProps) {

    const TypedSelect = Select.ofType<ICountry>();

    const renderCountry: ItemRenderer<ICountry> = (country, { modifiers, handleClick }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                icon="blank"
                key={`${country.countryCode}. ${country.country}`}
                onClick={handleClick}
                text={`${country.countryCode}. ${country.country}`}
                shouldDismissPopover={false}
            />
        );
    };

    const filterCountry: ItemPredicate<ICountry> = (query, country, index, exactMatch) => {
        const normalizedTitle = country.country.toLowerCase();
        const normalizedCountryCode = country.countryCode.toLowerCase();
        const normalizedQuery = query.toLowerCase();

        return `${normalizedTitle}.  ${normalizedCountryCode}`.indexOf(normalizedQuery) >= 0;

    };

    return (
        <div >
            <TypedSelect
                items={props.countries}
                itemRenderer={renderCountry}
                itemPredicate={filterCountry}
                noResults={<MenuItem disabled={true} text="No results." />}
                onItemSelect={props.selectCountry}
            >
            <Button
                text={props.selectedCountry.countryCode}
                rightIcon="double-caret-vertical"
                style={{width: "180px"}}
            />
            </TypedSelect>
        </div>

    );

}
