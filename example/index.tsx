import 'react-app-polyfill/ie11';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from '../src/components/_App/Navbar';

const App = () => {
  console.log('11');
  return (
    <div>
      <Router>
        <Navbar />
      </Router>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
