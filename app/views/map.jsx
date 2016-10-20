'use babel';
import React from 'react';
import { Map, Marker, Popup, TileLayer } from '../libs/react-leaflet/lib';

const position = [51.505, -0.09];

class Mymap extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Map center={ this.props.position } zoom={ 13 } scrollWheelZoom={ false } path="./leaflet/images">
				<TileLayer
					url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				<Marker position={ this.props.position} />
			</Map>
		);
	}
}

export default Mymap;