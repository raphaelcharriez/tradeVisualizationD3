import { Component } from 'react';
import './App.css';
import WorldMap from './Components/WorldMap'
import countriesShape from './Data/Constants/WorldMapCountriesShape'
import { Classes, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { callCountryBalanceAPI, callProductAPI, callTradeAPI, callCountryImportsAPI, callCountryExportsAPI } from './Data/Server/getData'
import { MultiSelectProduct } from './Components/MultiSelect'; 
import { NavbarExample } from "./Components/Navigation";
import  TradeFlower from "./Components/TradeFlower";
import { CountrySelect } from "./Components/CountrySelect";
import React from 'react';
import { IProduct, ICountry } from "./Types/index"
import { convertProduct } from "./Data/Server/converters"

const appdata = countriesShape.features

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
  focusedReporter: ICountry,
  focusedPartner: ICountry,
  focusedReporterImports: any[],
  focusedReporterExports: any[],
  showCountriesPannel: boolean,
  showProductPannel: boolean, 
  mapProjection: string
}

class App extends Component<IProps, IState> {
  constructor(props: IProps){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.selectHoveredCountry = this.selectHoveredCountry.bind(this)
    this.onBrush = this.onBrush.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.state = { 
      screenWidth: 1000,
      screenHeight: 800,
      hover: "none",
      brushExtent: [0,40],
      deltaPosition: [0,0,0],
      products: [],
      selectedProducts: [{commodity: "Live poultry", commodityCode: "0105"}],
      trades: [],
      countryBalance: [],
      selectedCountries: [],
      focusedReporter: {country: "Italie", countryCode: "ITA"},
      focusedPartner: {country: "Spain", countryCode: "ESP"},
      focusedReporterExports: [],
      focusedReporterImports: [], 
      showCountriesPannel: true,
      showProductPannel: true, 
      mapProjection: "3d"
    }
  }
  
