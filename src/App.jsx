import React, {PureComponent} from "react";
import sc from './App.module.scss';
export default class App extends PureComponent {
    render() {
        return <div className={sc.grid}>this is app</div>
    }
}
