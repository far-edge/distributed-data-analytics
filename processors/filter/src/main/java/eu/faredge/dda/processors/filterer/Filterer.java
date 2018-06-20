package eu.faredge.dda.processors.filterer;

import java.util.Properties;

import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.Consumed;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Produced;

public class Filterer {

    public static void main(String... args) {

        // Configure the stream.
        final Properties configuration = new Properties();

        configuration.put(StreamsConfig.APPLICATION_ID_CONFIG, System.getProperty("NAME", "filterer"));
        configuration.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG,
                System.getProperty("BOOTSTRAP_SERVER", "localhost:9092"));
        configuration.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        configuration.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        configuration.put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 10 * 1000);
        configuration.put(StreamsConfig.CACHE_MAX_BYTES_BUFFERING_CONFIG, 0);

        final Serde<String> stringSerde = Serdes.String();

        final StreamsBuilder builder = new StreamsBuilder();

        builder.stream("filterer-source", Consumed.with(stringSerde, stringSerde)).to("filterer-sink", Produced.with(stringSerde, stringSerde));

        final KafkaStreams streams = new KafkaStreams(builder.build(), configuration);
        streams.cleanUp();
        streams.start();

        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }
}
