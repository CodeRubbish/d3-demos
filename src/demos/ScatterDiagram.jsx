import React, {PureComponent} from "react";
import * as d3 from 'd3';
import css from '../App.module.scss';
import {Button} from "antd";

const w = 600;
const h = 300;
const generateData = () => {
    const dataSet = [];
    const xRange = Math.random() * 1000;
    const yRange = Math.random() * 1000;
    for (let i = 1; i <= 50; i++) {
        const x = Math.floor(Math.random() * xRange);
        const y = Math.floor(Math.random() * yRange);
        dataSet.push([x, y]);
    }
    return dataSet;
}
let dataSet = generateData();

const padding = 40;
export default class ScatterDiagram extends PureComponent {
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
        // 初始化图表比例尺
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(dataSet, d => d[0])])
            .range([padding, w - padding]);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataSet, d => d[1])])
            .range([h - padding, padding]);
        const rScale = d3.scaleLinear()
            .domain([0, d3.max(dataSet, d => d[1])])
            .range([2, 5]);
        const {svg} = this;
        svg.append('g')
            .attr('id', 'circles')
            .attr('clip-path', "url(#chart-area)")
            .selectAll('circle')
            .data(dataSet)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d[0]))
            .attr('cy', d => yScale(d[1]))
            .attr('r', d => rScale(d[1]));
        svg.append('clipPath')
            .attr('id', 'chart-area')
            .append("rect")
            .attr('x', padding)
            .attr('y', padding)
            .attr('width', w - padding * 2)
            .attr('height', h - padding * 2);
        const xAxis = d3.axisBottom(xScale).ticks(5);
        const yAxis = d3.axisLeft(yScale).ticks(5);
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${h - padding})`)
            .call(xAxis);
        svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', `translate(${padding},0)`)
            .call(yAxis);
    }
    resort = () => {
        dataSet = generateData();
        const {svg} = this;
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(dataSet, d => d[0])])
            .range([padding, w - padding])
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataSet, d => d[1])])
            .range([h - padding, padding])
        const rScale = d3.scaleLinear()
            .domain([0, d3.max(dataSet, d => d[1])])
            .range([2, 5])
        const xAxis = d3.axisBottom(xScale).ticks(5);
        const yAxis = d3.axisLeft(yScale).ticks(5);
        svg.selectAll('circle')
            .data(dataSet)
            .transition()
            .duration(1000)
            .on('start', function () {
                d3.select(this)
                    .attr('fill', 'magenta')
                    .attr('r', 3)
            })
            .attr('cx', d => xScale(d[0]))
            .attr('cy', d => yScale(d[1]))
            .attr('r', d => rScale(d[1]))
            .on('end', function () {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr('fill', 'black')
            })
        svg.select('.x.axis')
            .transition()
            .duration(1000)
            .call(xAxis);
        svg.select('.y.axis')
            .transition()
            .duration(1000)
            .call(yAxis);
    }

    render() {
        return <div className={css.block}>
            <span className={css.title}>散点图</span>
            <div ref={this.myRef}/>
            <Button.Group>
                <Button type={'primary'} onClick={this.resort}>打乱排序</Button>
            </Button.Group>
        </div>
    }
}
