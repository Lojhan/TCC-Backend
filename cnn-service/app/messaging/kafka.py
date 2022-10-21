import asyncio
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer, AIOKafkaClient

KAFKA_TOPIC = 'tcc'
KAFKA_BOOTSTRAP_SERVERS = 'localhost:9093'

class KafkaAdaptor():
    instances: dict = {}
    topic: str
    loop: asyncio.AbstractEventLoop = None
    client: AIOKafkaClient = None
    consumer: AIOKafkaConsumer = None
    consumerTask = None
    producer: AIOKafkaProducer = None
    callbacks: list[callable]
    
    @staticmethod
    def getInstance(topic: str):
        instance = KafkaAdaptor.instances.get(topic)
        if not instance:
            KafkaAdaptor.instances[topic] = KafkaAdaptor(topic)
        return KafkaAdaptor.instances.get(topic)

    @staticmethod
    async def stopAllInstances():
        for instance in KafkaAdaptor.instances:
            await KafkaAdaptor.instances[instance].__exit__()
    
    @staticmethod
    async def initializeAll():
        for instance in KafkaAdaptor.instances:
            await KafkaAdaptor.instances[instance].initialize()

    def __init__(self, topic: str):
        self.topic = topic
        self.callbacks = []
        loop = asyncio.get_running_loop()
        if not self.instances.get(topic):
            self.loop = loop

    async def initialize(self): 
        try:       
            self.consumer = AIOKafkaConsumer(self.topic, bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS, loop=self.loop)
            self.producer = AIOKafkaProducer(bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS, loop=self.loop)
            await self.consumer.start()
            await self.producer.start()
            await self.startConsume()
            print(f'INFO:     KafkaAdaptor for topic {self.topic} initialized')
        except Exception:
            print('ERROR:     Kafka failed to initialize, retrying in 10 seconds')
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
            await self.producer.send(self.topic, message.encode('utf-8'))
        except Exception as e:
            print(e)

    async def __exit__(self):
        self.consumerTask.cancel()
        await self.consumer.stop()
        await self.producer.stop()

