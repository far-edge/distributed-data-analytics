package gr.ait.farEdge.farEdgeGateway.webApi;


import gr.ait.farEdge.farEdgeGateway.model.DAQDevice;
import gr.ait.farEdge.farEdgeGateway.repositories.reactiveRepositories.DAQDeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Flux;


/**
 * Created by George Lalas on 7/9/2017.
 */
@RestController
@RequestMapping("/daq")
public class DAQDeviceController {

    @Autowired
    private DAQDeviceRepository daqDeviceRepository;

    @GetMapping
    public Flux<DAQDevice> index(){
        return daqDeviceRepository.findAll();
    }

}
