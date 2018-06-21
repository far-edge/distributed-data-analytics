package eu.faredge.dda.processors.common.models;

/**
 * This class represents locations.
 */
public class Location implements Cloneable {

    /**
     * The geographical location that this location represents.
     */
    private GeoLocation geoLocation;

    /**
     * The virtual location that this location represents.
     */
    private String virtualLocation;

    /**
     * Constructs a new location.
     */
    public Location() {

    }

    /**
     * Gets the geographical location that this location represents.
     * 
     * @return the geographical location that this location represents.
     */
    public GeoLocation getGeoLocation() {
        return geoLocation;
    }

    /**
     * Sets the geographical location that this location represents.
     * 
     * @param geoLocation
     *            the geographical location that this location represents.
     */
    public void setGeoLocation(GeoLocation geoLocation) {
        this.geoLocation = geoLocation;
        if (geoLocation != null) {
            this.virtualLocation = null;
        }
    }

    /**
     * Gets the virtual location that this location represents.
     * 
     * @return the virtual location that this location represents.
     */
    public String getVirtualLocation() {
        return virtualLocation;
    }

    /**
     * Sets the virtual location that this location represents.
     * 
     * @param virtualLocation
     *            the virtual location that this location represents.
     */
    public void setVirtualLocation(String virtualLocation) {
        this.virtualLocation = virtualLocation;
        if (virtualLocation != null) {
            this.geoLocation = null;
        }
    }

    /**
     * Constructs a new location as a clone of the specified one.
     * 
     * @param location
     *            the location to clone.
     * @return the clone.
     */
    public static final Location from(Location location) {
        final Location clone = new Location();
        if (location.geoLocation != null) {
            clone.geoLocation = GeoLocation.from(location.geoLocation);
        }
        clone.virtualLocation = location.virtualLocation;
        return clone;
    }

    /**
     * This class represents geographical locations.
     */
    public static class GeoLocation {

        /**
         * The latitude of this geographical location.
         */
        private double latitude;

        /**
         * The longitude of this geographical location.
         */
        private double longitude;

        /**
         * Constructs a new geographical location.
         */
        public GeoLocation() {

        }

        /**
         * Constructs a new geographical location with the specified coordinates.
         * 
         * @param latitude
         *            the latitude of the new geographical location.
         * @param longitude
         *            the longitude of the new geographical location.
         */
        public GeoLocation(double latitude, double longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        }

        /**
         * Gets the latitude of this geographical location.
         * 
         * @return the latitude of this geographical location.
         */
        public double getLatitude() {
            return latitude;
        }

        /**
         * Sets the latitude of this geographical location.
         * 
         * @param latitude
         *            the latitude of this geographical location.
         */
        public void setLatitude(double latitude) {
            this.latitude = latitude;
        }

        /**
         * Gets the longitude of this geographical location.
         * 
         * @return the longitude of this geographical location.
         */
        public double getLongitude() {
            return longitude;
        }

        /**
         * Sets the longitude of this geographical location.
         * 
         * @param longitude
         *            the longitude of this geographical location.
         */
        public void setLongitude(double longitude) {
            this.longitude = longitude;
        }

        /**
         * Constructs a new geographical location as a clone of the specified one.
         * 
         * @param geoLocation
         *            the geographical location to clone.
         * @return the clone.
         */
        public static final GeoLocation from(GeoLocation geoLocation) {
            return new GeoLocation(geoLocation.latitude, geoLocation.longitude);
        }
    }
}
