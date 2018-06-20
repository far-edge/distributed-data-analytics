package eu.faredge.dda.processors.common.serialization;

import java.util.Map;

import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Deserializer;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * This class represents deserializers that convert JSON chunks to Java objects.
 * 
 * @param <T>
 *            The type of the objects.
 */
public class JsonDeserializer<T> implements Deserializer<T> {

    /**
     * The object mapper.
     */
    private ObjectMapper objectMapper = new ObjectMapper();

    /**
     * The class.
     */
    private Class<T> clazz;

    /**
     * Constructs a new JSON deserializer for objects of the specified class.
     * 
     * @param clazz
     *            the class.
     */
    public JsonDeserializer(Class<T> clazz) {
        this.clazz = clazz;
    }

    /**
     * Configures this JSON deserializer.
     */
    public void configure(Map<String, ?> configs, boolean isKey) {
        // Nothing to configure.
    }

    /**
     * Converts the specified JSON chunk from the specified topic into an object.
     */
    public T deserialize(String topic, byte[] data) {
        if (data == null) {
            return null;
        }
        try {
            return objectMapper.readValue(data, clazz);
        } catch (Exception e) {
            throw new SerializationException("Failed to deserialize.", e);
        }
    }

    /**
     * Closes this JSON deserializer.
     */
    public void close() {
        // Nothing to close.
    }
}