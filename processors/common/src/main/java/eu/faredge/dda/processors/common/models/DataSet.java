package eu.faredge.dda.processors.common.models;

import java.util.Arrays;
import java.util.Date;

/**
 * This class represents data sets.
 */
public class DataSet {

    /**
     * The ID of this data set.
     */
    private String id;

    /**
     * The ID of the data source where this data set comes from.
     */
    private String dataSourceManifestReferenceID;

    /**
     * When this data set was generated.
     */
    private Date timestamp;

    /**
     * The observations in this data set.
     * 
     * NOTE: Assume that each data set has exactly one observation.
     */
    private Observation[] observation;

    /**
     * Constructs a new data set.
     */
    public DataSet() {

    }

    /**
     * Gets the ID of this data set.
     * 
     * @return the ID of this data set.
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the ID of this data set.
     * 
     * @param id
     *            the ID of this data set.
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Gets the ID of the data source where this data set comes from.
     * 
     * @return the ID of the data source where this data set comes from.
     */
    public String getDataSourceManifestReferenceID() {
        return dataSourceManifestReferenceID;
    }

    /**
     * Sets the ID of the data source where this data set comes from.
     * 
     * @param dataSourceManifestReferenceID
     *            the ID of the data source where this data set comes from.
     */
    public void setDataSourceManifestReferenceID(String dataSourceManifestReferenceID) {
        this.dataSourceManifestReferenceID = dataSourceManifestReferenceID;
    }

    /**
     * Gets when this data set was generated.
     * 
     * @return when this data set was generated.
     */
    public Date getTimestamp() {
        return timestamp;
    }

    /**
     * Sets when this data set was generated.
     * 
     * @param timestamp
     *            when this data set was generated.
     */
    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * Gets the observations in this data set.
     * 
     * @return the observations in this data set.
     */
    public Observation[] getObservation() {
        return observation;
    }

    /**
     * Sets the observations in this data set.
     * 
     * @param observation
     *            the observations in this data set.
     */
    public void setObservation(Observation[] observation) {
        this.observation = observation;
    }

    /**
     * Constructs a new data set as a clone of the specified one.
     * 
     * @param dataSet
     *            the observation to clone.
     * @return the clone.
     */
    public static final DataSet from(DataSet dataSet) {
        final DataSet clone = new DataSet();
        clone.id = dataSet.id;
        clone.dataSourceManifestReferenceID = dataSet.dataSourceManifestReferenceID;
        if (dataSet.timestamp != null) {
            clone.timestamp = new Date(dataSet.timestamp.getTime());
        }
        if (dataSet.observation != null) {
            clone.observation = Arrays.copyOf(dataSet.observation, dataSet.observation.length);
        }
        return clone;
    }

    /**
     * This class represents observations in a data set.
     */
    public static class Observation {

        /**
         * The ID of this observation.
         */
        private String id;

        /**
         * The ID of data kind of this observation.
         */
        private String dataKindReferenceID;

        /**
         * Where this observation was made.
         */
        private Location location;

        /**
         * When this observation was made.
         */
        private Date timestamp;

        /**
         * The value in this observation.
         */
        private Object value;

        /**
         * Constructs a new observation.
         */
        public Observation() {

        }

        /**
         * Gets the ID of this observation.
         * 
         * @return the ID of this observation.
         */
        public String getId() {
            return id;
        }

        /**
         * Sets the ID of this observation.
         * 
         * @param id
         *            the ID of this observation.
         */
        public void setId(String id) {
            this.id = id;
        }

        /**
         * Gets the ID of data kind of this observation.
         * 
         * @return the ID of data kind of this observation.
         */
        public String getDataKindReferenceID() {
            return dataKindReferenceID;
        }

        /**
         * Sets the ID of data kind of this observation.
         * 
         * @param dataKindReferenceID
         *            the ID of data kind of this observation.
         */
        public void setDataKindReferenceID(String dataKindReferenceID) {
            this.dataKindReferenceID = dataKindReferenceID;
        }

        /**
         * Gets where this observation was made.
         * 
         * @return where this observation was made.
         */
        public Location getLocation() {
            return location;
        }

        /**
         * Sets where this observation was made.
         * 
         * @param location
         *            where this observation was made.
         */
        public void setLocation(Location location) {
            this.location = location;
        }

        /**
         * Gets when this observation was made.
         * 
         * @return when this observation was made.
         */
        public Date getTimestamp() {
            return timestamp;
        }

        /**
         * Sets when this observation was made (or generated).
         * 
         * @param timestamp
         *            when this observation was made (or generated).
         */
        public void setTimestamp(Date timestamp) {
            this.timestamp = timestamp;
        }

        /**
         * Gets the value in this observation.
         * 
         * @return the value in this observation.
         */
        public Object getValue() {
            return value;
        }

        /**
         * Sets the value in this observation.
         * 
         * @param value
         *            the value in this observation.
         */
        public void setValue(Object value) {
            this.value = value;
        }

        /**
         * Constructs a new observation as a clone of the specified one.
         * 
         * @param observation
         *            the observation to clone.
         * @return the clone.
         */
        public static final Observation from(Observation observation) {
            final Observation clone = new Observation();
            clone.id = observation.id;
            clone.dataKindReferenceID = observation.dataKindReferenceID;
            if (observation.location != null) {
                clone.location = Location.from(observation.location);
            }
            if (observation.timestamp != null) {
                clone.timestamp = new Date(observation.timestamp.getTime());
            }
            // NOTE: Let's assume that the value is something immutable.
            clone.value = observation.value;
            return clone;
        }
    }
}
