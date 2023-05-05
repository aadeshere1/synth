import React from 'react';

const Osc1 = ({ changeFreq, freq, changeDetune, detune }) => {
    return (
        <div className="control">
            <h1>OSC1</h1>
            <div className='param'>
                <h3>frequency</h3>
                <input onChange={changeFreq}
                    max="5000"
                    value={freq}
                    type="range" id="frequency" />
            </div>


            <div className='param'>
                <h3>detune</h3>
                <input onChange={changeDetune}

                    value={detune}
                    type="range" id="detune" />
            </div>
        </div>
    );
}

export default Osc1;