import React, {PureComponent} from "react";
import css from './App.module.scss';
import BarChart from "./demos/BarChart";
import EarthQuake from "./demos/EarthQuake";
import ScatterDiagram from "./demos/ScatterDiagram";
import LineChart from "./demos/LineChart";
import PerfectLineChart from "./demos/PerfectLineChart";
import AreaChart from "./demos/AreaChart";
import ForceDirected from "./demos/ForceDirected";
import PieChart from "./demos/PieChart";
import DonutChart from "./demos/DonutChart";
import StackBar from "./demos/StackBar";
import StackArea from "./demos/StackArea";

export default class App extends PureComponent {
    render() {
        return <div className={css.grid}>
            <BarChart/>
            <EarthQuake/>
            <ScatterDiagram/>
            <LineChart/>
            <PerfectLineChart/>
            <AreaChart/>
            <ForceDirected/>
            <PieChart/>
            <DonutChart/>
            <StackBar/>
            <StackArea/>
        </div>
    }

}
