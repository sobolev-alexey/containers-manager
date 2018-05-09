import React, { Component } from 'react';
import sizeMe from 'react-sizeme';
import { LineChart } from 'react-easy-chart';
import moment from 'moment';
import last from 'lodash-es/last';
import sortBy from 'lodash-es/sortBy';
import './ContainerTemperature.css';

class ContainerTemperature extends Component {
  getTemperatureData = data => {
    return data.filter(({ temperature }) => temperature).map(({ temperature, timestamp }) => ({
      x: moment(timestamp).format('YYYY-MM-DD HH:mm'),
      y: Number(temperature),
    }));
  };

  getXRange = data => {
    const dataSet = sortBy(data, 'timestamp');
    return [
      moment(dataSet[0].timestamp).format('YYYY-MM-DD HH:mm'),
      moment(last(dataSet).timestamp)
        .add(1, 'h')
        .format('YYYY-MM-DD HH:mm'),
    ];
  };

  getYRange = data => {
    const temps = data
      .filter(({ temperature }) => temperature)
      .map(({ temperature }) => temperature);
    return [Math.ceil(Math.min(...temps) - 1), Math.ceil(Math.max(...temps) + 1)];
  };

  render() {
    const { data, size: { width } } = this.props;
    const temperature = this.getTemperatureData(data);
    const xRange = this.getXRange(data);
    const yRange = this.getYRange(data);

    return (
      <div className="temperatureChart">
        <LineChart
          dataPoints
          xType={'time'}
          axes
          xTicks={3}
          yTicks={3}
          grid
          verticalGrid
          width={width}
          height={400}
          datePattern={'%Y-%m-%d %H:%M'}
          tickTimeDisplayFormat={'%b %d %H:%M'}
          interpolate={'cardinal'}
          lineColors={['#18807b']}
          yDomainRange={yRange}
          xDomainRange={xRange}
          data={[temperature]}
          style={{ height: 300 }}
        />
      </div>
    );
  }
}

export default sizeMe({ monitorHeight: false })(ContainerTemperature);
