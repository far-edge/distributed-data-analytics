package gr.ait.farEdge.farEdgeGateway.webApi.RoutesConfiguration;


import gr.ait.farEdge.farEdgeGateway.model.DAQDevice;
import gr.ait.farEdge.farEdgeGateway.repositories.reactiveRepositories.DAQDeviceRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;

import static org.springframework.web.reactive.function.server.RequestPredicates.method;
import static org.springframework.web.reactive.function.server.RequestPredicates.path;
import static org.springframework.web.reactive.function.server.RouterFunctions.nest;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;

/**
 * Created by George Lalas on 7/9/2017.
 */
@Configuration
public class DAQRoutesConfiguration {


    @Bean
    RouterFunction<?> routes(DAQDeviceRepository daqDeviceRepository) {
        return nest(path("/daq"),

                route(RequestPredicates.GET("/{id}"),
                        request -> ok().body(daqDeviceRepository.findById(request.pathVariable("id")), DAQDevice.class))

                        .andRoute(method(HttpMethod.POST),
                                request -> {
                                    daqDeviceRepository.insert(request.bodyToMono(DAQDevice.class)).subscribe();
                                    return ok().build();
                                })
        );
    }
}