import React, { Component } from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { LineChart } from 'react-easy-chart';
import { TextField, Button } from 'react-md';
import moment from 'moment';
import sortBy from 'lodash/sortBy';
import last from 'lodash/last';
import Loader from '../../SharedComponents/Loader';
import '../../assets/scss/temperature.scss';
import { appendTemperatureLocation } from '../../utils/mam';

class Temperature extends Component {
  state = {
    showLoader: false
  };

  addTemperature = async event => {
    event.preventDefault();
    const temperature = this.temperature && this.temperature.value;
    if (!temperature) return;

    const { data, callback } = this.props;
    if (data && data[data.length - 1]) {
      const last = data[data.length - 1];
      last.temperature = temperature;
      last.timestamp = Date.now();
      this.setState({ showLoader: true });
      const result = await appendTemperatureLocation(last, this.props);
      this.setState({ showLoader: false });
      callback(result, true);
    }
  }

  getTemperatureData = data => {
    return data.map(({ temperature, timestamp }) => ({
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
    const temps = data.map(({ temperature }) => temperature);
    return [Math.ceil(Math.min(...temps) - 1), Math.ceil(Math.max(...temps) + 1)];
  };

  render() {
    const { showLoader } = this.state;
    const { data, size: { width } } = this.props;
    let showChart = false, xRange, yRange, temperature
    if (data && last(data) && last(data).temperature) {
      showChart = true;
      const filteredData = data.filter(({ temperature }) => temperature);
      temperature = this.getTemperatureData(filteredData);
      xRange = this.getXRange(filteredData);
      yRange = this.getYRange(filteredData);
    }

    return (
      <div className="temperature-chart">
        {
          showChart && <LineChart
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
            // interpolate={'cardinal'}
            lineColors={['#18807b']}
            yDomainRange={yRange}
            xDomainRange={xRange}
            data={[temperature]}
            style={{ height: 300 }}
          />
        }
        <form className="add-new" onSubmit={this.addTemperature}>
          <TextField
            ref={temperature => (this.temperature = temperature)}
            id="temperature"
            label="Temperature"
            type="number"
            className={`input-temperature ${showLoader ? 'hidden' : ''}`}
          />
          <Button raised onClick={this.addTemperature} className={`form-button ${showLoader ? 'hidden' : ''}`}>
            Add temperature value
          </Button>
          {
            showLoader && (<div className="loader-wrapper"><Loader showLoader={showLoader} /></div>)
          }
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  item: state.item,
  items: state.items.data,
  project: state.project,
});

export default connect(mapStateToProps)(sizeMe({ monitorHeight: false })(withRouter(Temperature)));
