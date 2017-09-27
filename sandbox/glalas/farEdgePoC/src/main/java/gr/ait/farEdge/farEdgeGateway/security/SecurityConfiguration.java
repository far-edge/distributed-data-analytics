package gr.ait.farEdge.farEdgeGateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.MapUserDetailsRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsRepository;

import static org.springframework.security.core.userdetails.User.withUsername;

/**
 * Created by George Lalas on 7/9/2017.
 */
@Configuration
public class SecurityConfiguration {
    //TODO:This is a  temporary in-memory log in. To be changed
    @Bean
    UserDetailsRepository userDetailsRepository() {
        UserDetails ait = withUsername("ait").password("ait").roles("USER").build();
        UserDetails george = withUsername("glal").password("glal").roles("USER", "ADMIN").build();
        UserDetails nik = withUsername("nkef").password("nkef").roles("USER", "ADMIN").build();
        return new MapUserDetailsRepository(ait, nik, george);
    }
}