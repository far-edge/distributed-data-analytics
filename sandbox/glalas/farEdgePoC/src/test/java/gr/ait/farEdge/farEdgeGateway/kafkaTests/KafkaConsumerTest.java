package gr.ait.farEdge.farEdgeGateway.kafkaTests;

import gr.ait.farEdge.farEdgeGateway.kafka.KafkaJavaConsumer;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

/**
 * Created by glalas-dev on 9/22/2017.
 */
public class KafkaConsumerTest {

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerTest.class);

    @Before
    public void setUp() throws IOException {
        logger.info("***************KafkaJavaConsumer Class Test***************");
    }

    @Test
    public void consumerTest() {
        String topic= "farEdge-analytics";
        logger.info("Starting consumer test :");
        logger.info("Consuming topic :{}", topic);
        KafkaJavaConsumer consumer = new KafkaJavaConsumer();
        try {
            consumer.runConsumer(topic);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @After
    public void tearDown(){

    }
}
