import React, {PureComponent} from "react";
import * as d3 from 'd3';
import css from '../App.module.scss';
import {Button} from "antd";

const generateData = (length, maxNum) => {
    const newSet = [];
    for (let i = 0; i < length; i++) {
        newSet.push(Math.floor(Math.random() * (maxNum - 1)) + 1)
    }
    return newSet;
};
const w = 600;
const h = 300;
const padding = 20;
let dataSet = generateData(20, 25);
const colors = d3.scaleOrdinal(d3.schemeCategory10);
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
        const xScale = d3.scaleBand()
            .domain(d3.range(dataSet.length))
            .range([padding, w - 2 * padding])
            .round(true)
            .paddingInner(0.05);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataSet)])
            .range([h - 2 * padding, padding]);
        bars.selectAll('rect')
            .data(dataSet)
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(i))
            .attr('fill', (d, i) => colors(i.toString()))
            .attr('y', d => yScale(d))
            .attr('width', xScale.bandwidth())
            .attr('height', d => h - 2 * padding - yScale(d))
        bars.selectAll('text')
            .data(dataSet)
            .enter()
            .append('text')
            .text(d => d)
            // 加上条形宽度的一半
            .attr('x', (d, i) => xScale(i) + xScale.bandwidth() / 2)
            .attr('y', d => {
                if (d > 1) return yScale(d) + 12;
                return yScale(d) - 2;
            })
            .attr('font-family', 'sans-serif')
            .attr('font-size', "11px")
            .attr('fill', d => d > 1 ? 'white' : 'black')
            .attr('text-anchor', 'middle');
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
        svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0,${h - 2 * padding})`)
            .call(xAxis);
        svg.append('g')
            .attr('class', 'yAxis')
            .attr('transform', `translate(${padding},0)`)
            .call(yAxis);

    }

    sortBy = (compareMethod) => {
        const xScale = d3.scaleBand()
            .domain(d3.range(dataSet.length))
            .range([padding, w - 2 * padding])
            .round(true)
            .paddingInner(0.05);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataSet)])
            .range([h - 2 * padding, padding]);
        dataSet = dataSet.sort(compareMethod);
        const bars = d3.select(this.myRef.current).select('g.bars');
        bars.selectAll('rect')
            .data(dataSet)
            .transition()
            .duration(1000)
            .attr('x', (d, i) => xScale(i))
            .attr('fill', (d, i) => colors(i.toString()))
            .attr('y', d => yScale(d))
            .attr('width', xScale.bandwidth())
            .attr('height', d => h - 2 * padding - yScale(d))
        bars.selectAll('text')
            .data(dataSet)
            .text(d => d)
            // 加上条形宽度的一半
            .transition()
            .duration(1000)
            .attr('x', (d, i) => xScale(i) + xScale.bandwidth() / 2)
            .attr('y', d => {
                if (d > 1) return yScale(d) + 12;
                return yScale(d) - 2;
            })
            .attr('fill', d => d > 1 ? 'white' : 'black')
    }

    render() {
        return <div className={css.block}>
            <div ref={this.myRef}/>
            <Button.Group>
                <Button type={'primary'} shape="round" onClick={this.sortBy.bind(this, d3.descending)}>顺序排列</Button>
                <Button type={'primary'} shape="round" onClick={this.sortBy.bind(this, d3.ascending)}>逆序排列</Button>
                <Button type={'primary'} shape="round">随机增加一条</Button>
                <Button type={'primary'} shape="round">随机移除一条</Button>
            </Button.Group>
        </div>
    }
}
