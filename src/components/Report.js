/**
 * The Report Component
 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import ListSubheader from 'material-ui/List/ListSubheader';
import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';
import { withTheme } from 'material-ui/styles';
import Exporting from 'highcharts/modules/exporting';
import Bullet from 'highcharts/modules/bullet';
import Heatmap from 'highcharts/modules/heatmap';
import HighchartsMore from 'highcharts/highcharts-more';
import ReactHighcharts from 'react-highcharts';

Exporting(ReactHighcharts.Highcharts);
HighchartsMore(ReactHighcharts.Highcharts);
Bullet(ReactHighcharts.Highcharts);
Heatmap(ReactHighcharts.Highcharts);

export default class Reports extends Component {
    render() {
        return (
            <Switch>
                <Route path='/performance' component={PerformanceReport} />
                <Route path='/productivity' component={ProductivityReport} />
                <Route path='/engagement' component={EngagementReport} />
            </Switch>
        );
    }
}

class ReportControl extends Component {
    static propTypes = {
        metrics: PropTypes.array.isRequired,
        dimensions: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired
    };
    constructor(...args) {
        super(...args);
        this.state = {
            metric: {},
            dimension: {}
        };
    }
    _onChange(key, value, event) {
        let multiSelect = event.ctrlKey || event.nativeEvent.ctrlKey || event.metaKey || event.nativeEvent.metaKey;
        let item = {
            ...this.state[key]
        };
        if (multiSelect) {
            if (value in item) {
                delete item[value];
            } else {
                item[value] = true;
            }
        } else {
            item = {
                [value]: true
            };
        }
        this.setState({
            [key]: item
        }, () => {
            this.props.onChange(this.state);
        });
    }
    render() {
        return (
            <Paper className="ReportControl">
                <List>
                    <ListSubheader>Metrics</ListSubheader>
                    {this.props.metrics.map(metric => (
                        <ListItem
                            button
                            dense
                            key={metric}
                            onClick={this._onChange.bind(this, 'metric', metric)}
                            className={metric in this.state.metric ? 'Item--selected' : ''}
                        >
                            <ListItemIcon>
                                <Icon>{metric in this.state.metric ? 'radio_button_checked' : 'radio_button_unchecked'}</Icon>
                            </ListItemIcon>
                            <ListItemText primary={metric} />
                        </ListItem>
                    ))}
                    <Divider />
                    <ListSubheader>Dimensions</ListSubheader>
                    {this.props.dimensions.map(dimension => (
                        <ListItem
                            button
                            dense
                            key={dimension}
                            onClick={this._onChange.bind(this, 'dimension', dimension)}
                            className={dimension in this.state.dimension ? 'Item--selected' : ''}
                        >
                            <ListItemIcon>
                                <Icon>{dimension in this.state.dimension ? 'radio_button_checked' : 'radio_button_unchecked'}</Icon>
                            </ListItemIcon>
                            <ListItemText primary={dimension} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        );
    }
}

function LoadingChart() {
    return (
        <div></div>
    );
}

function DummyChart(props) {
    return (
        <ReactHighcharts config={{

            chart: {
                polar: true,
                type: 'line'
            },

            title: {
                text: 'Budget vs spending',
                x: -80
            },

            pane: {
                size: '80%'
            },

            xAxis: {
                categories: ['Sales', 'Marketing', 'Development', 'Customer Support',
                    'Information Technology', 'Administration'],
                tickmarkPlacement: 'on',
                lineWidth: 0
            },

            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },

            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
            },

            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical'
            },

            series: [{
                name: 'Allocated Budget',
                data: [43000, 19000, 60000, 35000, 17000, 10000],
                pointPlacement: 'on'
            }, {
                name: 'Actual Spending',
                data: [50000, 39000, 42000, 31000, 26000, 14000],
                pointPlacement: 'on'
            }]

        }}/>
    );
}

const styles = theme => ({
    positive: {
        color: theme.status.success[500]
    },
    negative: {
        color: theme.palette.error[500]
    }
});

function BulletChart(props) {
    let completeRatio = props.y / props.target * 100;
    let growth = (props.y - props.compare) / props.compare * 100;
    return (
        <ReactHighcharts
            domProps={{
                className: 'BulletChart'
            }}
            config={{
                chart: {
                    type: 'bullet',
                    inverted: true,
                    marginLeft: 135,
                    // marginTop: props.title ? 40 : undefined
                },
                title: {
                    text: props.title
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                xAxis: {
                    categories: [`<span class="hc-cat-title">${props.xAxis}</span>`]
                },
                yAxis: {
                    plotBands: [{
                        from: 0,
                        to: props.compare,
                        color: props.theme.palette.grey[300]
                    }, {
                        from: props.compare,
                        to: 1000,
                        color: props.theme.palette.grey[200]
                    }],
                    title: null,
                    gridLineWidth: 0
                },
                plotOptions: {
                    series: {
                        pointPadding: 0.25,
                        borderWidth: 0,
                        // color: props.theme.palette.primary[400],
                        targetOptions: {
                            width: '200%'
                        }
                    }
                },
                series: [{
                    data: [{
                        y: props.y,
                        target: props.target
                    }]
                }],
                tooltip: {
                    pointFormat: `<b>{point.y} million</b> (with target at {point.target} million)<br><b>${completeRatio.toFixed(1)}%</b> completed<br><b>${growth.toFixed(2)}%</b> growth`
                }
            }}/>
    );
}
BulletChart = withTheme()(BulletChart);

function RevenueByTherapy(props) {
    return (
        <div className='BulletCharts'>
            <BulletChart
                title='Sales Revenue (Million CNY)'
                xAxis='Oncolog'
                compare={800}
                y={900}
                target={890}
            />
            <BulletChart
                xAxis='Neuroscience'
                compare={750}
                y={700}
                target={840}
            />
            <BulletChart
                xAxis='Cardiovascular'
                compare={400}
                y={550}
                target={580}
            />
            <BulletChart
                xAxis='Ophthalmology'
                compare={480}
                y={523}
                target={660}
            />
        </div>
    );
}

function MarketByTherapy(props) {
    return (
        <ReactHighcharts
            config={{
                title: {
                    text: 'Market Share by Therapy Area'
                },
                chart: {
                    type: 'heatmap'
                },
                xAxis: {
                    categories: ['AZ', 'Bayer', 'Roche', 'MSD', 'Pfizer']
                },
                yAxis: {
                    categories: ['Oncolog', 'Neuroscience', 'Cardiovascular', 'Ophthalmology'],
                    title: null
                },
                colorAxis: {
                    min: 0,
                    minColor: 'white'
                },
                legend: {
                    align: 'right',
                    layout: 'vertical',
                    verticalAlign: 'middle',
                },

                tooltip: {
                    formatter: function () {
                        return `<b>${this.series.xAxis.categories[this.point.x]}</b> in <b>${this.series.yAxis.categories[this.point.y]}</b>:<br> <b>${this.point.value}%</b>`;
                    }
                },

                series: [{
                    name: 'Market Share',
                    data: [
                        [0, 0, 19.5], [1, 0, 8.3], [2, 0, 18.2], [3, 0, 14.4], [4, 0, 7.2],
                        [0, 1, 9.5], [1, 1, 13.6], [2, 1, 8.6], [3, 1, 12.4], [4, 1, 6.8],
                        [0, 2, 12.4], [1, 2, 4.9], [2, 2, 10.2], [3, 2, 9.2], [4, 2, 15.9],
                        [0, 3, 3.4], [1, 3, 9.2], [2, 3, 16.4], [3, 3, 8.6], [4, 3, 18.4]
                    ],
                    dataLabels: {
                        enabled: true
                    }
                }]
            }}
        />
    );
}

function RevenueMarketByTherapy(props) {
    return (
        <ReactHighcharts
            config={{
                chart: {
                    type: 'scatter'
                },
                title: {
                    text: 'Goal Attainment and Market Share by Therapy Area'
                },
                plotOptions: {
                    scatter: {
                        tooltip: {
                            headerFormat: '<b>{series.name}</b><br>',
                            pointFormat: 'Market Share Change: <b>{point.x}</b>%<br>Sales Completion: <b>{point.y}%</b>'
                        },
                        marker: {
                            radius: 10
                        }
                    }
                },
                xAxis: {
                    min: -2,
                    max: 2,
                    plotBands: [{
                        color: 'rgba(244, 67, 54, 0.2)',
                        from: -2,
                        to: 0
                    }, {
                        color: 'rgba(3, 169, 244, 0.2)',
                        from: 0,
                        to: 2
                    }],
                    title: {
                        text: 'Market Share Change (%)'
                    }
                },
                yAxis: {
                    min: 0,
                    max: 110,
                    plotBands: [{
                        color: 'rgba(76, 175, 80, 0.2)',
                        from: 50,
                        to: 200
                    }],
                    title: {
                        text: 'Goal Attainment (%)'
                    }
                },
                series: [{
                    name: 'Oncolog',
                    data: [[1.3, 101]]
                }, {
                    name: 'Neuroscience',
                    data: [[0.2, 83]]
                }, {
                    name: 'Cardiovascular',
                    data: [[-1.5, 95]]
                }, {
                    name: 'Ophthalmology',
                    data: [[-0.3, 79]]
                }]
            }}
        />
    );
}

function ProductivityByTherapy(props) {
    return (
        <ReactHighcharts
            config={{
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Sales Revenue Per Employee by Therapy Area'
                },
                xAxis: {
                    categories: [
                        'Oncolog',
                        'Neuroscience',
                        'Cardiovascular',
                        'Ophthalmology'
                    ],
                    crosshair: true
                },
                yAxis: {
                    title: {
                        text: 'Million CNY'
                    }
                },
                tooltip: {
                    shared: true,
                },
                series: [{
                    name: 'FY15',
                    data: [3.34, 3.02, 2.52, 1.59],
                    color: props.theme.palette.primary[200]
                }, {
                    name: 'FY16',
                    data: [3.45, 2.98, 2.58, 1.45],
                    color: props.theme.palette.primary[300]
                }, {
                    name: 'FY17',
                    data: [3.61, 2.95, 2.63, 1.56],
                    color: props.theme.palette.primary[400]
                }, {
                    name: 'FY17 Competitors',
                    data: [3.42, 3.3, 2.8, 1.9],
                    color: props.theme.palette.grey[600]
                }]
            }}
        />
    );
}
ProductivityByTherapy = withTheme()(ProductivityByTherapy);

function ROIByTherapy(props) {
    return (
        <ReactHighcharts
            config={{
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'ROI by Therapy Area'
                },
                xAxis: {
                    categories: [
                        'Oncolog',
                        'Neuroscience',
                        'Cardiovascular',
                        'Ophthalmology'
                    ],
                    crosshair: true
                },
                yAxis: {
                    title: {
                        text: 'Total Cash/Sales Revenue'
                    }
                },
                tooltip: {
                    shared: true,
                },
                series: [{
                    name: 'FY15',
                    data: [8.8, 8.4, 7.2, 6.9],
                    color: props.theme.palette.primary[200]
                }, {
                    name: 'FY16',
                    data: [8.9, 8.2, 7.3, 7.0],
                    color: props.theme.palette.primary[300]
                }, {
                    name: 'FY17',
                    data: [9.2, 8.3, 7.8, 7.2],
                    color: props.theme.palette.primary[400]
                }, {
                    name: 'FY17 Competitors',
                    data: [8.8, 8.5, 8.1, 6.9],
                    color: props.theme.palette.grey[600]
                }]
            }}
        />
    );
}
ROIByTherapy = withTheme()(ROIByTherapy);

function ProductivityCompaRatioByTherapy(props) {
    return (
        <ReactHighcharts
            config={{
                chart: {
                    type: 'scatter'
                },
                title: {
                    text: 'Productivity and Compa-ratio by Therapy Area'
                },
                plotOptions: {
                    scatter: {
                        tooltip: {
                            headerFormat: '<b>{series.name}</b><br>',
                            pointFormat: 'Compa-ratio: <b>{point.x}</b>%<br>Productivity: <b>{point.y}%</b>'
                        },
                        marker: {
                            radius: 10
                        }
                    }
                },
                xAxis: {
                    min: 70,
                    max: 110,
                    title: {
                        text: 'Compa-ratio (%)'
                    }
                },
                yAxis: {
                    min: 70,
                    max: 110,
                    title: {
                        text: 'Productivity (%)'
                    }
                },
                series: [{
                    name: 'Oncolog',
                    data: [[98, 106]]
                }, {
                    name: 'Neuroscience',
                    data: [[92, 89]]
                }, {
                    name: 'Cardiovascular',
                    data: [[94, 94]]
                }, {
                    name: 'Ophthalmology',
                    data: [[88, 82]]
                }]
            }}
        />
    );
}

function TurnoverByPerformanceDistribution(props) {
    return (
        <ReactHighcharts
            config={{
                chart: {
                    type: 'areaspline'
                },
                title: {
                    text: 'Turnover and Performance'
                },
                xAxis: {
                    categories: [
                        'Below 50%',
                        '51%-60%',
                        '61%-70%',
                        '71%-80%',
                        '81%-90%',
                        '91%-100%',
                        'Above 100%'
                    ],
                    crosshair: true
                },
                yAxis: {
                    title: {
                        text: 'Number of Sales Forces'
                    }
                },
                series: [{
                    name: 'Stay',
                    data: [4, 8, 6, 34, 48, 14, 6]
                }, {
                    name: 'Leave',
                    data: [2, 3, 1, 7, 9, 1, 1]
                }]
            }}
        />
    );
}

class Report extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            metric: {},
            dimension: {}
        };
        this.onOptionChange = this.onOptionChange.bind(this);
    }
    onOptionChange(option) {
        this.setState(option);
    }
}

class PerformanceReport extends Report {
    metrics = [
        'Sales Revenue',
        'Sales Volume',
        'Market Share',
        'Gross Margin'
    ];
    dimensions = [
        'Region',
        'Therapy Area',
        'Product',
        'Channel'
    ];
    render() {
        let chart;
        if (this.metrics[0] in this.state.metric && this.metrics[2] in this.state.metric && this.dimensions[1] in this.state.dimension) {
            chart = <RevenueMarketByTherapy/>;
        } else if (this.metrics[0] in this.state.metric && this.dimensions[1] in this.state.dimension) {
            chart = <RevenueByTherapy/>;
        } else if (this.metrics[2] in this.state.metric && this.dimensions[1] in this.state.dimension) {
            chart = <MarketByTherapy/>;
        } else {
            chart = <DummyChart/>;
        }
        return (
            <div className="Report">
                <ReportControl
                    metrics={this.metrics}
                    dimensions={this.dimensions}
                    onChange={this.onOptionChange}
                />
                <div className="ReportContent">
                    {chart}
                </div>
            </div>
        );
    }
}

class ProductivityReport extends Report {
    metrics = [
        'Productivity',
        'ROI',
        'Productivity VS. Compa-ratio'
    ];
    dimensions = [
        'Region',
        'Therapy Area',
        'Product',
        'Channel'
    ];
    render() {
        let chart;
        if (this.metrics[0] in this.state.metric && this.metrics[2] in this.state.metric && this.dimensions[1] in this.state.dimension) {
            chart = <ProductivityCompaRatioByTherapy/>
        } else if (this.metrics[0] in this.state.metric && this.dimensions[1] in this.state.dimension) {
            chart = <ProductivityByTherapy/>;
        } else if (this.metrics[1] in this.state.metric && this.dimensions[1] in this.state.dimension) {
            chart = <ROIByTherapy/>;
        } else {
            chart = <DummyChart/>;
        }
        return (
            <div className="Report">
                <ReportControl
                    metrics={this.metrics}
                    dimensions={this.dimensions}
                    onChange={this.onOptionChange}
                />
                <div className="ReportContent">
                    {chart}
                </div>
            </div>
        );
    }
}

class EngagementReport extends Report {
    metrics = [
        'Turnover',
        'Engagement',
        'Performance Distribution',
        'Payout Curve'
    ];
    dimensions = [
        'Region',
        'Therapy Area',
        'Product',
        'Channel'
    ];
    render() {
        let chart;
        if (this.metrics[0] in this.state.metric && this.metrics[2] in this.state.metric) {
            chart = <TurnoverByPerformanceDistribution/>
        } else if (this.metrics[0] in this.state.metric && this.dimensions[1] in this.state.dimension) {
            chart = <ProductivityByTherapy/>;
        } else if (this.metrics[1] in this.state.metric && this.dimensions[1] in this.state.dimension) {
            chart = <ROIByTherapy/>;
        } else {
            chart = <DummyChart/>;
        }
        return (
            <div className="Report">
                <ReportControl
                    metrics={this.metrics}
                    dimensions={this.dimensions}
                    onChange={this.onOptionChange}
                />
                <div className="ReportContent">
                    {chart}
                </div>
            </div>
        );
    }
}


