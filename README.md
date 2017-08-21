# node-server-tester
Tests a node server firing generated requests (using its Swagger spec) at it

## Usage
```
import { testServer } from '@springworks/server-tester';
testServer('http://locahost:3001/', swagger_spec);
```
