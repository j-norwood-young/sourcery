'use babel';

import React from 'react';
import TopButton from "./top_button.jsx";
import FilterButton from "./filter_button.jsx";
const ipc = require('electron').ipcRenderer;

class Toolbar extends React.Component {
	render()  {
		return <div className="toolbar">
			<div className="btn-group">
				<TopButton icon="home" active={false} onClick={() => { ipc.send('home'); }} />
				<TopButton icon="folder" active={false} onClick={() => { ipc.send('open-file-dialog'); }} />
				<TopButton icon="cancel" active={false} onClick={() => { ipc.send('clear-workspace'); }} />
			</div>
			<div className="filters btn-group">
				<FilterButton icon="picture" active={false} filterType="file" filterIndex="img" />
				<FilterButton icon="newspaper" active={false} filterType="file" filterIndex="doc" />
				<FilterButton icon="video" active={false} filterType="file" filterIndex="vid" />
				<FilterButton icon="help" active={false} filterType="file" filterIndex="unknown" />
			</div>
			<div className="filters btn-group">
				<FilterButton icon="star" active={false} filterType="feature" filterIndex="all" />
				<FilterButton icon="camera" active={false} filterType="feature" filterIndex="exif" />
				<FilterButton icon="location" active={false} filterType="feature" filterIndex="location" />
				<FilterButton icon="info" active={false} filterType="feature" filterIndex="meta" />
			</div>
		</div>;
	}
}

export default Toolbar;