import * as React from "react";

import { Button, MenuItem } from "@blueprintjs/core";
import { ItemRenderer, MultiSelect } from "@blueprintjs/select";
import {
    IProduct    
} from "../Types/index"

const ProductMultiSelect = MultiSelect.ofType<IProduct>();

export interface IState {
}

export interface IProps {
    id: string;
    data: IProduct[];
    selectedProducts: IProduct[];
    selectProducts: (productsToSelect: IProduct[]) => void
    deselectProduct: (index: number) => void
    handleClearProducts: () => void
}

            

export class MultiSelectProduct extends React.PureComponent<IProps, IState> {

    public state =  {
        allowCreate: false,
        createdItems: [],
        fill: false,
        hasInitialContent: false,
        intent: false,
        openOnKeyDown: false,
        popoverMinimal: true,
        resetOnSelect: true,
        tagMinimal: false,
    };

    public render() {
        const { allowCreate, hasInitialContent, tagMinimal, popoverMinimal, ...flags } = this.state;
        const clearButton =
            this.props.selectedProducts.length > 0 ? <Button icon="cross" minimal={true} onClick={this.props.handleClearProducts} /> : undefined;

        return (
                <ProductMultiSelect
                    {...flags}
                    fill={true}
                    initialContent={undefined}
                    itemRenderer={this.renderProduct}
                    itemsEqual={(pA: IProduct, pB: IProduct) => { return pA.commodityCode === pB.commodityCode}}
                    items={this.props.data}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleProductSelect}
                    onItemsPaste={this.handleProductPaste}
                    popoverProps={{ minimal: true }}
                    tagRenderer={this.renderTag}
                    selectedItems={this.props.selectedProducts}
                />

        );
    }

    private renderTag = (product: IProduct) => product.commodityCode;

    private renderProduct: ItemRenderer<IProduct> = (product, { modifiers, handleClick }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                icon={this.isProductSelected(product) ? "tick" : "blank"}
                key={product.commodityCode}
                onClick={handleClick}
                text={`${product.commodityCode}. ${product.commodity}`}
                shouldDismissPopover={false}
            />
        );
    };


    private getSelectedProductIndex(product: IProduct) {
        return this.props.selectedProducts.indexOf(product);
    }

    private isProductSelected(product: IProduct) {
        return this.getSelectedProductIndex(product) !== -1;
    }

    private selectProduct(product: IProduct) {
        this.props.selectProducts([product]);
    }

    private handleProductSelect = (product: IProduct) => {
        if (!this.isProductSelected(product)) {
            this.selectProduct(product);
        } else {
            this.props.deselectProduct(this.getSelectedProductIndex(product));
        }
    };

    private handleProductPaste = (product: IProduct[]) => {
        this.props.selectProducts(product);
    };

    
}