  componentDidMount() {
      // Call our fetch function below once the component mounts
    callProductAPI()
      .then(res => this.setState({ products: res.data.map((rawProduct: { commodity_code: string; commodity: string; }) => convertProduct(rawProduct))}))
      .catch(err => console.log(err));

    callTradeAPI(this.state.selectedProducts.map(p => p.commodityCode))
      .then(res => this.setState({ trades: res.data}))
      .catch(err => console.log(err));

    callCountryBalanceAPI(this.state.selectedProducts.map(p => p.commodityCode))
      .then(res => this.setState({ countryBalance: res.data}))
      .catch(err => console.log(err));

    callCountryImportsAPI(this.state.focusedReporter.countryCode, this.state.focusedPartner.countryCode)
      .then(res => this.setState({ focusedReporterImports: res.data}))
      .catch(err => console.log(err));

    callCountryExportsAPI(this.state.focusedReporter.countryCode, this.state.focusedPartner.countryCode)
      .then(res => this.setState({ focusedReporterExports: res.data}))
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

    if (prevState.focusedReporter !== this.state.focusedReporter || prevState.focusedPartner !== this.state.focusedPartner){
      callCountryImportsAPI(this.state.focusedReporter.countryCode, this.state.focusedPartner.countryCode)
        .then(res => this.setState({ focusedReporterImports: res.data}))
        .catch(err => console.log(err));
      callCountryExportsAPI(this.state.focusedReporter.countryCode, this.state.focusedPartner.countryCode)
        .then(res => this.setState({ focusedReporterExports: res.data}))
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

  selectFocusedReporter = (countryToSelect: ICountry) => {
    this.setState({
      focusedReporter: countryToSelect,
      hover: countryToSelect.countryCode
    });
  }
  selectFocusedPartner = (countryToSelect: ICountry) => {
    this.setState({
      focusedPartner: countryToSelect
    });
  } 
  handleClickDisplayCountryPannel = () => {
    this.setState({
      showCountriesPannel: !this.state.showCountriesPannel
    })
  }
  handleClickDisplayProductPannel = () => {
    this.setState({
      showProductPannel: !this.state.showProductPannel
    })
  }
  handleClick3d = () => {
    this.setState({
      mapProjection: "3d"
    })
  }
  handleClick2d = () => {
    this.setState({
      mapProjection: "2d"
    })
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

  selectHoveredCountry(d: string) {
    this.setState({ hover: d })
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
    const countriesShape = appdata
    const productPannel = <div style={{position: "absolute", zIndex: 1, top: 180 + 25 * (this.state.selectedProducts.length > 1 ? this.state.selectedProducts.length -1 : 0), left: 20, background:"#394B5950", width: "300px", border: "5px solid #394B5950", borderRadius: "5px", display: this.state.showProductPannel?"":"none"}}>
    <Icon icon={IconNames.IMPORT} iconSize={Icon.SIZE_STANDARD}></Icon>
    <span>{" Top Exporters"}</span>
    <div>
      <TradeFlower
        countryBalance={(this.state.countryBalance)}
        selectedCountry={this.state.focusedReporter}
        name={{name: "reporter_iso", value: "export_value", label: "reporter_iso"}}
        id={"tf_export"}
        width={260}
        height={180}
        listen={this.state.showProductPannel}
        onClick={this.selectFocusedReporter}
        />
    </div>
    <br/>
    <Icon icon={IconNames.EXPORT} iconSize={Icon.SIZE_STANDARD}></Icon>
    <span>{" Top Importers"}</span>
    <div>
    <TradeFlower
      countryBalance={(this.state.countryBalance)}
      selectedCountry={this.state.focusedReporter}
      name={{name: "reporter_iso", value: "import_value", label: "reporter_iso"}}
      id={"tf_import"}
      width={260}
      height={180}
      listen={this.state.showProductPannel}
      onClick={this.selectFocusedReporter}
    />
    </div>
    <br/>
  </div>



  const countriesPannel = <div style={{position: "absolute", zIndex: 1, top: 80, right: 40, background:"#394B5950", width: "500px", border: "5px solid #394B5950", borderRadius: "5px", display: this.state.showCountriesPannel?"":"none"}}>
            
    <div style={{width: "40%", float: "left"}}>
    <Icon icon={IconNames.MANUALLY_ENTERED_DATA} iconSize={Icon.SIZE_STANDARD}></Icon>
    <span>{" Select Reporter Country"}</span>
    <CountrySelect
    selectedCountry={this.state.focusedReporter}
    selectCountry={this.selectFocusedReporter}
    countries={countriesShape.map(c => {return {country: c.properties.name, countryCode: c.id}})}
    />
    </div>
    <div style={{width: "40%", float: "right"}}>
    <Icon icon={IconNames.FLOW_REVIEW} iconSize={Icon.SIZE_STANDARD}></Icon>
    <span>{" Select Partner Country"}</span>
    <CountrySelect
      selectedCountry={this.state.focusedPartner}
      selectCountry={this.selectFocusedPartner}
      countries={countriesShape.map(c => {return {country: c.properties.name, countryCode: c.id}})}
    />
    </div>
    <div>
    <br/><br/>
    <TradeFlower
      countryBalance={(this.state.focusedReporterImports)}
      products={this.state.products}
      name={{name: "commodity_code", value: "trade_value", label: "commodity"}}
      id={"partnership_import"}
      width={520}
      height={300}
      trade={true}
      selectProducts={this.selectProducts}
      clearProducts={this.handleClearProducts}
    />
    <TradeFlower
      countryBalance={(this.state.focusedReporterExports)}
      products={this.state.products}
      name={{name: "commodity_code", value: "trade_value", label: "commodity"}}
      id={"partnership_export"}
      width={520}
      height={300}
      trade={true}
      selectProducts={this.selectProducts}
      clearProducts={this.handleClearProducts}
    />
    </div>
</div>    
    return (
   
       
      <div className={`${"App"} ${Classes.DARK}`} style={{position: "relative", width: this.state.screenWidth, height: this.state.screenHeight +50, backgroundColor: "#0d0d0d"}}>
        <NavbarExample
            showCountriesPannel={this.state.showCountriesPannel}
            showProductPannel={this.state.showProductPannel}
            mapProjection={this.state.mapProjection}
            handleClickDisplayCountryPannel={this.handleClickDisplayCountryPannel}
            handleClickDisplayProductPannel={this.handleClickDisplayProductPannel}
            handleClick3d={this.handleClick3d}
            handleClick2d={this.handleClick2d}
        />
        <div style={{position: "absolute", zIndex: 0}}>
        <WorldMap 
            hoverElement={this.state.hover}
            onHover={this.selectHoveredCountry}
            onClick={this.selectFocusedReporter}
            selectedCountry={this.state.focusedReporter}
            data={countriesShape}
            size={[this.state.screenWidth *1.0, this.state.screenHeight]}
            position={this.state.deltaPosition}
            handleDrag={this.handleDrag}
            links={generateLinks(this.state.trades)}
            countryBalance={(this.state.countryBalance)}
            projection={this.state.mapProjection}
        />
        </div>
        <div style={{position: "absolute", zIndex: 1, top: 80, left: 20, background:"#394B59", width: "300px", border: "5px solid #394B59", borderRadius: "5px"}}> 
          <Icon icon={IconNames.BARCODE} iconSize={Icon.SIZE_STANDARD}></Icon>
          <span>{" Select Products"}</span>
          <MultiSelectProduct
            id={"multiSelectP"}
            data={this.state.products}
            selectedProducts = {this.state.selectedProducts}
            selectProducts = {this.selectProducts}
            deselectProduct = {this.deselectProduct}
            handleClearProducts = {this.handleClearProducts}
          />
        </div>
        {productPannel}
        {countriesPannel} 
      </div>

    );
  }
}

export default App;
