package eu.faredge.dda.processors.common.serialization;

import java.util.Map;

import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serializer;

import eu.faredge.dda.processors.common.models.DataSet;

/**
 * Factory for creating serializers / deserializers.
 * <p>
 * This factory extends {@link org.apache.kafka.common.serialization.Serdes}.
 */
public class Serdes extends org.apache.kafka.common.serialization.Serdes {

    /**
     * Gets a serde that converts data sets to and from JSON chunks.
     * 
     * @return the serde.
     */
    public static Serde<DataSet> DataSet() {
        return new DataSetSerde();
    }

    /**
     * Gets a serde for the specified type.
     * 
     * @param type
     *            the type to get a serde for.
     * @return the serde.
     */
    @SuppressWarnings("unchecked")
    public static <T> Serde<T> serdeFrom(Class<T> type) {
        if (DataSet.class.isAssignableFrom(type)) {
            return (Serde<T>) DataSet();
        }
        return org.apache.kafka.common.serialization.Serdes.serdeFrom(type);
    }

    /**
     * Serializers / deserializers that convert data sets to and from JSON chunks.
     */
    public static final class DataSetSerde implements Serde<DataSet> {

        /**
         * The underlying serializer.
         */
        private final Serializer<DataSet> serializer = new DataSetSerializer();

        /**
         * The underlying deserializer.
         */
        private final Deserializer<DataSet> deserializer = new DataSetDeserializer();

        /**
         * Configures the underlying serializer and deserializer.
         */
        public void configure(Map<String, ?> configs, boolean isKey) {
            this.serializer.configure(configs, isKey);
            this.deserializer.configure(configs, isKey);
        }

        /**
         * Closes the underlying serializer and deserializer.
         */
        public void close() {
            this.serializer.close();
            this.deserializer.close();
        }

        /**
         * Gets the underlying serializer.
         */
        public Serializer<DataSet> serializer() {
            return serializer;
        }

        /**
         * Gets the underlying deserializer.
         */
        public Deserializer<DataSet> deserializer() {
            return deserializer;
        }
    }
}
