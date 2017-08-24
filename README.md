# node-server-tester
Tests a node server firing generated requests (using its Swagger spec) at it

## Usage
```javascript
import { testServer } from '@springworks/server-tester';
testServer({ base_url: 'http://locahost', port: 3001, swagger_spec });
```
