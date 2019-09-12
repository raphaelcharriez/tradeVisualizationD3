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
    Alignment,
    Button,
    Classes,
    H5,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Switch,
    Icon,
} from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";
 

export class NavbarExample extends React.PureComponent {
    

    public render() {
        const alignRight =  true ;
        
        return (
           
                <Navbar className={`${Classes.NAVBAR} ${Classes.DARK}`}>
           
                  <div className={`${Classes.NAVBAR_GROUP} ${Classes.ALIGN_LEFT}`}>
                    <div className={Classes.NAVBAR_HEADING}>Trade</div>
             
                  <div className={`${Classes.NAVBAR_GROUP} ${Classes.ALIGN_RIGHT}`}>
                    <Button className={`${Classes.BUTTON} ${Classes.MINIMAL}`}> 
<Icon icon={IconNames.GRAPH} iconSize={Icon.SIZE_STANDARD}></Icon><span>Home</span> </Button>
                    <Button className={`${Classes.BUTTON} ${Classes.MINIMAL}`}><Icon icon={IconNames.DOCUMENT} iconSize={Icon.SIZE_STANDARD}></Icon><span>Document</span></Button>
                    <span className={Classes.NAVBAR_DIVIDER} ></span>
                    <Button className={`${Classes.BUTTON} ${Classes.MINIMAL}`}><Icon icon={IconNames.USER} iconSize={Icon.SIZE_STANDARD}></Icon> </Button>
                    <Button className={`${Classes.BUTTON} ${Classes.MINIMAL}`}><Icon icon={IconNames.NOTIFICATIONS} iconSize={Icon.SIZE_STANDARD}></Icon> </Button>
                    <Button className={`${Classes.BUTTON} ${Classes.MINIMAL}`}><Icon icon={IconNames.COG} iconSize={Icon.SIZE_STANDARD}></Icon> </Button>
                  </div>
                </div>
              </Navbar>
        );
    }
}