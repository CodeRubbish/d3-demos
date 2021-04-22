import React, {PureComponent} from "react";
import * as d3 from 'd3';
import css from '../App.module.scss';

const w = 600;
const h = 300;
export default class Example extends PureComponent {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.svg = d3.select(this.myRef.current)
            .append("svg")
            .attr('width', w)
            .attr('height', h);
        this.initChart();
    }

    initChart = () => {
        // 初始化图表
    }

    render() {
        return <div className={css.block}>
            <span className={css.title}>名称</span>
            <div ref={this.myRef}/>
        </div>
    }
}
