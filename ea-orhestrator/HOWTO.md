#### Get all EaInstances.

    curl -X GET http://localhost:8888/api/ea-instances

#### Launch a new EaInstance.

    curl -X POST http://localhost:8888/api/ea-instances -H 'Content-Type: application/json' -d '{ "id": "111-22-3333", "processors": [ { "id": "111-22-3333-1", "type": "source/mysql", "configuration": { "url": "jdbc:mysql://localhost:3306/test?user=test&password=test", "table": "locations" }, "status": "NOT_RUNNING" }, { "id": "111-22-3333-2", "type": "sink/file", "configuration": { "file": "/tmp/locations.txt", "topic": "mysql-locations" }, "status": "NOT_RUNNING" } ], "status": "NOT_RUNNING" }'

#### Terminate an EaInstance.

    curl -X DELETE http://localhost:8888/api/ea-instances/111-22-3333

#### Register the existing EaProcessorTypes.

    curl -X POST http://localhost:8888/api/ea-processor-types -H 'Content-Type: application/json' -d '{ "name": "source/mysql" }'
    curl -X POST http://localhost:8888/api/ea-processor-types -H 'Content-Type: application/json' -d '{ "name": "sink/file" }'
    curl -X POST http://localhost:8888/api/ea-processor-types -H 'Content-Type: application/json' -d '{ "name": "transformer/word-counter" }'

#### Get all registered EaProcessorTypes.

    curl -X GET http://localhost:8888/api/ea-processor-types

#### Unregister all existing EaProcessorTypes.

    curl -X DELETE http://localhost:8888/api/ea-processor-types/source/mysql
    curl -X DELETE http://localhost:8888/api/ea-processor-types/sink/file
    curl -X DELETE http://localhost:8888/api/ea-processor-types/transformer/word-counter
