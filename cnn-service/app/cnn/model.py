import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.image import random_crop, random_brightness, adjust_gamma

from PIL import Image

SIZE = 28, 28
SIZE_3D = 28, 28, 3

classes = {
    'akiec':  'Actinic keratoses and intraepithelial carcinomae',  
    'bcc':    'basal cell carcinoma', 
    'bkl':    'benign keratosis-like lesions', 
    'df':     'dermatofibroma',
    'mel':    'melanoma', 
    'nv':     'melanocytic nevi', 
    'vasc':   'pyogenic granulomas and hemorrhage', 
}

class CNNModel(object):
    model: Sequential

    def __init__(self, model_path):
        self.model = load_model(model_path)

    def predict(self, image: Image):
        image = image.resize(SIZE)
        image = img_to_array(image)
        image = random_brightness(image, 10)
        image = random_crop(image, size = SIZE_3D)
        image = tf.expand_dims(image, 0)
        predictions = self.model.predict(image)
        score = tf.nn.softmax(predictions[0])
        arg_max = np.argmax(score)
        keys = list(classes.keys())
        key = keys[arg_max]
        return {
            'dx': key,
            'diseaseName': classes[key],
            'predicted': True,
            'confidence': 100 * np.max(score)
        }

    def learn(self, x, y):
        self.model.fit(x, y, epochs=10)

    def save(self, path):
        self.model.save(path)

    def reload(self, path):
        self.model = load_model(path)