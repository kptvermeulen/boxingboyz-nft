import React from "react";
import "./styles/main.css";
import "styles/popup.css";
import Home from "views/Home";
// import Daxio from "views/Daxio";
// import LiveCount from "views/LiveCount";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const dL = "https://discord.gg/boxingboyz";

  return (
    <Router>
      <Routes>
        {/* <Route path="/live-count" element={<LiveCount dL={dL} />}></Route> */}
        {/* <Route exact path="/daxio" element={<Daxio dL={dL} />}></Route> */}
        <Route path="*" element={<Home dL={dL} />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
