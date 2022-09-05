import uuid
from pydantic import BaseModel, Field
from fastapi import UploadFile

class PredictionPayload(BaseModel):
    payload: UploadFile = Field(..., description="File to be predicted")

    @staticmethod 
    def fromDict(data: dict):
        return PredictionPayload(**data)
    
    def toDict(self):
        return self.dict()

class PredictionResponse(BaseModel):
    id: uuid.UUID = Field(..., description="Unique id of the prediction")
    remoteImagePath: str = Field(..., description="Remote image path")
    dx: str = Field(..., description="Predicted dx")
    diseaseName: str = Field(..., description="Disease name")
    createdAt: str = Field(..., description="Created at")
    predicted: bool = Field(..., description="Predicted")
    confidence: float = Field(..., description="Confidence")

    @staticmethod 
    def fromDict(data: dict):
        return PredictionResponse(**data)
    
    def toDict(self):
        return self.dict()