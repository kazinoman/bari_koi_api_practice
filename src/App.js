import "./App.css";
import ExternalStateExample from "./components/marker";

import ReactLeaflet from "./components/ReactLeaflet";

function App() {
  console.log(Navigator.geolocation);
  return (
    <div className="App">
      <h1>Map apps</h1>
      <ExternalStateExample />
    </div>
  );
}

export default App;
