import React, {PureComponent} from "react";
import css from './App.module.scss';
import * as d3 from 'd3'
import BarChart from "./demos/BarChart";
import Example from "./demos/Example";
import EarthQuake from "./demos/EarthQuake";
import ScatterDiagram from "./demos/ScatterDiagram";

const arr = d3.schemeCategory10;
export default class App extends PureComponent {
    render() {
        return <div className={css.grid}>
            <BarChart/>
            <EarthQuake/>
            <ScatterDiagram/>
            {arr.map((d, i) => <Example key={i}/>)}
        </div>
    }

}
