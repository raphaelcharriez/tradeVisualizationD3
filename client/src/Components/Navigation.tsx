/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import {
    Button,
    Classes,
    Navbar,
    Icon,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import '../App.css'; 

export interface IState {
}

export interface IProps {
    showCountriesPannel: boolean; 
    showProductPannel: boolean;
    mapProjection: string;
    handleClickDisplayCountryPannel: () => void;
    handleClickDisplayProductPannel: () => void;
    handleClick3d: () => void
    handleClick2d: () => void
}

export class NavbarExample extends React.PureComponent<IProps, IState> {
    
    public render() {
        
        return (
            <Navbar style={{width: "100%"}} className={`${Classes.NAVBAR} ${Classes.DARK}`}>
              <div className={`${Classes.NAVBAR_GROUP} ${Classes.ALIGN_LEFT}`}>
                <div className={Classes.NAVBAR_HEADING}>
                  <Icon icon={IconNames.GLOBE_NETWORK} iconSize={Icon.SIZE_LARGE}></Icon>
                  <span>{" "}Global Trade Dependencies</span>
                </div>
              
                <div className={`${Classes.NAVBAR_GROUP} ${Classes.ALIGN_RIGHT}`}>
                  <Button className={`${Classes.BUTTON} ${Classes.MINIMAL} button` }>
                    <Icon icon={IconNames.LIGHTBULB} iconSize={Icon.SIZE_STANDARD}></Icon>
                    <span>{" "}Documentation</span>
                  </Button>
                  <span className={Classes.NAVBAR_DIVIDER} ></span>
                  <Button 
                    className={`${Classes.BUTTON} ${Classes.MINIMAL} button`}
                    active={this.props.showProductPannel}
                    onClick={this.props.handleClickDisplayProductPannel}
                  >
                    <Icon icon={IconNames.PIE_CHART} iconSize={Icon.SIZE_STANDARD}></Icon>
                    <span>{" "}Product Pannel</span>
                  </Button>
                  <Button 
                    className={`${Classes.BUTTON} ${Classes.MINIMAL} button`}
                    active={this.props.showCountriesPannel}
                    onClick={this.props.handleClickDisplayCountryPannel}
                  >
                    <Icon icon={IconNames.SWAP_HORIZONTAL} iconSize={Icon.SIZE_STANDARD}></Icon>
                    <span>{" "}Countries Pannel</span>
                  </Button> 
                  <span className={Classes.NAVBAR_DIVIDER} ></span>
                  <Button 
                    className={`${Classes.BUTTON} ${Classes.MINIMAL} button`}
                    active={this.props.mapProjection === "3d"}
                    onClick={this.props.handleClick3d}
                  >
                    <Icon icon={IconNames.GLOBE} iconSize={Icon.SIZE_STANDARD}></Icon>
                    <span>{" "}Globe View</span>
                  </Button>  
                  <Button 
                    className={`${Classes.BUTTON} ${Classes.MINIMAL} button`}
                    active={this.props.mapProjection === "2d"}
                    onClick={this.props.handleClick2d}
                  >
                    <Icon icon={IconNames.MAP} iconSize={Icon.SIZE_STANDARD}></Icon>
                    <span>{" "}Map View</span>
                  </Button>
                </div>
              </div>
            </Navbar>
        );
    }
}