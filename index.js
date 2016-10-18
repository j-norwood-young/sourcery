const {app, BrowserWindow} = require('electron');
require('babel-register');

let win;

function createWindow () {
	// Create the browser window.
	win = new BrowserWindow({minWidth: 800, minHeight: 600, width: 1024, height: 600 });

	// and load the index.html of the app.
	win.loadURL(`file://${__dirname}/app/index.html`);

	// Open the DevTools.
	win.webContents.openDevTools();

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
	}
});

// File dialog
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

ipc.on('open-file-dialog', function (event) {
	dialog.showOpenDialog({
		properties: ['openFile', 'openDirectory', 'multiSelections'],
		filters : [
			{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg'] },
			{ name: 'PDF', extensions: ['pdf'] },
			{ name: 'Docs', extensions: ['docx']}
		]
	}, function (files) {
		if (files) event.sender.send('selected-directory', files);
	});
});

ipc.on("asset-parsed", (event, asset) => { 
//At the moment we just pass this back. At some point we'll probably save this locally.
	event.sender.send("asset-parsed", asset);
});

ipc.on("clear-workspace", (event) => {
	event.sender.send("clear-workspace");
});

ipc.on("asset-clicked", (event, asset) => {
	console.log(event);
	event.sender.send("asset-detail", asset);
});

// We define our filter state here so that we can send it to any part of our app as a whole
var filters = {
	file: { 
		"img": true, 
		"doc": true,
		"vid": true,
		"unknown": true,
	},
	feature: {
		"all": true,
		"location": true, 
		"exif": true,
		"meta": true,
	}
};

ipc.on("filter", (event, filterType, filterIndex, state) => {
	console.log(filterType, filterIndex, state);
	filters[filterType][filterIndex] = state;
	console.log(filters);
	event.sender.send("filter", filters);
});