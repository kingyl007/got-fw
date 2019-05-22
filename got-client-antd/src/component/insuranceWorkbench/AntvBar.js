import { Component} from 'react';
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util
} from "bizcharts";
import DataSet from "@antv/data-set";

export default class AntvBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            bardata: this.props.bardata,
            chartHeight:this.props.chartHeight,
        };
    }

    //父组件数据更新时重新加载此组件
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
        this.setState({bardata: nextProps.bardata});
        // console.log( nextProps.bardata)
    }

    render() {
        /**
         * month: "Feb",
         Tokyo: 6.9,
         London: 4.2
         * @type {[null,null,null,null]}
         */
        const ds = new DataSet();
        const { Html } = Guide;
        const dv = ds.createView().source(this.state.bardata);
        dv.transform();
        const cols = {
            month: {
                range: [0, 1]
            }
        };
        return (
            <Chart height={this.state.chartHeight} data={dv} scale={cols}  padding={[0,55,80,65]} forceFit>
                <Axis name="type" tickLine={null} grid={null} />
                <Axis name="value" visible={false}/>
                <Coord transpose />
                <Geom
                    type="interval"
                    position="type*value"
                    color={"#436BF7"}
                    label={"label"}><Label content="label" offset={5} /></Geom>
            </Chart>
        );
    }
}