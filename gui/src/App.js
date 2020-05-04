import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Layout from "./Layout";
import TeacherRTC from "./components/webRTC/teacherRTC";
import StudentRTC from "./components/webRTC/studentRTC";

import "./App.css";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Layout />
      <Switch>
        <Route exact path="/student">
          <StudentRTC />
        </Route>
        <Route exact path="/teacher">
          <TeacherRTC />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
