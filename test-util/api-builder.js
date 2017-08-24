export function ApiBuilder(api) {
  this.api = api;
}

ApiBuilder.prototype.setBasePath = function(base_path) {
  this.api.basePath = base_path;
  return this;
};

function Path(parent, path) {
  this.parent = parent;
  this.path = path;
}

function Operation(parent, operation) {
  this.parent = parent;
  this.operation = operation;
}

Operation.prototype.addPathParameter = function(path_param) {
  if (!this.operation.parameters) {
    this.operation.parameters = [];
  }
  path_param.in = 'path';
  path_param.required = true;
  this.operation.parameters.push(path_param);
  return this;
};

Operation.prototype.addQueryParameter = function(path_param) {
  if (!this.operation.parameters) {
    this.operation.parameters = [];
  }
  path_param.in = 'query';
  this.operation.parameters.push(path_param);
  return this;
};

Operation.prototype.addBodyParameter = function(path_param) {
  if (!this.operation.parameters) {
    this.operation.parameters = [];
  }
  path_param.in = 'body';
  this.operation.parameters.push(path_param);
  return this;
};

Operation.prototype.addHeaderParameter = function(path_param) {
  if (!this.operation.parameters) {
    this.operation.parameters = [];
  }
  path_param.in = 'header';
  this.operation.parameters.push(path_param);
  return this;
};

Path.prototype.addOperation = function(operation) {
  this.path[operation] = { responses: { 200: { description: 'A OK' } } };
  return new Operation(this, this.path[operation]);
};

ApiBuilder.prototype.addPath = function(path) {
  if (!this.api.paths[path]) {
    this.api.paths[path] = {};
  }
  return new Path(this, this.api.paths[path]);
};
