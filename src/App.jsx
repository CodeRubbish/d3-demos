import React, {PureComponent} from "react";
import css from './App.module.scss';
import * as d3 from 'd3'
import BarChart from "./demos/BarChart";

const arr = d3.schemeCategory10;
export default class App extends PureComponent {
    render() {
        return <div className={css.grid}>
            <BarChart/>
            {arr.map((d, i) => <div className={css.block} style={{background: d}} key={i}>{i + 1}</div>)}
        </div>
    }

}
