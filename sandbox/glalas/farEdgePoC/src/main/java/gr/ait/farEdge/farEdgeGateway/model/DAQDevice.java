package gr.ait.farEdge.farEdgeGateway.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

/**
 * Created by glalas-dev on 9/20/2017.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document
@JsonIgnoreProperties(ignoreUnknown = true)
public class DAQDevice {

    @Id
    private String id;
    private String topic; /*This is the mqtt topic. It is named after the device’s mac address ommiting the “:” e.g. (28:63:36:83:3B:96) = 286336833B96 */
    private List<Barcode> barcodeList;
    private String PRD_RATE; /*the current production rate */
    private String PRD_C_BOT; /* the number of “cuts” (items that the sensor has measured) (production count) since the boot of the DAQ device */
    private String T_BOT; /*the time (timespan) since the machine was booted. Booting a  DAQ resets barcodes, timestamps, production counts etc. */
    private String PRD_SPEED; /*the speed in meters/sec of the machinery. Special sensor is required*/
    private String UPTIME;  /*If a barcode is scanned, then this time period (timespan) represents the time that the machinery was producing */
    private String DOWNTIME; /*If a barcode is scanned, this timespan represents the time the machinery was idle */
    private String BOOT; /* It signals a boot (used for knowing when the counters of the DAQ were reset) */
    private String T_CUT; /*DateTime of when DAQ measured the first “product” (DateTime of the First “cut”) */
    private String IDLETIME; /*The timespan between boot and barcode scan */

}
