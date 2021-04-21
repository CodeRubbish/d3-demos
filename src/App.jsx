import React, {PureComponent} from "react";
import css from './App.module.scss';
import * as d3 from 'd3'

const arr = d3.schemeCategory10;
export default class App extends PureComponent {
    render() {
        return <div className={css.grid}>
            {arr.map((d, i) => <div className={css.block} style={{background: d}} key={i}>{i + 1}</div>)}
        </div>
    }

}
