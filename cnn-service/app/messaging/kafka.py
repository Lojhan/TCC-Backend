import asyncio
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer, AIOKafkaClient

KAFKA_TOPIC = 'tcc'
KAFKA_BOOTSTRAP_SERVERS = 'kafka-tcc:9092'

class KafkaAdaptor():
    instance = None
    loop: asyncio.AbstractEventLoop = None
    client: AIOKafkaClient = None
    consumer: AIOKafkaConsumer = None
    consumerTask = None
    producer: AIOKafkaProducer = None
    callbacks: list[callable] = []
    
    @staticmethod
    def getInstance():
        if not KafkaAdaptor.instance:
            KafkaAdaptor.instance = KafkaAdaptor()
        return KafkaAdaptor.instance

    def __init__(self):
        loop = asyncio.get_running_loop()
        if not self.instance:
            self.loop = loop
            self.instance = self

    async def initialize(self): 
        try:       
            self.consumer = AIOKafkaConsumer(KAFKA_TOPIC, bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS, loop=self.loop)
            self.producer = AIOKafkaProducer(bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS, loop=self.loop)
            await self.consumer.start()
            await self.producer.start()
            print('Kafka initialized')
        except Exception as e:
            print(e)
            print('Kafka failed to initialize, retrying in 10 seconds')
            await asyncio.sleep(10)
            await self.initialize()

    async def startConsume(self):
        self.consumerTask = asyncio.create_task(self._consume(self.consumer, self.callbacks))

    async def _consume(self, consumer: AIOKafkaConsumer, callbacks: list):
        try:
            async for msg in consumer:
                for callback in callbacks:
                    callback(msg)   
        except Exception as e:
            print(e)

    def assignCallback(self, callback: callable):
        self.callbacks.append(callback)

    async def sendMessage(self, message: str):
        try:
            await self.producer.send(KAFKA_TOPIC, message.encode('utf-8'))
        except Exception as e:
            print(e)

    async def __exit__(self):
        self.consumerTask.cancel()
        await self.consumer.stop()
        await self.producer.stop()

