package eu.faredge.dda.processors.common.models;

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
         * When this observation was made (or generated).
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
         * Gets when this observation was made (or generated).
         * 
         * @return when this observation was made (or generated).
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
    }
}
