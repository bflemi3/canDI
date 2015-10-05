# canDI
Inversion of control and object creation javascript library

## candi.provider
`provider` is the main interface used create objects, and implicitly define and inject dependencies into an object. It gives you the ability to create:

**Singletons** `candi.provider.singleton(String name, Function factory, Object scope)`

`singleton` will create and return the newly created singleton with resolved dependencies injected and ready to use.

Example:
```
candi.provider.singleton('bread', function(dependency1, dependency2) { ... });
// OR
var cheese = candi.provider.singleton('cheese', function(dependency1) { ... });
```

**Instances** 
```
candi.provider.instance('house', function(dependency1, otherArg1, otherArg2) { ... });
// OR
var Car = candi.provider.instance('Car', function(infoService, maker, model, year) {
  this.maker = maker;
  this.model = model;
  this.year = year
  this.topSpeed = infoService.getTopSpeed(maker, model, year);
});

var myCar = new Car('honda', 'civic');
```
**Variables** 
```
candi.provider.variable('myVariable', 'hello');
```
