import React, {PureComponent} from "react";
import * as d3 from 'd3';
import css from '../App.module.scss';
import stackCSS from './stack.module.scss';
import csv from './ev_sales_data.csv';

const w = 600;
const h = 300;
const padding = 20;

let dataset, xScale, yScale, xAxis, yAxis, area;  //Empty, for now

//For converting strings to Dates
const parseTime = d3.timeParse("%Y-%m");
const formatTime = d3.timeFormat("%b %Y");
const rowConverter = (d, i, cols) => {
    const row = {
        date: parseTime(d.Date),
    };
    for (let i = 1; i < cols.length; i++) {
        const col = cols[i];
        if (d[col]) {
            row[col] = +d[col];
        } else {
            row[col] = 0;
        }
    }
    return row;
};

export default class StackArea extends PureComponent {
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

    initChart = async () => {
        // 初始化图表
        const {svg} = this;
        const stack = d3.stack()
            .order(d3.stackOrderDescending);
        dataset = await d3.csv(csv, rowConverter);
        const keys = dataset.columns;
        console.log(dataset);
        keys.shift();
        stack.keys(keys);

        const series = stack(dataset);
        xScale = d3.scaleTime()
            .domain([
                d3.min(dataset, d => d.date),
                d3.max(dataset, d => d.date)
            ])
            .range([padding, w - padding * 2]);

        yScale = d3.scaleLinear()
            .domain([
                0,
                d3.max(dataset, function (d) {
                    let sum = 0;
                    for (let i = 0; i < keys.length; i++) {
                        sum += d[keys[i]];
                    }
                    return sum;
                })
            ])
            .range([h - padding, padding / 2])
            .nice();
        xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(10)
            .tickFormat(formatTime);
        yAxis = d3.axisRight()
            .scale(yScale)
            .ticks(5);
        area = d3.area()
            .x(function (d) {
                return xScale(d.data.date);
            })
            .y0(function (d) {
                return yScale(d[0]);
            })
            .y1(function (d) {
                return yScale(d[1]);
            });
        svg.selectAll("path")
            .data(series)
            .enter()
            .append("path")
            .attr("class", stackCSS.area)
            .attr("d", area)
            .attr("fill", (d, i) => d3.schemeCategory10[i])
            .append("title")  //Make tooltip
            .text(d => d.key);

        //Create axes
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (w - padding * 2) + ",0)")
            .call(yAxis);
    }

    render() {
        return <div className={css.block}>
            <span className={css.title}>堆叠区域图</span>
            <div ref={this.myRef}/>
        </div>
    }
}
