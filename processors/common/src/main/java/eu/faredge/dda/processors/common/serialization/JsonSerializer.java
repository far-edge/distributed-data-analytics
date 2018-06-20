package eu.faredge.dda.processors.common.serialization;

import java.util.Map;

import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Serializer;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * This class represents serializers that convert Java objects to JSON chunks.
 * 
 * @param <T>
 *            The type of the objects.
 */
public class JsonSerializer<T> implements Serializer<T> {

    /**
     * The object mapper.
     */
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Constructs a new JSON serializer.
     */
    public JsonSerializer() {
    }

    /**
     * Configures this JSON serializer.
     */
    public void configure(Map<String, ?> props, boolean isKey) {
        // Nothing to configure.
    }

    /**
     * Converts the specified object into a JSON chunk for the specified topic.
     */
    public byte[] serialize(String topic, T data) {
        if (data == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsBytes(data);
        } catch (Exception e) {
            throw new SerializationException("Failed to serialize.", e);
        }
    }

    /**
     * Closes this JSON serializer.
     */
    public void close() {
        // Nothing to close.
    }
}