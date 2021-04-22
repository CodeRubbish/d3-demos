import React, {PureComponent} from "react";
import * as d3 from 'd3';
import css from '../App.module.scss';
import {feature} from 'topojson';
import {DOM} from './library';
import {Button} from "antd";

const url1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const url2 = "https://unpkg.com/world-atlas@1/world/110m.json";
const w = 600;
const h = 300;
const s = Math.min(w, h);
const radius = s / 2;
const generateRotate = (() => {
    let i = 0;
    return () => {
        i = i + 0.2;
        if (i > 360) i = 0;
        return i;
    }
})();

export default class EarthQuake extends PureComponent {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    running = false;

    componentDidMount() {
        this.initChart();
    }

    initChart = async () => {
        const [quakes, world] = await this.loadData();
        const c = DOM.context2d(s, s);
        const {canvas} = c;
        const projection = d3.geoOrthographic().scale(radius).translate([s / 2, s / 2]);
        const quakeRadius = (() => {
            const scale = d3.scaleSqrt().domain([0, 100]).range([0, 6]);
            return quake => scale(Math.exp(quake.properties.mag));
        })();
        this.myRef.current.append(canvas);
        this.draw = this.draw.bind(null, projection, c, world, quakes, quakeRadius);
        this.draw([0, 0]);
    }

    draw(projection, c, world, quakes, quakeRadius, rotate) {
        const path = d3.geoPath(projection, c);
        projection.rotate(rotate);
        c.clearRect(0, 0, s, s);
        // Draw the seas
        c.lineWidth = 1.5;
        c.fillStyle = "aliceblue";
        c.beginPath();
        c.arc(s / 2, s / 2, radius, 0, 2 * Math.PI)
        c.fill();
        c.stroke();
        c.lineWidth = 0.35;
        c.fillStyle = "mintcream";
        c.beginPath();
        path(world);
        c.fill();
        c.stroke();

        // Draw the earthquakes
        const color = d3.color('red');
        color.opacity = 0.25;
        c.fillStyle = color;
        path.pointRadius(quakeRadius);
        quakes.features.forEach(quake => {
            c.beginPath();
            path(quake);
            c.fill();
        });
    }

    loadData = async () => {
        const [p, w] = await Promise.all([fetch(url1), fetch(url2)]);
        const [quake, worldTemp] = await Promise.all([p.json(), w.json()])
        const world = feature(worldTemp, worldTemp.objects.countries);
        return [quake, world];
    }
    play = () => {
        this.running = true;
        this.step();
    }

    step = () => {
        this.draw([generateRotate(), 0]);
        if (this.running) {
            requestAnimationFrame(this.step)
        }
    }
    pause = () => {
        this.running = false;
    }

    render() {
        return <div className={css.block}>
            <span className={css.title}>旋转地球</span>
            <div ref={this.myRef}/>
            <Button.Group>
                <Button type={'primary'} onClick={this.play}>旋转</Button>
                <Button type={'primary'} onClick={this.pause}>暂停</Button>
            </Button.Group>
        </div>
    }
}
