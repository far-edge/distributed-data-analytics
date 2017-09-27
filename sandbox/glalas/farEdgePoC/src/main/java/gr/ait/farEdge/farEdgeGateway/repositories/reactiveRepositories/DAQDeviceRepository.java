package gr.ait.farEdge.farEdgeGateway.repositories.reactiveRepositories;

import gr.ait.farEdge.farEdgeGateway.model.DAQDevice;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

/**
 * Created by glalas-dev on 9/21/2017.
 */
public interface DAQDeviceRepository extends ReactiveMongoRepository<DAQDevice, String> {

    Flux<DAQDevice> findByTopic(String topic);

}
