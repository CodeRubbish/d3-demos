import React, {PureComponent} from "react";
import * as d3 from 'd3';
import css from '../App.module.scss';
import {Button} from "antd";

const generateData = (length, maxNum) => {
    const newSet = [];
    for (let i = 0; i < length; i++) {
        newSet.push({
            key: i,
            value: Math.floor(Math.random() * (maxNum - 1)) + 1
        })
    }
    return newSet;
};
const w = 600;
const h = 300;
const padding = 20;
let dataSet = generateData(20, 25);
const colors = d3.scaleOrdinal(d3.schemeCategory10);
const xScale = d3.scaleBand()
    .domain(d3.range(dataSet.length))
    .range([padding, w - 2 * padding])
    .round(true)
    .paddingInner(0.05);
const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataSet, d => d.value)])
    .range([h - 2 * padding, padding]);
let xAxis = d3.axisBottom(xScale);
let yAxis = d3.axisLeft(yScale);
export default class BarChart extends PureComponent {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        const svg = d3.select(this.myRef.current)
            .append("svg")
            .attr('width', w)
            .attr('height', h);
        const bars = svg.append('g').attr('class', 'bars');
        bars.selectAll('rect')
            .data(dataSet, d => d.key)
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(i))
            .attr('fill', d => colors(d.value))
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => h - 2 * padding - yScale(d.value))
        bars.selectAll('text')
            .data(dataSet)
            .enter()
            .append('text')
            .text(d => d.value)
            // 加上条形宽度的一半
            .attr('x', (d, i) => xScale(i) + xScale.bandwidth() / 2)
            .attr('y', d => {
                if (d.value > 1) return yScale(d.value) + 12;
                return yScale(d.value) - 2;
            })
            .attr('font-family', 'sans-serif')
            .attr('font-size', "11px")
            .attr('fill', d => d.value > 1 ? 'white' : 'black')
            .attr('text-anchor', 'middle');
        svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0,${h - 2 * padding})`)
            .call(xAxis);
        svg.append('g')
            .attr('class', 'yAxis')
            .attr('transform', `translate(${padding},0)`)
            .call(yAxis);

    }

    setRight = () => {
        const bars = d3.select(this.myRef.current).select('g.bars');
        bars.selectAll('rect')
            .data(dataSet, d => d.key)
            .transition()
            .duration(1000)
            .attr('x', (d, i) => xScale(i))
        bars.selectAll('text')
            .data(dataSet, d => d.key)
            // 加上条形宽度的一半
            .transition()
            .duration(1000)
            .attr('x', (d, i) => xScale(i) + xScale.bandwidth() / 2)
    }
    sortBy = (compareMethod) => {
        dataSet = dataSet.sort((a, b) => compareMethod(a.value, b.value));
        this.setRight();
    }
    shuffle = () => {
        dataSet = d3.shuffle(dataSet);
        this.setRight();
    }

    render() {
        return <div className={css.block}>
            <span className={css.title}>条形图</span>
            <div ref={this.myRef}/>
            <Button.Group>
                <Button type={'primary'} onClick={this.sortBy.bind(this, d3.descending)}>顺序排列</Button>
                <Button type={'primary'} onClick={this.sortBy.bind(this, d3.ascending)}>逆序排列</Button>
                <Button type={'primary'} onClick={this.shuffle}>随机打乱</Button>
                <Button type={'primary'}>随机移除一条</Button>
            </Button.Group>
        </div>
    }
}
