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
import firebase from 'firebase';

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
    this.geocoder = new google.maps.Geocoder();
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

  componentDidMount() {
    const firebaseRef = firebase.database().ref('Locations');

    firebaseRef.on('value', snapshot => {
      const locationsData = snapshot.val();
      const locations = [];
      console.log(locationsData);
      const locationsPromises = locationsData.Location.map(location => {
        return new Promise((resolve) => {
          this.geocoder.geocode({'address': location.Address}, function(results, status) {
            if (status === 'OK') {
              locations.push({
                position: results[0].geometry.location
              });
            } else {
              console.log('Geocode was not successful for the following reason: ' + status);
            }
            resolve();
          });
        });
      });
      Promise.all(locationsPromises).then(() => {
        this.setState({locations});
      })
      console.log(locations);
    });
  }

  _renderMap() {
    const { location, locations } = this.state;
    
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
          markers={locations}
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