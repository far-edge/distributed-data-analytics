package gr.ait.farEdge.farEdgeGateway.kafka;

import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.common.serialization.LongDeserializer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.Properties;

/**
 * Created by glalas-dev on 9/22/2017.
 */
public class KafkaJavaConsumer {

    private final static String BOOTSTRAP_SERVERS = "localhost:9092,localhost:9093,localhost:9094";
    //TODO CONFIGURE SLFJ4 LOGGER PROPERLY!
    private final static Logger log = LoggerFactory.getLogger(KafkaJavaConsumer.class);

    private static Consumer<Long, String> createConsumer(String topic) {
        final Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        props.put(ConsumerConfig.GROUP_ID_CONFIG,"FarEdgeGateway");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, LongDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        // Create the consumer using props.
        final Consumer<Long, String> consumer = new org.apache.kafka.clients.consumer.KafkaConsumer<Long, String>(props);
        // Subscribe to the topic.
        consumer.subscribe(Collections.singletonList(topic));
        return consumer;
    }

    public void runConsumer(String topic) throws InterruptedException {
        final Consumer<Long, String> consumer = createConsumer(topic);
        final int giveUp = 100;   int noRecordsCount = 0;
        while (true) {
            final ConsumerRecords<Long, String> consumerRecords = consumer.poll(1000);
            if (consumerRecords.count()==0) {
                noRecordsCount++;
                if (noRecordsCount > giveUp) break;
                else continue;
            }
            consumerRecords.forEach(record -> {
                //TODO CONFIGURE SLFJ4 LOGGER PROPERLY!
//                log.info("(KEY, VALUE, PARTITION, OFFSET)");
//                log.info("CONSUMER RECORD : ({} {} {} {})", record.key(), record.value(), record.partition(), record.offset());
                System.out.printf("Consumer Record:(%d, %s, %d, %d)\n",
                        record.key(), record.value(),
                        record.partition(), record.offset());
            });

            consumer.commitAsync();
        }
        consumer.close();
//        log.info("DONE");
        System.out.printf("DONE");
    }
}
