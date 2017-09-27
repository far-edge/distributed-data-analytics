package gr.ait.farEdge.farEdgeGateway.model;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by glalas-dev on 9/21/2017.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Barcode { /*The barcode scanned. It is usually the production order but it could be other things like the operator working on the machinery */

    @Getter
    @Setter
    private String name;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Setter
    @Getter
    private Date TMS; /*The datetime the barcode was scanned. */

}
