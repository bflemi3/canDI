# canDI
Inversion of control and object creation javascript library

## candi.provider
`provider` is the main interface used to create objects, and implicitly define and inject dependencies into an object. It gives you the ability to create and automatically register...

###Singletons 
`candi.provider.singleton(String name, Function factory, Object scope)`
- name: The name of the newly created singleton.
- factory: The function that will be used to create the singleton.
- scope: The value of `this` within the factory. If `undefined` then scope will be a new object `{}`.

`singleton` will create and return the newly created singleton with resolved dependencies injected and ready to use. It will also automatically define your new singleton as a new dependency that can then be referenced and injected into other objects created with `provider`.

Example:
```
candi.provider.singleton('bread', function(dependency1, dependency2) { 
  return {
    add: function(thing) { return dependency1.add(thing); }
  };
});

var cheese = candi.provider.singleton('cheese', function(bread) { 
  bread.add('butter');
});
```

**Instances** 

Example:
```
candi.provider.singleton('infoService', function(ajax) { 
  return {
    getTopSpeed: function(maker, model, year) { // use ajax dependency to retrieve from restful service }
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
**Variables** 
```
candi.provider.variable('myVariable', 'hello');
```
