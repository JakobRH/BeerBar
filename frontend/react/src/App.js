import React from 'react';
import DrizzleProvider from './components/DrizzleProvider.jsx';
import {BrowserRouter as Router} from "react-router-dom";
import {Layout} from 'antd';

function App() {
  return (
    <Layout style={{height: "100%", overflow: "auto"}}>
      <Router>
        <DrizzleProvider/>
      </Router>
    </Layout>
  );
}

export default App;

