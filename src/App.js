import "./App.css";

import ReactLeaflet from "./components/ReactLeaflet";

function App() {
  console.log(Navigator.geolocation);
  return (
    <div className="App">
      <h1>Map apps</h1>
      <ReactLeaflet />
    </div>
  );
}

export default App;
