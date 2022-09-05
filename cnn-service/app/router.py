from uuid import uuid4
from fastapi import HTTPException, UploadFile, File, APIRouter
from app.model import PredictionResponse
from app.cnn.model import CNNModel
from PIL import Image
import io

model = CNNModel('./app/model.h5')

router = APIRouter()

@router.post("/predict")
async def add_post(
    payload: UploadFile = File(...),
    ) -> PredictionResponse:
    try:
        payloadBytes = await payload.read()
        image = Image.open(io.BytesIO(payloadBytes))
        prediction = model.predict(image)
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