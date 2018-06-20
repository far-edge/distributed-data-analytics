package eu.faredge.dda.processors.common.config;

import org.apache.kafka.streams.KafkaStreams;

/**
 * Configuration for a FAR-EDGE processor.
 * <p>
 * Each FAR-EDGE processor corresponds to a {@link KafkaStreams} instance.
 */
public class ProcessorConfig {

    /**
     * The configuration property that contains the processor identifier.
     */
    public static final String PROCESSOR_ID_CONFIG = "faredge.processor.id";

    /**
     * The configuration property that contains the data sink identifier (i.e., the
     * ID of the corresponding data source manifest).
     */
    public static final String SINK_ID_CONFIG = "faredge.sink.id";

}
