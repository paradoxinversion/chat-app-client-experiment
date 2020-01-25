import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { generateAppData } from "./utils";
const appData = generateAppData();
const rootElement = document.getElementById("root");

ReactDOM.render(<App data={appData} />, rootElement);
