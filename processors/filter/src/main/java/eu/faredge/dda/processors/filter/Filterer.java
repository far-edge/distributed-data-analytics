package eu.faredge.dda.processors.filter;

import java.util.Arrays;
import java.util.Properties;
import java.util.function.Predicate;

import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.streams.Consumed;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.Produced;

import eu.faredge.dda.processors.common.config.ProcessorConfig;
import eu.faredge.dda.processors.common.models.DataSet;
import eu.faredge.dda.processors.common.models.DataSet.Observation;
import eu.faredge.dda.processors.common.serialization.DataSetDeserializer;
import eu.faredge.dda.processors.common.serialization.DataSetSerializer;
import eu.faredge.dda.processors.common.serialization.Serdes;

/**
 * This class represents filterers, i.e. streaming applications that filter data
 * from the input topic based on some condition and write it to the output
 * topic.
 */
public class Filterer {

    /**
     * All supported operators.
     */
    private static enum Operators {
        EQ, GE, GT, LE, LT, NE
    }

    public static void main(String... args) {

        // Configure.
        final Properties configuration = new Properties();
        configuration.put(StreamsConfig.APPLICATION_ID_CONFIG, System.getProperty(ProcessorConfig.PROCESSOR_ID_CONFIG));
        configuration.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG,
                String.format("%s:%s", System.getProperty("faredge.input.0.host", "localhost"),
                        System.getProperty("faredge.input.0.port", "9092")));
        configuration.put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 10 * 1000);
        configuration.put(StreamsConfig.CACHE_MAX_BYTES_BUFFERING_CONFIG, 0);

        // Set up serializers and deserializers.
        final Serde<DataSet> serde = Serdes.serdeFrom(new DataSetSerializer(), new DataSetDeserializer());

        // Define the processing topology.
        final StreamsBuilder builder = new StreamsBuilder();
        final Operators operator = Operators.valueOf(System.getProperty("faredge.operator"));
        final Float threshold = Float.parseFloat(System.getProperty("faredge.threshold"));
        final Predicate<Observation> p = (o) -> {
            final Float v = Float.parseFloat((String)o.getValue());
            switch (operator) {
            case EQ:
                return v.compareTo(threshold) == 0;
            case GE:
                return v.compareTo(threshold) >= 0;
            case GT:
                return v.compareTo(threshold) > 0;
            case LE:
                return v.compareTo(threshold) <= 0;
            case LT:
                return v.compareTo(threshold) < 0;
            case NE:
                return v.compareTo(threshold) != 0;
            default:
                return false;
            }
        };
        builder.stream(System.getProperty("faredge.input.0.topic"), Consumed.with(Serdes.String(), serde))
                .filter((key, value) -> {
                    return Arrays.stream(value.getObservation()).anyMatch(p);
                }).map((key, value) -> {
                    final DataSet newValue = new DataSet();
                    newValue.setId(value.getId());
                    newValue.setDataSourceManifestReferenceID(value.getDataSourceManifestReferenceID());
                    newValue.setTimestamp(value.getTimestamp());
                    newValue.setObservation(Arrays.stream(value.getObservation()).filter(p).toArray(Observation[]::new));
                    return KeyValue.pair(key, newValue);
                }).to(System.getProperty("faredge.output.topic"), Produced.with(Serdes.String(), serde));

        final KafkaStreams streams = new KafkaStreams(builder.build(), configuration);

        // Clean up the local state.
        streams.cleanUp();

        // Start the processing topology.
        streams.start();

        // On SIGTERM, shut everything down gracefully.
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }

}
