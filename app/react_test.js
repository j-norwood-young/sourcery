import React from 'react';
import ReactDOM from 'react-dom';
import Main from './views/main.jsx';

/* jshint ignore:start */
window.onload = function(){
  ReactDOM.render(<Main />, document.getElementById("app"));
}
/* jshint ignore:end */