import asyncio
from fastapi import FastAPI
from app.router import router
from app.messaging.kafka import KafkaAdaptor
from aiokafka import ConsumerRecord

loop = asyncio.get_event_loop()
app = FastAPI()
app.include_router(router, tags=["root"])

kafkaTCC = KafkaAdaptor.getInstance('tcc')
kafkaPrediction = KafkaAdaptor.getInstance('prediction-confirmation')

def printMessage(msg: ConsumerRecord):
    print('message received ' + str(msg.value))

@app.on_event("startup")
async def startup_event():
    kafkaTCC.assignCallback(printMessage)
    kafkaPrediction.assignCallback(printMessage)
    await KafkaAdaptor.initializeAll()
    
@app.on_event("shutdown")
async def shutdown_event():
    await KafkaAdaptor.stopAllInstances()

@app.get("/message")
async def message():
    await kafkaTCC.sendMessage("Hello World tcc")
    await kafkaPrediction.sendMessage("Hello World prediction")
    return {"message": "Message sent"}