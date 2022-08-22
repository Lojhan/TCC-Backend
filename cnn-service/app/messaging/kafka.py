from kafka import KafkaProducer, KafkaClient

class Kafka():
    instance = None

    producer: KafkaProducer = None
    client: KafkaClient = None

    def __init__(self):
        if not self.instance:
            self.producer = KafkaProducer(bootstrap_servers='kafka-tcc:9092')
            # self.client = KafkaClient(configs={ 'bootstrap_servers': 'kafka-deconto:9092' })
            # self.client.add_topic('hola')
            print("Kafka initialized")


    @staticmethod
    def getInstance():
        if not Kafka.instance:
            Kafka.instance = Kafka()
        return Kafka.instance

    def declare_topic(self, topic) -> None:
        self.producer.create_topic(topic)
        

    def publish_message(self, body="empty") -> None:
        self.producer.send('deconto', body)

    def __exit__(self):
        # self.client.close()
        self.producer.close()