The example is taken from [here](https://www.confluent.io/blog/simplest-useful-kafka-connect-data-pipeline-world-thereabouts-part-1/).

It just monitors a table in a MqSQL database for updates, and writes those updates into a file in
the local filesystem.

**Step#1.** Create a MySQL user, database and table.

    GRANT ALL PRIVILEGES ON *.* TO 'test'@'localhost' IDENTIFIED BY 'test';
    CREATE DATABASE test;
    USE test;
    CREATE TABLE locations (entity INT, location VARCHAR(255),create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP , update_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP );

**Step #2.** Launch the EaInstance.

    curl -X POST http://localhost:8888/api/ea-instances -H 'Content-Type: application/json' -d '{ "id": "111-22-3333", "processors": [ { "id": "111-22-3333-1", "type": "source/mysql", "configuration": { "url": "jdbc:mysql://localhost:3306/test?user=test&password=test", "table": "locations" }, "status": "NOT_RUNNING" }, { "id": "111-22-3333-2", "type": "sink/file", "configuration": { "file": "/tmp/locations.txt", "topic": "mysql-locations" }, "status": "NOT_RUNNING" } ], "status": "NOT_RUNNING" }'

**Step #3.** Check what the MySQL source connector writes into the topic.

    ./bin/kafka-avro-console-consumer --bootstrap-server localhost:9092 \
    --property schema.registry.url=http://localhost:8081 --property print.key=true \
    --from-beginning --topic mysql-locations

**Step #4.** Check what the file sink connector writes into the file.

    tail -f /tmp/locations.txt

**Step #5.** Insert and update some data.

    INSERT INTO locations(entity, location) VALUES (1, 'New York');
    INSERT INTO locations(entity, location) VALUES (2, 'San Fransisco');
    UPDATE locations SET location='Athens' WHERE entity=1;

The source connector writes the following messages to the topic.

    null  {"entity":{"int":1},"location":{"string":"New York"},"create_ts":1512549313000,"update_ts":1512549313000}
    null  {"entity":{"int":2},"location":{"string":"San Fransisco"},"create_ts":1512549328000,"update_ts":1512549328000}
    null  {"entity":{"int":1},"location":{"string":"Athens"},"create_ts":1512549313000,"update_ts":1512549344000}

The sink connector writes the following lines in the file.

    Struct{entity=1,location=New York,create_ts=Wed Dec 06 10:35:13 EET 2017,update_ts=Wed Dec 06 10:35:13 EET 2017}
    Struct{entity=2,location=San Fransisco,create_ts=Wed Dec 06 10:35:28 EET 2017,update_ts=Wed Dec 06 10:35:28 EET 2017}
    Struct{entity=1,location=Athens,create_ts=Wed Dec 06 10:35:13 EET 2017,update_ts=Wed Dec 06 10:35:44 EET 2017}
