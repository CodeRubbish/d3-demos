import React, {PureComponent} from "react";
import * as d3 from 'd3';
import css from '../App.module.scss';

const w = 600;
const h = 300;

const dataset = [
    {apples: 25, oranges: 10, grapes: 22},
    {apples: 11, oranges: 200, grapes: 28},
    {apples: 20, oranges: 19, grapes: 32},
    {apples: 37, oranges: 23, grapes: 35},
    {apples: 23, oranges: 17, grapes: 43}
];
export default class StackBar extends PureComponent {
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
        const {svg} = this;
        // 初始化图表
        const stack = d3.stack()
            .keys(["apples", "oranges", "grapes"])
            .order(d3.stackOrderDescending);
        const series = stack(dataset);
        //Set up scales
        const xScale = d3.scaleBand()
            .domain(d3.range(dataset.length))
            .range([0, w])
            .paddingInner(0.05);

        const yScale = d3.scaleLinear()
            .domain([0,
                d3.max(dataset, function (d) {
                    return d.apples + d.oranges + d.grapes;
                })
            ])
            .range([h, 0]);

        const colors = d3.scaleOrdinal(d3.schemeCategory10);
        const groups = svg.selectAll("g")
            .data(series)
            .enter()
            .append("g")
            .style("fill", function (d, i) {
                return colors(i);
            });
        groups.selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return xScale(i);
            })
            .attr("y", function (d) {
                return yScale(d[1]);
            })
            .attr("height", function (d) {
                return yScale(d[0]) - yScale(d[1]);
            })
            .attr("width", xScale.bandwidth());
    }

    render() {
        return <div className={css.block}>
            <span className={css.title}>堆叠条形图</span>
            <div ref={this.myRef}/>
        </div>
    }
}
