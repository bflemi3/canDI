;(function (window) {

	window.candi = (function(){

		// $$injector closure - dependency injection
		var $$injector = (function() {

			// $$util - utility service
			var $$util = (function () {

				// function reflection utility
				var fn = (function() {
					var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
						FN_ARG_SPLIT = /,/,
						FN_ARG = /^\s*(_?)(\S+?)\1\s*$/,
						STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

					return {
						arguments: function(fn) {
							return this.text(fn).match(FN_ARGS)[1].split(FN_ARG_SPLIT);
						},
						text: function(fn) {
							return fn.toString().replace(STRIP_COMMENTS, '');
						},
						FN_ARGS: FN_ARGS,
						FN_ARG_SPLIT: FN_ARG_SPLIT,
						FN_ARG: FN_ARG,
						STRIP_COMMENTS: STRIP_COMMENTS
		    		};
				})();

				return {
					format: function (template) {
						var args = Array.prototype.slice.call(arguments, 1);
						return template.replace(/\{\d+\}/g, function (match) {
							var index = match.slice(1, -1);
							return typeof args[index] !== 'undefined' ? args[index] : match;
						});
					},
					checkable: function (element) {
						return (/radio|checkBox/i).test(element.type);
					},
					isFunction: function (obj) {
						return typeof obj === 'function';
					},
					isArray: function(obj) {
						return obj instanceof Array;
					},
					isString: function(obj) {
						return typeof obj === 'string';
					},
					isUndefined: function(obj) {
						return typeof obj === 'undefined';
					},
					exists: function (obj, emptyStrings) {
						return (!emptyStrings && typeof obj !== 'undefined') || (emptyStrings && typeof obj !== 'undefined' && (typeof obj === 'string' && obj.length));
					},
					forEach: function(array, fn) {
						if(!this.isArray(array)) throw $$err('$$util')("Invalid argument. 'array' must be an instance of Array.");
						if(!this.isFunction(fn)) throw $$err('$$util')("Invalid argument. 'fn' must be be a Function.");

						for(var i = 0; i < array.length; i++) {
							fn(array[i], i, array);
						}
					},
					fn: fn
				};
			})();

			// $$err - base error handling service
			var $$err = function (module) {
				return function (type, template) {
					var templateArgs = Array.prototype.slice.call(arguments, 2),
					    prefix = $$util.format('[{0} : {1}] ', module || '?', type || '?'),
					    message = prefix + $$util.format.apply({}, [template].concat(templateArgs));

					return new Error(message);
				};
			};

			//$$injector - dependency injector
			var $$injector = (function () {
				var deps = {},
				    $$injectorErr = $$err('$$injector'),
					_ = $$util;

				function apply(fn, $inject, scope, args, type) {
					try {
						return fn.apply(scope || {}, resolve($inject, args, fn.length));
					} catch (e) {
						throw $$injectorErr(type, 'Invocation error.\n{0}', e);
					}
				}

				function has(name) {
					return deps.hasOwnProperty(name) && typeof deps[name] !== 'undefined';
				}

				function resolve(names, args, fnLength) {
					var locals = [], nonDeps, errorCount, returnSingle = _.isString(names);
					if(!names || !names.length) return;
					if(!_.isArray(names)) names = [].concat(names);
					nonDeps = names.slice(0);

					for(var i = names.length - 1; i >= 0; i--) {
						if(has(names[i])) {
							nonDeps.splice(i, 1);
							locals.unshift(deps[names[i]]);
							continue;
						}
						if(args && (names.length - args.length) <= i) locals.unshift(args[i - (names.length - args.length)]);
					}

					// throw errors for all dependencies that we couldn't find a match for
					fnLength = fnLength || (args ? args.length : 0);
					if(nonDeps.length && (errorCount = nonDeps.length - fnLength) > 0) {
						_.forEach(nonDeps.slice(0, errorCount), function(name) {
							throw $$injectorErr('resolve', "'{0}' is not a registered dependency.", name);
						});
					}

					return returnSingle ? locals[0] : locals;
				}

				function precompile (fn) {
					if(typeof fn !== 'function') return false;
					var args = [];
					if(fn.length) {
						_.forEach(_.fn.arguments(fn), function(arg) {
							arg.replace(_.fn.FN_ARG, function(all, underscore, name) {
								args.push(name);
							});
						});
					}
					return args;
				}

				function assert(name, existance, type) {
					if (!existance && has(name))
						throw $$injectorErr(type || '?', "'{0}' is already a registered dependency.", name);
					if (existance && !has(name))
						throw $$injectorErr(type || '?', "'{0}' is an invalid dependency and has not been registered.", name);

					return true;
				}

				return {
					define: function (name, dependency) {
						// let's get all the argument names that we'll need to inject at invocation
						assert(name, false);

						// now return our new dependency
						return (deps[name] = dependency);
					},
					resolve: resolve,
					has: has,
					invoke: function(fn, scope, args, type) {
						if (typeof fn !== 'function') return false;

						return apply(fn, precompile(fn), scope, args, type);
					},
					instantiate: function(fn, args, type) {
						if(!_.isFunction(fn)) return false;
						var instance = Object.create(fn.prototype);
						this.invoke(fn, instance, args, type);
						return instance;
					},
					assert: assert
				};
			})();

			// define our dependencies so we can inject them in later services through the $$provider
			$$injector.define('$util', $$util);
			$$injector.define('$err', $$err);
			$$injector.define('$invoke', $$injector.invoke);

			return $$injector;
		})();

		// $$provider - handles object/function definition with dependency injection being it's main purpose
		var $$provider = (function ($$injector) {
			var $$providerErr = $$injector.resolve('$err')('$$provider'),
				_ = $$injector.resolve('$util');

			return {
				singleton: function (name, factory, scope) {
					return $$injector.define(name, $$injector.invoke(factory, scope, undefined, _.format('singleton|{0}', name)));
				},
				instance: function (name, factory) {
					return $$injector.define(name, function() {
						return $$injector.instantiate(factory, Array.prototype.slice.call(arguments), _.format('instance|{0}', name));
					});
				},
				variable: function(name, value) {
					return $$injector.define(name, value);
				}
			};
		})($$injector);

		return {
			injector: $$injector,
			provider: $$provider
		};

	})();

})(window);
