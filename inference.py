import librosa
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import to_categorical
import sounddevice
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder

duration = 0.5   # seconds
sample_rate=22050

loadmodel=load_model('saved_models/audio_classification.hdf5')

labels=['Am','Bb','Bdim','C', 'Dm', 'Em', 'F', 'G']

labelencoder=LabelEncoder()
labels=to_categorical(labelencoder.fit_transform(labels))


def extract_features():
    X = sounddevice.rec(int(duration * sample_rate), samplerate=sample_rate, channels=1)
    sounddevice.wait()
    X = np.squeeze(X)
    mfccs_features = librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40)
    mfccs_scaled_features = np.mean(mfccs_features.T,axis=0)
    mfccs_scaled_features=mfccs_scaled_features.reshape(1,-1)
    return mfccs_scaled_features



if __name__ == "__main__":
    while True:
        features = extract_features()
        
        prediction=loadmodel.predict(features)
        predicted_label = np.argmax(prediction, axis=1)
        prediction_class = labelencoder.inverse_transform(predicted_label) 
        print ("prediction:", prediction_class)
