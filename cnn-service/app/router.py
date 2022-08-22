import string
from tempfile import SpooledTemporaryFile
from uuid import uuid4
from fastapi import APIRouter, HTTPException, UploadFile, File
from app.model import PredictionResponse
# from app.messaging.kafka import Kafka
from PIL import Image
import io

SIZE = 28, 28
SIZE_3D = 28, 28, 3


router = APIRouter()

# kafka = Kafka.getInstance()
# kafka.declare_topic('hola')

import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.image import random_crop, random_brightness, adjust_gamma
import numpy as np

model = tf.keras.models.load_model('./app/model.h5')

classes = {
    'akiec':  'Actinic keratoses and intraepithelial carcinomae',  
    'bcc':    'basal cell carcinoma', 
    'bkl':    'benign keratosis-like lesions', 
    'df':     'dermatofibroma',
    'mel':    'melanoma', 
    'nv':     'melanocytic nevi', 
    'vasc':   'pyogenic granulomas and hemorrhage', 
}

def predict(image):
    image = image.resize(SIZE)
    image = img_to_array(image)

    image = random_brightness(image, 10)
    image = random_crop(image, size = SIZE_3D)
    image = tf.expand_dims(image, 0)
    predictions = model.predict(image)
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

@router.post("/predict")
async def add_post(
    payload: UploadFile = File(...),
    ) -> PredictionResponse:
    try:
        payloadBytes = await payload.read()
        image = Image.open(io.BytesIO(payloadBytes))
        print(image)
        prediction = predict(image)
        return PredictionResponse(
            id=uuid4(),
            remoteImagePath="",
            dx=prediction['dx'],
            diseaseName=prediction['diseaseName'],
            createdAt="",
            predicted=True,
            confidence=prediction['confidence']
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))