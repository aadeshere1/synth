import './App.scss';
import React, { useState } from "react"
import Osc1 from "./components/Osc1"
let actx = new AudioContext();
let out = actx.destination;

let osc1 = actx.createOscillator();
let gain1 = actx.createGain();

osc1.connect(gain1)
gain1.connect(out)

// osc1.start()


function App() {
  const [osc1Freq, setOsc1Freq] = useState(osc1.frequency.value);
  const [osc1Detune, setOsc1Detune] = useState(osc1.detune.value);

  const changeOsc1 = (e) => {
    let { value, id } = e.target;
  };

  const changeOsc1Freq = e => {
    console.log(e.target.value)
    let { value } = e.target;
    setOsc1Freq(value);
    osc1.frequency.value = value;

  }

  const changeOsc1Detune = e => {
    let { value } = e.target;
    setOsc1Detune(value);
    osc1.detune.value = value;
  };
  return (
    <div className="App">
      <h1>Sliders</h1>
      <button onClick={() => osc1.start()}>start</button>
      <button onClick={() => osc1.stop()}>stop</button>
      <Osc1
        changeFreq={changeOsc1Freq}
        freq={osc1Freq}
        changeDetune={changeOsc1Detune}
        detune={osc1Detune} />
    </div>
  );
}

export default App;
