import React, {PureComponent} from "react";
import * as d3 from 'd3';
import css from '../App.module.scss';
import areaCss from './area.module.scss';
import co2File from './mauna_loa_co2_monthly_averages.csv';

const w = 500;
const h = 300;
const padding = 40;
const formatTime = d3.timeFormat("%Y");
const rowConverter = function (d) {
    return {
        date: new Date(+d.year, (+d.month - 1)),  //Make a new Date object for each year + month
        average: parseFloat(d.average)  //Convert from string to float
    };
}
// let dataset, xScale, yScale, xAxis, yAxis, line, dangerLine;
let dataset, xScale, yScale, xAxis, yAxis, area, dangerArea;
export default class AreaChart extends PureComponent {
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
        dataset = await d3.csv(co2File, rowConverter);
        //Create scale functions
        xScale = d3.scaleTime()
            .domain([
                d3.min(dataset, function (d) {
                    return d.date;
                }),
                d3.max(dataset, function (d) {
                    return d.date;
                })
            ])
            .range([padding, w]);

        yScale = d3.scaleLinear()
            .domain([
                d3.min(dataset, function (d) {
                    if (d.average >= 0) return d.average;
                }) - 10,
                d3.max(dataset, function (d) {
                    return d.average;
                })
            ])
            .range([h - padding, 0]);
//Define axes
        xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(10)
            .tickFormat(formatTime);

        //Define Y axis
        yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(10);

        //Define area generators
        area = d3.area()
            .defined(function (d) {
                return d.average >= 0;
            })
            .x(function (d) {
                return xScale(d.date);
            })
            .y0(function () {
                return yScale.range()[0];
            })
            .y1(function (d) {
                return yScale(d.average);
            });

        dangerArea = d3.area()
            .defined(function (d) {
                return d.average >= 350;
            })
            .x(function (d) {
                return xScale(d.date);
            })
            .y0(function () {
                return yScale(350);
            })
            .y1(function (d) {
                return yScale(d.average);
            });
        //Create areas
        svg.append('g')
            .attr('clip-path', "url(#area-chart-area-bottom")
            .append("path")
            .datum(dataset)
            .attr("class", `${areaCss.area}`)
            .attr("d", area);

        svg.append('g')
            .attr('clip-path', "url(#area-chart-area-top)")
            .append("path")
            .datum(dataset)
            .attr("class", `${areaCss.area} ${areaCss.danger}`)
            .attr("d", dangerArea);

        svg.append('clipPath')
            .attr('id', 'area-chart-area-top')
            .append("rect")
            .attr('x', padding)
            .attr('y', 0)
            .attr('width', w - padding * 2)
            .attr('height', yScale(350)-0.5);
        svg.append('clipPath')
            .attr('id', 'area-chart-area-bottom')
            .append("rect")
            .attr('x', padding)
            .attr('y', yScale(350)+0.5)
            .attr('width', w - padding * 2)
            .attr('height', h - yScale(350) - padding)
        //Create axes
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);
        //Draw 350 ppm line
        svg.append("line")
            .attr("class", `${areaCss.area} ${areaCss.safeLevel}`)
            .attr("x1", padding)
            .attr("x2", w)
            .attr("y1", yScale(350))
            .attr("y2", yScale(350));

        //Label 350 ppm line
        svg.append("text")
            .attr("class", `${areaCss.dangerLabel}`)
            .attr("x", padding + 20)
            .attr("y", yScale(350) - 7)
            .text("350 ppm “safe” level");


    }

    render() {
        return <div className={css.block}>
            <span className={css.title}>区域图</span>
            <div ref={this.myRef}/>
        </div>
    }
}
