import React, {PureComponent} from "react";
import css from './App.module.scss';
import BarChart from "./demos/BarChart";
import EarthQuake from "./demos/EarthQuake";
import ScatterDiagram from "./demos/ScatterDiagram";
import LineChart from "./demos/LineChart";
import PerfectLineChart from "./demos/PerfectLineChart";
import AreaChart from "./demos/AreaChart";

export default class App extends PureComponent {
    render() {
        return <div className={css.grid}>
            <BarChart/>
            <EarthQuake/>
            <ScatterDiagram/>
            <LineChart/>
            <PerfectLineChart/>
            <AreaChart/>
        </div>
    }

}
