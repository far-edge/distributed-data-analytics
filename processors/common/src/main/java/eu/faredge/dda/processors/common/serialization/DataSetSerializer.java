package eu.faredge.dda.processors.common.serialization;

import eu.faredge.dda.processors.common.models.DataSet;

/**
 * This class represents data sets serializers, i.e. objects that convert data
 * sets to JSON chunks.
 *
 * @see DataSet
 */
public class DataSetSerializer extends JsonSerializer<DataSet> {

    /**
     * Constructs a new data set serializer.
     */
    public DataSetSerializer() {

    }
}
