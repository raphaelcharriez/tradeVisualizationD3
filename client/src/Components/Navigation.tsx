import * as React from "react";

import {
    Button,
    Classes,
    Icon,
    Navbar,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import "../App.css";

export interface IProps {
    showCountriesPannel: boolean;
    showProductPannel: boolean;
    mapProjection: string;
    handleClickDisplayCountryPannel: () => void;
    handleClickDisplayProductPannel: () => void;
    handleClick3d: () => void;
    handleClick2d: () => void;
}

export class NavbarExample extends React.PureComponent<IProps, {}> {

    public render() {

        return (
            <Navbar style={{width: "100%"}} className={`${Classes.NAVBAR} ${Classes.DARK}`}>
              <div className={`${Classes.NAVBAR_GROUP} ${Classes.ALIGN_LEFT}`}>
                <div className={Classes.NAVBAR_HEADING}>
                  <Icon icon={IconNames.GLOBE_NETWORK} iconSize={Icon.SIZE_LARGE}/>
                  <span>{" "}Global Trade Dependencies</span>
                </div>

                <div className={`${Classes.NAVBAR_GROUP} ${Classes.ALIGN_RIGHT}`}>
                  <Button className={`${Classes.BUTTON} ${Classes.MINIMAL} button`}>
                    <Icon icon={IconNames.LIGHTBULB} iconSize={Icon.SIZE_STANDARD}/>
                    <span>{" "}Documentation</span>
                  </Button>
                  <span className={Classes.NAVBAR_DIVIDER} />
                  <Button
                    className={`${Classes.BUTTON} ${Classes.MINIMAL} button`}
                    active={this.props.showProductPannel}
                    onClick={this.props.handleClickDisplayProductPannel}
                  >
                    <Icon icon={IconNames.PIE_CHART} iconSize={Icon.SIZE_STANDARD}/>
                    <span>{" "}Product Pannel</span>
                  </Button>
                  <Button
                    className={`${Classes.BUTTON} ${Classes.MINIMAL} button`}
                    active={this.props.showCountriesPannel}
                    onClick={this.props.handleClickDisplayCountryPannel}
                  >
                    <Icon icon={IconNames.SWAP_HORIZONTAL} iconSize={Icon.SIZE_STANDARD}/>
                    <span>{" "}Countries Pannel</span>
                  </Button>
                  <span className={Classes.NAVBAR_DIVIDER} />
                  <Button
                    className={`${Classes.BUTTON} ${Classes.MINIMAL} button`}
                    active={this.props.mapProjection === "3d"}
                    onClick={this.props.handleClick3d}
                  >
                    <Icon icon={IconNames.GLOBE} iconSize={Icon.SIZE_STANDARD}/>
                    <span>{" "}Globe View</span>
                  </Button>
                  <Button
                    className={`${Classes.BUTTON} ${Classes.MINIMAL} button`}
                    active={this.props.mapProjection === "2d"}
                    onClick={this.props.handleClick2d}
                  >
                    <Icon icon={IconNames.MAP} iconSize={Icon.SIZE_STANDARD}/>
                    <span>{" "}Map View</span>
                  </Button>
                </div>
              </div>
            </Navbar>
        );
    }
}
