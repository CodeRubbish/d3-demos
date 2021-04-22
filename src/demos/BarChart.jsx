import React, {PureComponent} from "react";
import * as d3 from 'd3';
import css from '../App.module.scss';
import {Button} from "antd";
// 生成数据
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
const maxNum = 25;
let dataSet = generateData(20, maxNum);
let colors = d3.scaleOrdinal(d3.schemeCategory10);
let xScale = d3.scaleBand()
    .domain(d3.range(dataSet.length))
    .range([padding, w - 2 * padding])
    .round(true)
    .paddingInner(0.05);
let yScale = d3.scaleLinear()
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
        this.svg = d3.select(this.myRef.current)
            .append("svg")
            .attr('width', w)
            .attr('height', h);
        this.initChart();
    }

    // Paint Chart
    initChart = () => {
        const {svg} = this;
        const bars = svg.append('g').attr('class', 'bars');
        this.paintRect(bars);
        this.paintText(bars);
        svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0,${h - 2 * padding})`)
            .call(xAxis);
        svg.append('g')
            .attr('class', 'yAxis')
            .attr('transform', `translate(${padding},0)`)
            .call(yAxis);
    }

    paintRect(container) {
        container.selectAll('rect')
            .data(dataSet, d => d.key)
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(i))
            .attr('fill', d => colors(d.value))
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => h - 2 * padding - yScale(d.value))
    }

    updateRectWithAnimation = (container) => {
        container.selectAll('rect')
            .data(dataSet, d => d.key)
            .transition('update')
            .duration(1000)
            .attr('fill', d => colors(d.value))
            .attr('y', d => yScale(d.value))
            .attr('height', d => h - 2 * padding - yScale(d.value))
    }

    updateTextWithAnimation = container => {
        container.selectAll('text')
            .data(dataSet, d => d.key)
            .transition('update')
            .duration(1000)
            .text(d => d.value)
            // 加上条形宽度的一半
            .attr('y', d => {
                if (d.value > 1) return yScale(d.value) + 12;
                return yScale(d.value) - 2;
            })
            .attr('fill', d => d.value > 1 ? 'white' : 'black')
    }

    paintText = container => {
        container.selectAll('text')
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
    }

    sortBy = (compareMethod) => {
        dataSet = dataSet.sort((a, b) => compareMethod(a.value, b.value));
        this.setRight();
    }
    shuffle = () => {
        dataSet = d3.shuffle(dataSet);
        this.setRight();
    }
    setRight = () => {
        const bars = this.svg.select('g.bars');
        bars.selectAll('rect')
            .data(dataSet, d => d.key)
            .transition('move')
            .duration(1000)
            .attr('x', (d, i) => xScale(i))
        bars.selectAll('text')
            .data(dataSet, d => d.key)
            // 加上条形宽度的一半
            .transition()
            .duration(1000)
            .attr('x', (d, i) => xScale(i) + xScale.bandwidth() / 2)
    }
    reGenerate = () => {
        dataSet = generateData(20, maxNum);
        yScale = d3.scaleLinear()
            .domain([0, d3.max(dataSet, d => d.value)])
            .range([h - 2 * padding, padding]);
        yAxis = d3.axisLeft(yScale);
        this.updateRectWithAnimation(this.svg.select('g.bars'));
        this.updateTextWithAnimation(this.svg.select('g.bars'));
        this.svg.select('g.yAxis')
            .transition()
            .duration(1000)
            .call(yAxis);

    }

    render() {
        return <div className={css.block}>
            <span className={css.title}>条形图</span>
            <div ref={this.myRef}/>
            <Button.Group>
                <Button type={'primary'} onClick={this.sortBy.bind(this, d3.ascending)}>顺序排列</Button>
                <Button type={'primary'} onClick={this.sortBy.bind(this, d3.descending)}>逆序排列</Button>
                <Button type={'primary'} onClick={this.shuffle}>随机打乱</Button>
                <Button type={'primary'} onClick={this.reGenerate}>重新生成数据</Button>
            </Button.Group>
        </div>
    }
}
