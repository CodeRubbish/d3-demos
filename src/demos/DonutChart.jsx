import React, {PureComponent} from "react";
import * as d3 from 'd3';
import css from '../App.module.scss';

const w = 600;
const h = 300;
const outRadius = h / 2;
const innerRadius = h / 4;
const dataSet = [5, 20, 16, 32, 27];
const color = d3.scaleOrdinal(d3.schemeAccent);
export default class DonutChart extends PureComponent {
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
        const {svg} = this;
        const pie = d3.pie();
        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outRadius)
        const arcs = svg.selectAll('g.arc')
            .data(pie(dataSet))
            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr('transform', `translate(${w / 2},${outRadius})`);
        arcs.append('path')
            .attr('fill', (d, i) => color(i))
            .attr('d', arc);
        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .text(d => d.value);
    }

    render() {
        return <div className={css.block}>
            <span className={css.title}>环形图</span>
            <div ref={this.myRef}/>
        </div>
    }
}
