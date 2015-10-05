# canDI
Inversion of control and object creation javascript library

## candi.provider
`provider` is the main interface used to implicitly define and inject dependencies into an object. 

`provider` gives you the ability to create:

**Singletons** 
```
candi.provider.singleton('mySingleton', function(dependency1, dependency2) { ... });
```

**Instances** 
```
candi.provider.instance('myInstance', function(dependency1, otherArg1, otherArg2) {...});
```
**Variables** 
```
candi.provider.variable('myVariable', 'hello');
```
