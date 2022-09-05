import asyncio
from fastapi import FastAPI
from app.router import router
from app.messaging.kafka import KafkaAdaptor
from aiokafka import ConsumerRecord

loop = asyncio.get_event_loop()
app = FastAPI()
app.include_router(router, tags=["root"])
kafka = KafkaAdaptor.getInstance()

def printMessage(msg: ConsumerRecord):
    print('message received ' + str(msg.value))

@app.on_event("startup")
async def startup_event():
    kafka.assignCallback(printMessage)
    await kafka.initialize()
    await kafka.startConsume()
    
@app.on_event("shutdown")
async def shutdown_event():
    await kafka.__exit__()

@app.get("/message")
async def message():
    await kafka.sendMessage("Hello World")
    return {"message": "Message sent"}