'use babel';

import React from 'react';
import TopButton from "./top_button.jsx";
const ipc = require('electron').ipcRenderer;

class Toolbar extends React.Component {
	render()  {
		return <div className="btn-group">
			<TopButton icon="home" active={false} />
			<TopButton icon="folder" active={false} onClick={() => { ipc.send('open-file-dialog'); }} />
			<TopButton icon="cancel" active={false} onClick={() => { ipc.send('clear-workspace'); }} />
		</div>;
	}
}

export default Toolbar;