'use babel';

import React from 'react';

export default class Landing extends React.Component {
	render() {
		return <div id="landing">
				<img src="./public/icons/sourcery.png" alt="Sourcery" />
				<h1>Welcome to Sourcery</h1>
				<h3>Sourcery helps journalists interview digital assets</h3>
				<ul>
					<li>Sourcery is your one-stop-shop metadata explorer.</li>
					<li>Extract metadata from most types of files, including documents, pdfs, images, and video.</li>
					<li>Stay safe. Since Sourcery is a desktop app, you dont need to upload your confidential files to interrogate them.</li>
					<li>You can also handle large files and datasets without having to wait for them to upload.</li>
					<li>Multiplatform: Sourcery runs on OSX, Windows and Linux.</li>
				</ul>
				<p>Sourcery is currently in alpha. Once we support enough file types, we will launch into public beta. You can use it right now for images, pdfs and docx (Microsoft Word).</p>
				<h4>Instructions</h4>
				<p>To get started, click on the folder icon <span className="icon icon-folder"></span>.</p>
				<p>To filter by file types, use the first set of icons for images, docs, video and unknown.</p>
				<p>Use the second set of icons to filter for all features, images with exif data, assets with location data, and documents with metadata.</p>
			</div>;
	}
}