package gr.ait.farEdge.farEdgeGateway.repositories.reactiveRepositories;

import gr.ait.farEdge.farEdgeGateway.model.Barcode;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

import java.util.Date;

/**
 * Created by glalas-dev on 9/21/2017.
 */
public interface BarcodeRepository extends ReactiveMongoRepository<Barcode, String> {
//
//    Flux<Barcode> findByName(String name);
//
//    Flux<Barcode> findByDate(Date dateTMS);
}