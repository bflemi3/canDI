# canDI
A simple dependency injection and object creation javascript library (with no dependencies!!)

## candi.provider
`provider` is the main interface used to create objects, and implicitly define and inject dependencies into an object. In addition to object creation, it automatically registers them as dependencies to be injected into other objects created with `provider`.

You can create...

###Singletons 
`candi.provider.singleton(String:name, Function:factory, Object:scope)`
- name: The name of the newly created singleton.
- factory: The function that will be used to create your singleton.
- scope: The value of `this` within the factory. If `undefined` then scope will be a new object `{}`.

`singleton` will create and return the newly created singleton with resolved dependencies injected and ready to use. It will also automatically define your new singleton as a new dependency that can then be referenced and injected into other objects created with `provider`.

Example:
```
candi.provider.singleton('_util', function() { 
  return {
    isString: function(obj) { return typeof obj === 'string'; }
  };
});

// singleton also returns your newly create singleton object, dependencies injected
// and ready to use.
var robot = candi.provider.singleton('robot', function(_util) { 
  return {
    greet: function(name) {
      if(!_util.isString(name)) throw new Error('Invalid argument. 'name' must be a string.);
      return 'hello ' + name + '!!';
    }
  };
});
```

###Instances 
`candi.provider.instance(String:name, Function:factory, Object:scope)`
- name: The name of the newly created singleton.
- factory: Your instance constructor.
- scope: The value of `this` within the factory. If `undefined` then scope will be a new object `{}`.

`instance` will create and return a function that defines your instance definition. It will inject not only dependencies but also other arguments passed at instance creation. It will also automatically register your new instance definition as a dependency that can be referenced and injected into other objects created with `provider`. 

Example:
```
candi.provider.singleton('infoService', function(ajax) { 
  return {
    getTopSpeed: function(maker, model, year) { return ajax.get('topspeed', maker, model, year); }
  };
});

var Car = candi.provider.instance('Car', function(infoService, maker, model, year) {
  this.maker = maker;
  this.model = model;
  this.year = year
  this.topSpeed = infoService.getTopSpeed(maker, model, year);
});

var myCar = new Car('honda', 'civic', 2004);
```
###Variables
`candi.provider.variable(String:name, Object:value)`

Example:
```
candi.provider.variable('myVariable', 'hello');
```
