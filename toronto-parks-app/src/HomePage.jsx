import React from 'react';
import ReactDOM from 'react-dom';
import {Page, Toolbar} from 'react-onsenui';
import { 
  withGoogleMap,
  GoogleMapLoader,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={15}
    defaultCenter={props.defaultCenter}
    onClick={props.onMapClick}
  >
    
  </GoogleMap>
));

export default class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "We're trying to locate where you are located",
    };
  }

  componentWillMount() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(position => {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.setState({location: pos, message: 'Found your location!'});
      }, function() {
        this.setState({message: 'unable to get location'});
      });
    } else {
      this.setState({message: 'unable to get location'});
    }
  }

  _renderMap() {
    const { location } = this.state;

    return (
      <div id="google-map" style={{height:'100%', width:'100%'}}>
        <GettingStartedGoogleMap
          containerElement={
            <div style={{ height: `100%` }} />
          }
          mapElement={
            <div style={{ height: `100%` }} />
          }
          defaultCenter={location}
          defaultZoom={6}
          onMapLoad={(map) => {
            this._map = map;
            return map;
          }}
        />
      </div>
    )
  }

  render() {
    const { message, location } = this.state;
    
    return (
      <Page
        renderToolbar={() =>
          <Toolbar>
            <div className='center'>Title</div>
          </Toolbar>
        }
      >
        {message && (
          <p>{message}</p>
        )}
        {location && (
          this._renderMap()
        )}
      </Page>
    );
  }
}