import {Component} from 'react';
import {G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Facet,} from "bizcharts";

class AreaChart extends Component {
    render() {
        const data = [
            {
                country: "Asia",
                year: "1750",
                value: 502
            },
            {
                country: "Asia",
                year: "1800",
                value: 635
            },
            {
                country: "Asia",
                year: "1850",
                value: 809
            },
            {
                country: "Asia",
                year: "1900",
                value: 5268
            },
            {
                country: "Asia",
                year: "1950",
                value: 4400
            },
            {
                country: "Asia",
                year: "1999",
                value: 3634
            },
            {
                country: "Asia",
                year: "2050",
                value: 947
            },
            {
                country: "Oceania",
                year: "1750",
                value: 200
            },
            {
                country: "Oceania",
                year: "1800",
                value: 200
            },
            {
                country: "Oceania",
                year: "1850",
                value: 200
            },
            {
                country: "Oceania",
                year: "1900",
                value: 460
            },
            {
                country: "Oceania",
                year: "1950",
                value: 230
            },
            {
                country: "Oceania",
                year: "1999",
                value: 300
            },
            {
                country: "Oceania",
                year: "2050",
                value: 300
            }
        ];
        const cols = {
            year: {
                type: "linear",
                tickInterval: 50
            }
        };
        return (
            <div>
                <Chart data={data} scale={cols} forceFit>
                    <Axis name="year" />
                    <Axis name="value" />
                    <Legend />
                    <Tooltip
                        crosshairs={{
                            type: "line"
                        }}
                    />
                    <Geom type="areaStack" position="year*value" color="country" shape="smooth"/>
                   {/*<Geom type="areaStack" color={['country', ['#ff0000', '#00ff00']]} position="year*value" />*/}
                    {/*<Geom type="lineStack" position="year*value" size={2} color="country" />*/}
                </Chart>
            </div>
        );
    }
}

export default AreaChart;