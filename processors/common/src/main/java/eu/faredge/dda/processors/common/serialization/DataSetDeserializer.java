package eu.faredge.dda.processors.common.serialization;

import eu.faredge.dda.processors.common.models.DataSet;

/**
 * This class represents data sets deserializers, i.e. objects that convert JSON
 * chunks to data sets.
 *
 * @see DataSet
 */
public class DataSetDeserializer extends JsonDeserializer<DataSet> {

    /**
     * Constructs a new data set deserializer.
     */
    public DataSetDeserializer() {
        super(DataSet.class);
    }
}
