import React, { Component } from 'react';
import { fromJS } from 'immutable';
import sizeMe from 'react-sizeme';
import isEmpty from 'lodash-es/isEmpty';
import MapGL, { Marker } from 'react-map-gl';
import RoutePin from './route-pin';
import { lineLayer, defaultMapStyle } from './map-style';

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoib2xtdWwiLCJhIjoiY2pja2Y4eHFxNHU3ajJxbzVhMXhyYmU3ZyJ9.Q6xw86TWQTovCeRcm3qomw';

class Map extends Component {
  mapStyle = defaultMapStyle;

  state = {
    data: [],
    viewport: {
      latitude: 51.91,
      longitude: 4.1526,
      zoom: 11,
      bearing: 0,
      pitch: 0,
    },
    settings: {
      width: this.props.size.width,
      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
      dragPan: true,
      dragRotate: true,
      scrollZoom: true,
      doubleClickZoom: true,
      minZoom: 0,
      maxZoom: 20,
      minPitch: 0,
      maxPitch: 85,
    },
  };

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    this.setState({ data: [...data.filter(({ position }) => !isEmpty(position))] }, () =>
      this.state.data.map(this.updateLine)
    );
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    // Make map fill screen
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.size.width,
        height: this.props.height || window.innerHeight,
      },
    });
  };

  // for drawing lines
  toGeoJson = () => {
    this.state.data.map(event => [event.position.lng, event.position.lat]);
  };

  // draw lines
  updateLine = data => {
    if (!this.mapStyle.hasIn(['sources', data.containerId])) {
      this.mapStyle = this.mapStyle
        .setIn(['sources', data.containerId], fromJS({ type: 'geojson' }))
        .set('layers', this.mapStyle.get('layers').push(lineLayer(data.containerId)));

      this.mapStyle = this.mapStyle.setIn(
        ['sources', data.containerId, 'data'],
        fromJS({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [[data.position.lng, data.position.lat]],
          },
        })
      );
    } else {
      this.mapStyle = this.mapStyle.updateIn(
        ['sources', data.containerId, 'data', 'geometry', 'coordinates'],
        list => fromJS(this.toGeoJson())
      );
    }
  };

  renderMarker = (lat, lng, containerId, index) => (
    <Marker key={containerId + '-' + index} longitude={lng} latitude={lat}>
      <RoutePin size={Math.round(this.state.viewport.zoom)} />
    </Marker>
  );

  render() {
    const { data, viewport, settings } = this.state;

    return (
      <MapGL
        ref={reactMap => (this.reactMap = reactMap)}
        {...viewport}
        {...settings}
        mapStyle={this.mapStyle}
        onViewportChange={viewport => this.setState({ viewport })}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        {!isEmpty(data)
          ? data.map(({ containerId, position: { lat, lng } }, index) =>
              this.renderMarker(lat, lng, containerId, index)
            )
          : null}
      </MapGL>
    );
  }
}

export default sizeMe({ monitorHeight: true })(Map);
