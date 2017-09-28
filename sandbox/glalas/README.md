# FarEdge Analytics Engine PoC-SandBox

## Prerequisites
1. MongoDB community edition v.3.4.5 installed and configured
2. Apache Kafka v.0.11.0.1 installed and configured
3. Project SDK : Java 1.8
### Application Properties:
You can find and modify the application properties under : 
```
/src/main/resources/application.properties
```
and the Logging properties for Apache Kafka under : 
```
/src/main/resources/logback.xml
```
##### Default Properties:
* server.port : 8085  
* spring.data.mongodb.host=localhost
* spring.data.mongodb.port=27017
* Apache Kafka properties like "BOOTSTRAP_SERVERS" are currently hardcoded inside ```.../farEdgeGateway/kafka/KafkaJavaProducer.java```
and ```.../farEdgeGateway/kafka/KafkaJavaConsumer.java``` classes. Currently we are using the default Kafka properties, e.g. for hostname & port:```localhost:9092```.
This will change on future versions. The Apache Kafka properties will be moved to application.properties file.
## Install & Run the application
#### Running from an IDE
1. Clone the project from : https://github.com/far-edge/EdgeAnalyticsEngine.git
2. Import the project to the IDE of your choice as Maven Project. You can also import it as Spring Boot project (Eclipse, IDEA)
and select FarEdgeGatewayApplication.java under:
```
/src/main/java/gr/ait/farEdge/farEdgeGateway/FarEdgeGatewayApplication.java
```
##### Running using Spring Boot maven plugin :
```
$ mvn spring-boot:run
```
This is similar with importing the project to the IDE of you choice as Spring Boot project and then building it
####Running as a packaged application
Since we use the Spring Boot Maven to create an executable jar we can run the application using ```java -jar``` :
```
$ java -jar target/farEdgeGateway-0.0.1-SNAPSHOT.jar
```
##### Installation as Service (supporting Linux/Unix & Windows OS )
* [Spring Boot Official Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment-install.html#deployment-service)- Starting Spring Boot applications as a service
* [Spring Boot Official Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment-install.html#deployment-script-customization
) - Official Documentation to customize a startup script

#### Checking Status & Health
- Status end-point :
`http://localhost:8085/application/status` and this should respond with : `{"status":"UP"}`
- Health end-point : 
`http://localhost:8085/application/health`. This should respond with : `{"status":"UP","details":{"mongo":{"status":"UP","details":{"version":"3.4.5"}},"diskSpace":{"status":"UP","details":{"total":475981840384,"free":396308979712,"threshold":10485760}}}}`
