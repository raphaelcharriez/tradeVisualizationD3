import { Component } from 'react';
import './App.css';
import WorldMap from './Components/WorldMap'
import countriesShape from './Data/Constants/WorldMapCountriesShape'
import { range } from 'd3-array'
import { scaleThreshold } from 'd3-scale'
import { callCountryBalanceAPI, callProductAPI, callTradeAPI} from './Data/Server/getData'
import { MultiSelectProduct } from './Components/MultiSelect'; 
import { NavbarExample } from "./Components/Navigation";
import { CheckboxExample } from "./Components/CheckList";
import { StatisticsTable } from "./Components/StatisticsTable";
import React from 'react';
import {
  IProduct    
} from "./Types/index"
import {
  convertProduct
} from "./Data/Server/converters"
const appdata = countriesShape.features

appdata
  .forEach((d: any,i) => {
    const offset = Math.random()
    d.launchday = i
    d.data = range(30).map((p,q) => q < i ? 0 : Math.random() * 2 + offset)
  })


function generateLinks(data: any) {
  var links = []
  for (var i =0; i< 200 ; i++){
    if (data[i] && data[i].partner_longitude && data[i].reporter_longitude && data[i].partner_iso != "WLD" ){
        links.push({
          type: "LineString",
          coordinates: [
              [data[i].reporter_latitude, data[i].reporter_longitude],
              [data[i].partner_latitude , data[i].partner_longitude]
          ],
          value: parseInt(data[i].trade_value)
      })
    }
  }
  return links
}

export interface IProps {
}

export interface IState {
  screenWidth: number,
  screenHeight: number,
  hover: string,
  brushExtent: number[],
  deltaPosition: number[],
  products: IProduct[],
  selectedProducts: IProduct[],
  trades: any[],
  countryBalance: any[],
  selectedCountries: string[],
}

class App extends Component<IProps, IState> {
  constructor(props: IProps){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.onHover = this.onHover.bind(this)
    this.onBrush = this.onBrush.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.state = { 
      screenWidth: 1000,
      screenHeight: 800,
      hover: "none",
      brushExtent: [0,40],
      deltaPosition: [0,0,0],
      products: [],
      selectedProducts: [],
      trades: [],
      countryBalance: [],
      selectedCountries: []
    }
  }
  
  componentDidMount() {
      // Call our fetch function below once the component mounts
    callProductAPI()
      .then(res => this.setState({ products: res.data.map((rawProduct: { commodity_code: string; commodity: string; }) => convertProduct(rawProduct))}))
      .catch(err => console.log(err));
    

    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) { 

    if (prevState.selectedProducts !== this.state.selectedProducts){
      callTradeAPI(this.state.selectedProducts.map(p => p.commodityCode))
        .then(res => this.setState({ trades: res.data}))
        .catch(err => console.log(err));

      callCountryBalanceAPI(this.state.selectedProducts.map(p => p.commodityCode))
        .then(res => this.setState({ countryBalance: res.data}))
        .catch(err => console.log(err));
    }
  }

  selectProducts = (productsToSelect: IProduct[]) => {
    const selectedProducts = this.state.selectedProducts;
    let nextProducts = selectedProducts.slice();
    productsToSelect.forEach(product => {
      // Avoid re-creating an item that is already selected (the "Create
      // Item" option will be shown even if it matches an already selected
      // item).
      nextProducts = !nextProducts.some((p: IProduct) => p.commodity === product.commodity) ? [...nextProducts, product] : nextProducts;
    });    
    this.setState({
        selectedProducts: nextProducts
    });
  }

  deselectProduct = (index: number) => {
    const { selectedProducts } = this.state;
      this.setState({
        selectedProducts: selectedProducts.filter((_product, i) => i !== index),
      });
  }

  handleClearProducts = () => this.setState({ selectedProducts: [] });


  onResize() {
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight })
  }

  onHover(d: any) {
    this.setState({ hover: d.id })
  }
  
  handleDrag(e: any, ui: any) {
    const [x, y, z] = this.state.deltaPosition;
    this.setState({
      deltaPosition: [ x + ui.deltaX/3, y - ui.deltaY /3, z]
    });
  }

  onBrush(d: any) {
    this.setState({ brushExtent: d })
  }

  render() {
    const filteredAppdata = appdata
    return (
      <div>
        <NavbarExample/>
        <div className="App">
          
          <div className="column left"> 

            {"Product Selection"}
            
            <MultiSelectProduct
              id={"multiSelectP"}
              data={this.state.products}
              selectedProducts = {this.state.selectedProducts}
              selectProducts = {this.selectProducts}
              deselectProduct = {this.deselectProduct}
              handleClearProducts = {this.handleClearProducts}
            />

            {"Top Exporters"}
            <StatisticsTable 
              countryBalance={(this.state.countryBalance)}
              selectedCountries={(this.state.selectedCountries)}
              metric={"export_value"}
              display={10}
              label={"Exports"}
            />

            {"Top Importers"}
            <StatisticsTable 
              countryBalance={(this.state.countryBalance)}
              selectedCountries={(this.state.selectedCountries)}
              metric={"import_value"}
              display={10}
              label={"Imports"}
            />
          </div>
          <div className="column right"> 
            <WorldMap 
              hoverElement={this.state.hover}
              onHover={this.onHover}
              data={filteredAppdata}
              size={[this.state.screenWidth * 0.7, this.state.screenHeight]}
              position={this.state.deltaPosition}
              handleDrag={this.handleDrag}
              links={generateLinks(this.state.trades)}
              countryBalance={(this.state.countryBalance)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
