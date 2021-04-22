import React, {PureComponent} from "react";
import * as d3 from 'd3';
import css from '../App.module.scss';

export default class Example extends PureComponent {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.svg = d3
    }

    render() {
        return <div className={css.block}>
            <span className={css.title}>名称</span>
            <div ref={this.myRef}/>
        </div>
    }
}
