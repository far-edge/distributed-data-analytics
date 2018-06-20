package eu.faredge.dda.processors.filterer;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.serialization.Serializer;
import org.apache.kafka.streams.Consumed;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Produced;

public class JsonFilterer {

    static public class Person {
        public String name;
        public int age;
    }
    
    public static void main(String... args) {

        // Configure the stream.
        final Properties configuration = new Properties();

        configuration.put(StreamsConfig.APPLICATION_ID_CONFIG, System.getProperty("NAME", "filterer"));
        configuration.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG,
                System.getProperty("BOOTSTRAP_SERVER", "localhost:9092"));
        configuration.put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 10 * 1000);
        configuration.put(StreamsConfig.CACHE_MAX_BYTES_BUFFERING_CONFIG, 0);

        final StreamsBuilder builder = new StreamsBuilder();

        Map<String, Object> props = new HashMap<>();

        final Serializer<Person> ser = new JsonPOJOSerializer<>();
        props.put("JsonPOJOClass", Person.class);
        ser.configure(props, false);

        final Deserializer<Person> des = new JsonPOJODeserializer<>();
        props.put("JsonPOJOClass", Person.class);
        des.configure(props, false);
        
        final Serde<Person> serdes = Serdes.serdeFrom(ser, des);
        builder.stream("persons-in", Consumed.with(Serdes.String(), serdes)).filter((key, value) =to("persons-out", Produced.with(Serdes.String(), serdes));

        final KafkaStreams streams = new KafkaStreams(builder.build(), configuration);
        streams.cleanUp();
        streams.start();

        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }
}
