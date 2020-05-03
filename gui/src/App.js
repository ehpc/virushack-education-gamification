import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Layout from './Layout';
import './App.css';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Layout />
    </Router>
  );
}

export default App;
