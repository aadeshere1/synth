// tf.oneHot -> to_categorical
// const model = await tf.loadLayersModel('https://foo.bar/tfjs_artifacts/model.json');
// -> load_model
// navigator.mediaDevices.getUserMedia({ audio: true }) -> sounddevice

import React, { useState } from "react";

import * as tf from "@tensorflow/tfjs";
import * as sk from "scikitjs";
import { LabelEncoder } from "scikitjs";
import Meyda from "meyda";

sk.setBackend(tf);

const duration = 0.5;
const sampleRate = 22050;

let labels = ["Am", "Bb", "Bdim", "C", "Dm", "Em", "F", "G"];
const labelEncoder = new LabelEncoder();
const numberOfMFCCCoefficients = 20;

async function load_model() {
  let m = await tf.loadLayersModel("http://localhost:8000/model.json");
  return m;
}

let model = load_model();

// const loadModel = tf.loadLayersModel('http://localhost:8000/model.json').then((model) => {
//     // labels = tf.oneHot(tf.tensor1d(labels, 'int32'), 8)
//     console.log("model loaded")
// })

// const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// const bufferSize = duration * sampleRate;
// const audioBuffer = audioContext.createBuffer(channels, bufferSize, sampleRate);
// const source = audioContext.createBufferSource();
// source.buffer = audioBuffer;

export default function Inference() {
  const extractFeatures = () => {
    const newAudioContext = new AudioContext({ sampleRate: sampleRate });
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const analyserNode = newAudioContext.createAnalyser();

      newAudioContext.createMediaStreamSource(stream).connect(analyserNode);
      console.log("new audio context ", newAudioContext);
      analyserNode.fftSize = 16384;
      const bufferLength = analyserNode.frequencyBinCount;
      // const dataArray = new Uint8Array(bufferLength);
      const dataArray = new Float32Array(bufferLength);
      // console.log(dataArray)

      function updatePitch() {
        setInterval(() => {
          analyserNode.getFloatTimeDomainData(dataArray);
          // console.log("DATA", dataArray);
          // const mfccs_features = Meyda.extract('mfcc', dataArray, {
          //     numberOfMFCCCoefficients: 13
          // });

          let extracted_feature = Meyda.extract(["mfcc"], dataArray, {
            numberOfMFCCCoefficients: numberOfMFCCCoefficients,
          });
          // console.log(extracted_feature)
          // console.log("extracted ", loadModel.predict(extracted_feature));
          // loadModel.then(function (res) {
          //     console.log(res)
          //     // console.log(res.predict(extracted_feature))
          // console.log([extracted_feature.mfcc])

          console.log(dataArray);

          model.then(function (res) {
            console.log(extracted_feature.mfcc);
            const result = res.predict(tf.tensor([extracted_feature.mfcc]));
            const prediction = result.arraySync()[0];
            const predictedLabel = Math.max(...prediction);
            const maxIndex = prediction.indexOf(predictedLabel);
            console.log(maxIndex);
            console.log(labels[maxIndex]);
            console.log("=========");
          });

          // })
        }, 2000);
      }

      window.requestAnimationFrame(updatePitch);
    });
  };
  return (
    <div>
      <p>Hello world</p>
      <button onClick={extractFeatures}>start</button>
    </div>
  );
}

// newAudioContext.resume();
