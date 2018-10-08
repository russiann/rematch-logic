(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.rematchLogic = factory());
}(this, (function () { 'use strict';

  var _fails = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var _descriptors = !_fails(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });

  var _isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var _anObject = function (it) {
    if (!_isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  };

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math
    ? window : typeof self != 'undefined' && self.Math == Math ? self
    // eslint-disable-next-line no-new-func
    : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
  });

  var document = _global.document;
  // typeof document.createElement is 'object' in old IE
  var is = _isObject(document) && _isObject(document.createElement);
  var _domCreate = function (it) {
    return is ? document.createElement(it) : {};
  };

  var _ie8DomDefine = !_descriptors && !_fails(function () {
    return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
  });

  // 7.1.1 ToPrimitive(input [, PreferredType])

  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var _toPrimitive = function (it, S) {
    if (!_isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var dP = Object.defineProperty;

  var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    _anObject(O);
    P = _toPrimitive(P, true);
    _anObject(Attributes);
    if (_ie8DomDefine) try {
      return dP(O, P, Attributes);
    } catch (e) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var _objectDp = {
  	f: f
  };

  // 21.2.5.3 get RegExp.prototype.flags

  var _flags = function () {
    var that = _anObject(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  // 21.2.5.3 get RegExp.prototype.flags()
  if (_descriptors && /./g.flags != 'g') _objectDp.f(RegExp.prototype, 'flags', {
    configurable: true,
    get: _flags
  });

  var _propertyDesc = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var _hide = _descriptors ? function (object, key, value) {
    return _objectDp.f(object, key, _propertyDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var hasOwnProperty = {}.hasOwnProperty;
  var _has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var id = 0;
  var px = Math.random();
  var _uid = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };

  var _core = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.5.7' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  });
  var _core_1 = _core.version;

  var _redefine = createCommonjsModule(function (module) {
  var SRC = _uid('src');
  var TO_STRING = 'toString';
  var $toString = Function[TO_STRING];
  var TPL = ('' + $toString).split(TO_STRING);

  _core.inspectSource = function (it) {
    return $toString.call(it);
  };

  (module.exports = function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
    if (O[key] === val) return;
    if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    if (O === _global) {
      O[key] = val;
    } else if (!safe) {
      delete O[key];
      _hide(O, key, val);
    } else if (O[key]) {
      O[key] = val;
    } else {
      _hide(O, key, val);
    }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, TO_STRING, function toString() {
    return typeof this == 'function' && this[SRC] || $toString.call(this);
  });
  });

  var TO_STRING = 'toString';
  var $toString = /./[TO_STRING];

  var define = function (fn) {
    _redefine(RegExp.prototype, TO_STRING, fn, true);
  };

  // 21.2.5.14 RegExp.prototype.toString()
  if (_fails(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
    define(function toString() {
      var R = _anObject(this);
      return '/'.concat(R.source, '/',
        'flags' in R ? R.flags : !_descriptors && R instanceof RegExp ? _flags.call(R) : undefined);
    });
  // FF44- RegExp#toString has a wrong name
  } else if ($toString.name != TO_STRING) {
    define(function toString() {
      return $toString.call(this);
    });
  }

  var dP$1 = _objectDp.f;
  var FProto = Function.prototype;
  var nameRE = /^\s*function ([^ (]*)/;
  var NAME = 'name';

  // 19.2.4.2 name
  NAME in FProto || _descriptors && dP$1(FProto, NAME, {
    configurable: true,
    get: function () {
      try {
        return ('' + this).match(nameRE)[1];
      } catch (e) {
        return '';
      }
    }
  });

  var _library = false;

  var _shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = _global[SHARED] || (_global[SHARED] = {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: _core.version,
    mode: _library ? 'pure' : 'global',
    copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
  });
  });

  var _wks = createCommonjsModule(function (module) {
  var store = _shared('wks');

  var Symbol = _global.Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] =
      USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
  };

  $exports.store = store;
  });

  // 22.1.3.31 Array.prototype[@@unscopables]
  var UNSCOPABLES = _wks('unscopables');
  var ArrayProto = Array.prototype;
  if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});
  var _addToUnscopables = function (key) {
    ArrayProto[UNSCOPABLES][key] = true;
  };

  var _iterStep = function (done, value) {
    return { value: value, done: !!done };
  };

  var _iterators = {};

  var toString = {}.toString;

  var _cof = function (it) {
    return toString.call(it).slice(8, -1);
  };

  // fallback for non-array-like ES3 and non-enumerable old V8 strings

  // eslint-disable-next-line no-prototype-builtins
  var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return _cof(it) == 'String' ? it.split('') : Object(it);
  };

  // 7.2.1 RequireObjectCoercible(argument)
  var _defined = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };

  // to indexed object, toObject with fallback for non-array-like ES3 strings


  var _toIobject = function (it) {
    return _iobject(_defined(it));
  };

  var _aFunction = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };

  // optional / simple context binding

  var _ctx = function (fn, that, length) {
    _aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var PROTOTYPE = 'prototype';

  var $export = function (type, name, source) {
    var IS_FORCED = type & $export.F;
    var IS_GLOBAL = type & $export.G;
    var IS_STATIC = type & $export.S;
    var IS_PROTO = type & $export.P;
    var IS_BIND = type & $export.B;
    var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
    var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
    var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
    var key, own, out, exp;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined;
      // export native or passed
      out = (own ? target : source)[key];
      // bind timers to global for call from export context
      exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
      // extend global
      if (target) _redefine(target, key, out, type & $export.U);
      // export
      if (exports[key] != out) _hide(exports, key, exp);
      if (IS_PROTO && expProto[key] != out) expProto[key] = out;
    }
  };
  _global.core = _core;
  // type bitmap
  $export.F = 1;   // forced
  $export.G = 2;   // global
  $export.S = 4;   // static
  $export.P = 8;   // proto
  $export.B = 16;  // bind
  $export.W = 32;  // wrap
  $export.U = 64;  // safe
  $export.R = 128; // real proto method for `library`
  var _export = $export;

  // 7.1.4 ToInteger
  var ceil = Math.ceil;
  var floor = Math.floor;
  var _toInteger = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };

  // 7.1.15 ToLength

  var min = Math.min;
  var _toLength = function (it) {
    return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };

  var max = Math.max;
  var min$1 = Math.min;
  var _toAbsoluteIndex = function (index, length) {
    index = _toInteger(index);
    return index < 0 ? max(index + length, 0) : min$1(index, length);
  };

  // false -> Array#indexOf
  // true  -> Array#includes



  var _arrayIncludes = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = _toIobject($this);
      var length = _toLength(O.length);
      var index = _toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var shared = _shared('keys');

  var _sharedKey = function (key) {
    return shared[key] || (shared[key] = _uid(key));
  };

  var arrayIndexOf = _arrayIncludes(false);
  var IE_PROTO = _sharedKey('IE_PROTO');

  var _objectKeysInternal = function (object, names) {
    var O = _toIobject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (_has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE 8- don't enum bug keys
  var _enumBugKeys = (
    'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
  ).split(',');

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)



  var _objectKeys = Object.keys || function keys(O) {
    return _objectKeysInternal(O, _enumBugKeys);
  };

  var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    _anObject(O);
    var keys = _objectKeys(Properties);
    var length = keys.length;
    var i = 0;
    var P;
    while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
    return O;
  };

  var document$1 = _global.document;
  var _html = document$1 && document$1.documentElement;

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



  var IE_PROTO$1 = _sharedKey('IE_PROTO');
  var Empty = function () { /* empty */ };
  var PROTOTYPE$1 = 'prototype';

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = _domCreate('iframe');
    var i = _enumBugKeys.length;
    var lt = '<';
    var gt = '>';
    var iframeDocument;
    iframe.style.display = 'none';
    _html.appendChild(iframe);
    iframe.src = 'javascript:'; // eslint-disable-line no-script-url
    // createDict = iframe.contentWindow.Object;
    // html.removeChild(iframe);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
    return createDict();
  };

  var _objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE$1] = _anObject(O);
      result = new Empty();
      Empty[PROTOTYPE$1] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = createDict();
    return Properties === undefined ? result : _objectDps(result, Properties);
  };

  var def = _objectDp.f;

  var TAG = _wks('toStringTag');

  var _setToStringTag = function (it, tag, stat) {
    if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
  };

  var IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  _hide(IteratorPrototype, _wks('iterator'), function () { return this; });

  var _iterCreate = function (Constructor, NAME, next) {
    Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
    _setToStringTag(Constructor, NAME + ' Iterator');
  };

  // 7.1.13 ToObject(argument)

  var _toObject = function (it) {
    return Object(_defined(it));
  };

  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


  var IE_PROTO$2 = _sharedKey('IE_PROTO');
  var ObjectProto = Object.prototype;

  var _objectGpo = Object.getPrototypeOf || function (O) {
    O = _toObject(O);
    if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  };

  var ITERATOR = _wks('iterator');
  var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
  var FF_ITERATOR = '@@iterator';
  var KEYS = 'keys';
  var VALUES = 'values';

  var returnThis = function () { return this; };

  var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    _iterCreate(Constructor, NAME, next);
    var getMethod = function (kind) {
      if (!BUGGY && kind in proto) return proto[kind];
      switch (kind) {
        case KEYS: return function keys() { return new Constructor(this, kind); };
        case VALUES: return function values() { return new Constructor(this, kind); };
      } return function entries() { return new Constructor(this, kind); };
    };
    var TAG = NAME + ' Iterator';
    var DEF_VALUES = DEFAULT == VALUES;
    var VALUES_BUG = false;
    var proto = Base.prototype;
    var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
    var $default = $native || getMethod(DEFAULT);
    var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
    var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
    var methods, key, IteratorPrototype;
    // Fix native
    if ($anyNative) {
      IteratorPrototype = _objectGpo($anyNative.call(new Base()));
      if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        _setToStringTag(IteratorPrototype, TAG, true);
        // fix for some old engines
        if (!_library && typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
      }
    }
    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEF_VALUES && $native && $native.name !== VALUES) {
      VALUES_BUG = true;
      $default = function values() { return $native.call(this); };
    }
    // Define iterator
    if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      _hide(proto, ITERATOR, $default);
    }
    // Plug for library
    _iterators[NAME] = $default;
    _iterators[TAG] = returnThis;
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: $entries
      };
      if (FORCED) for (key in methods) {
        if (!(key in proto)) _redefine(proto, key, methods[key]);
      } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
    }
    return methods;
  };

  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
    this._t = _toIobject(iterated); // target
    this._i = 0;                   // next index
    this._k = kind;                // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var kind = this._k;
    var index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return _iterStep(1);
    }
    if (kind == 'keys') return _iterStep(0, index);
    if (kind == 'values') return _iterStep(0, O[index]);
    return _iterStep(0, [index, O[index]]);
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
  _iterators.Arguments = _iterators.Array;

  _addToUnscopables('keys');
  _addToUnscopables('values');
  _addToUnscopables('entries');

  // most Object methods by ES6 should accept primitives



  var _objectSap = function (KEY, exec) {
    var fn = (_core.Object || {})[KEY] || Object[KEY];
    var exp = {};
    exp[KEY] = exec(fn);
    _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
  };

  // 19.1.2.14 Object.keys(O)



  _objectSap('keys', function () {
    return function keys(it) {
      return _objectKeys(_toObject(it));
    };
  });

  var ITERATOR$1 = _wks('iterator');
  var TO_STRING_TAG = _wks('toStringTag');
  var ArrayValues = _iterators.Array;

  var DOMIterables = {
    CSSRuleList: true, // TODO: Not spec compliant, should be false.
    CSSStyleDeclaration: false,
    CSSValueList: false,
    ClientRectList: false,
    DOMRectList: false,
    DOMStringList: false,
    DOMTokenList: true,
    DataTransferItemList: false,
    FileList: false,
    HTMLAllCollection: false,
    HTMLCollection: false,
    HTMLFormElement: false,
    HTMLSelectElement: false,
    MediaList: true, // TODO: Not spec compliant, should be false.
    MimeTypeArray: false,
    NamedNodeMap: false,
    NodeList: true,
    PaintRequestList: false,
    Plugin: false,
    PluginArray: false,
    SVGLengthList: false,
    SVGNumberList: false,
    SVGPathSegList: false,
    SVGPointList: false,
    SVGStringList: false,
    SVGTransformList: false,
    SourceBufferList: false,
    StyleSheetList: true, // TODO: Not spec compliant, should be false.
    TextTrackCueList: false,
    TextTrackList: false,
    TouchList: false
  };

  for (var collections = _objectKeys(DOMIterables), i = 0; i < collections.length; i++) {
    var NAME$1 = collections[i];
    var explicit = DOMIterables[NAME$1];
    var Collection = _global[NAME$1];
    var proto = Collection && Collection.prototype;
    var key;
    if (proto) {
      if (!proto[ITERATOR$1]) _hide(proto, ITERATOR$1, ArrayValues);
      if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME$1);
      _iterators[NAME$1] = ArrayValues;
      if (explicit) for (key in es6_array_iterator) if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
    }
  }

  // they must be explicitly converted with toString()
  // eslint-disable-next-line import/prefer-default-export

  function stringifyType(type) {
    return Array.isArray(type) ? type.map(function (type) {
      return type.toString();
    }) : type.toString();
  } // we want to know that this was from intercept (validate/transform)

  var allowedOptions = ['name', 'type', 'cancelType', 'latest', 'debounce', 'throttle', 'validate', 'transform', 'process', 'processOptions', 'warnTimeout'];
  var allowedProcessOptions = ['dispatchReturn', 'dispatchMultiple', 'successType', 'failType'];
  var NODE_ENV = process.env.NODE_ENV;
  var defaultOptions = {
    warnTimeout: 60000,
    latest: false,
    debounce: 0,
    throttle: 0
  };
  /**
     Validate and augment logic object to be used in logicMiddleware.
     The returned object has the same structure as the supplied
     logicOptions argument but it will have been validated and defaults
     will be applied

     @param {object} logicOptions object defining logic operation
     @param {string} logicOptions.name optional string name, defaults
       to generated name from type and idx
     @param {string | regex | function | array} logicOptions.type action
       type(s) that this logic is used for. A string '*' indicates that
       it applies to all types, otherwise strings are used for exact match.
       A regex can also be used to match. If a function is supplied like
       a redux-actions action function, then it will use call its toString()
       method to get the associated action type. An array of any of these
       can be supplied to extend match to more types.
     @param {string | regex | function | array} logicOptions.cancelType
       action type(s) that will cause a cancellation. String, regex, fn,
       array are used similar to how the logicOptions.type works.
       Cancellation will automatically prevent dispatches from being used
       regardless of when the original logic finishes. Additionally a
       cancellation$ observable is available to logic to detect
       cancellation and perform any manual cleanup.
     @param {boolean} logicOptions.latest enables takeLatest which cancels
       previous when a newer one comes in, default false
     @param {number} logicOptions.debounce milliseconds to perform
       debouncing, cannot be used with latest, default 0 (disabled)
     @param {number} logicOptions.throttle milliseconds to perform
       throttling, cannot be used with latest, default 0 (disabled)
     @param {function} logicOptions.validate hook that will be executed
       before an action has been sent to other logic, middleware, and the
       reducers. Must call one of the provided callback functions allow or
       reject with an action to signal completion. Expected to be called
       exactly once. Pass undefined as an object to forward nothing.
       Calling reject prevents process hook from being run. Defaults to
       an identity fn which allows the original action.
     @param {function} logicOptions.transform hook that will be executed
       before an action has been sent to other logic, middleware, and the
       reducers. This is an alias for the validate hook. Call the
       provided callback function `next` (or `reject`) to
       signal completion. Expected to be called exactly once. Pass
       undefined as an object to forward nothing. Defaults to an identity
       transform which forwards the original action.
     @param {function} logicOptions.process hook that will be invoked
       after the original action (or that returned by validate/transform
       step) has been forwarded to other logic, middleware, and reducers.
       This hook will not be run if the validate/transform hook called
       reject. This hook is ideal for any additional processing or async
       fetching. The fn signature is `process(deps, ?dispatch, ?done)`
       where dispatch and done are optional and if included in the
       the signature will change the dispatch mode:
       1. Neither dispatch, nor done - dispatches the returned/resolved val
       2. Only dispatch - single dispatch mode, call dispatch exactly once (deprecated)
       3. Both dispatch and done - multi-dispatch mode, call done when finished
       Dispatch may be called with undefined when nothing needs to be
       dispatched. Multiple dispatches may be made if including the done or
       simply by dispatching an observable.
       More details on dispatching modes are in the advanced API docs
     @param {object} logicOptions.processOptions options influencing
       process hook, default {}
     @param {boolean} logicOptions.processOptions.dispatchReturn dispatch
       the return value or resolved/next promise/observable, default is
       false when dispatch is included in process fn signature
     @param {boolean} logicOptions.processOptions.dispatchMultiple
       multi-dispatch mode is enabled and continues until done is called
       or cancelled. The default is false unless the done cb is included
       in the process fn signature.
     @param {string|function} logicOptions.processOptions.successType
       action type or action creator fn, use value as payload
     @param {string|function} logicOptions.processOptions.failType
       action type or action creator fn, use value as payload
     @param {number} logicOptions.warnTimeout In non-production environment
       a console.error message will be logged if logic doesn't complete
       before this timeout in ms fires. Set to 0 to disable. Defaults to
       60000 (one minute)
     @returns {object} validated logic object which can be used in
       logicMiddleware contains the same properties as logicOptions but
       has defaults applied.
   */

  function createLogic() {
    var logicOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var invalidOptions = getInvalidOptions(logicOptions, allowedOptions);

    if (invalidOptions.length) {
      throw new Error("unknown or misspelled option(s): ".concat(invalidOptions));
    }

    var name = logicOptions.name,
        type = logicOptions.type,
        cancelType = logicOptions.cancelType,
        _logicOptions$warnTim = logicOptions.warnTimeout,
        warnTimeout = _logicOptions$warnTim === void 0 ? defaultOptions.warnTimeout : _logicOptions$warnTim,
        _logicOptions$latest = logicOptions.latest,
        latest = _logicOptions$latest === void 0 ? defaultOptions.latest : _logicOptions$latest,
        _logicOptions$debounc = logicOptions.debounce,
        debounce = _logicOptions$debounc === void 0 ? defaultOptions.debounce : _logicOptions$debounc,
        _logicOptions$throttl = logicOptions.throttle,
        throttle = _logicOptions$throttl === void 0 ? defaultOptions.throttle : _logicOptions$throttl,
        validate = logicOptions.validate,
        transform = logicOptions.transform,
        process = logicOptions.process,
        _logicOptions$process = logicOptions.processOptions,
        processOptions = _logicOptions$process === void 0 ? {} : _logicOptions$process;

    if (!type) {
      throw new Error('type is required, use \'*\' to match all actions');
    }

    if (type === 'undefined') {
      throw new Error('type is a string "undefined", check the logicOptions type field for a stringified undefined value');
    }

    if (validate && transform) {
      throw new Error('logic cannot define both the validate and transform hooks they are aliases');
    }

    if (typeof processOptions.warnTimeout !== 'undefined') {
      throw new Error('warnTimeout is a top level createLogic option, not a processOptions option');
    }

    var invalidProcessOptions = getInvalidOptions(processOptions, allowedProcessOptions);

    if (invalidProcessOptions.length) {
      throw new Error("unknown or misspelled processOption(s): ".concat(invalidProcessOptions));
    }

    if (NODE_ENV !== 'production' && typeof processOptions.dispatchMultiple !== 'undefined' && warnTimeout !== 0) {
      // eslint-disable-next-line no-console
      console.error("warning: in logic for type(s): ".concat(stringifyType(type), " - dispatchMultiple is always true in next version. For non-ending logic, set warnTimeout to 0"));
    }

    var processLength = process ? process.length : 0; // use process fn signature to determine some processOption defaults
    // for dispatchReturn and dispatchMultiple

    switch (processLength) {
      case 0: // process() - dispatchReturn

      case 1:
        // process(deps) - dispatchReturn
        setIfUndefined(processOptions, 'dispatchReturn', true);
        break;

      case 2:
        // process(deps, dispatch) - single dispatch (deprecated)
        if (NODE_ENV !== 'production' && !processOptions.dispatchMultiple && warnTimeout !== 0) {
          // eslint-disable-next-line no-console
          console.error("warning: in logic for type(s): ".concat(stringifyType(type), " - single-dispatch mode is deprecated, call done when finished dispatching. For non-ending logic, set warnTimeout: 0"));
        } // nothing to do, defaults are fine


        break;

      case 3: // process(deps, dispatch, done) - multi-dispatch

      default:
        // allow for additional params to come later
        setIfUndefined(processOptions, 'dispatchMultiple', true);
        break;
    }

    return {
      name: typeToStrFns(name),
      type: typeToStrFns(type),
      cancelType: typeToStrFns(cancelType),
      latest: latest,
      debounce: debounce,
      throttle: throttle,
      validate: validate,
      transform: transform,
      process: process,
      processOptions: processOptions,
      warnTimeout: warnTimeout
    };
  }

  function getInvalidOptions(options, validOptions) {
    return Object.keys(options).filter(function (k) {
      return validOptions.indexOf(k) === -1;
    });
  }
  /* if type is a fn call toString() to get type, redux-actions
    if array, then check members */


  function typeToStrFns(type) {
    if (Array.isArray(type)) {
      return type.map(function (x) {
        return typeToStrFns(x);
      });
    }

    return typeof type === 'function' ? type.toString() : type;
  }

  function setIfUndefined(obj, propName, propValue) {
    if (typeof obj[propName] === 'undefined') {
      // eslint-disable-next-line no-param-reassign
      obj[propName] = propValue;
    }
  }

  var f$1 = _wks;

  var _wksExt = {
  	f: f$1
  };

  var defineProperty = _objectDp.f;
  var _wksDefine = function (name) {
    var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
    if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
  };

  _wksDefine('asyncIterator');

  var _meta = createCommonjsModule(function (module) {
  var META = _uid('meta');


  var setDesc = _objectDp.f;
  var id = 0;
  var isExtensible = Object.isExtensible || function () {
    return true;
  };
  var FREEZE = !_fails(function () {
    return isExtensible(Object.preventExtensions({}));
  });
  var setMeta = function (it) {
    setDesc(it, META, { value: {
      i: 'O' + ++id, // object ID
      w: {}          // weak collections IDs
    } });
  };
  var fastKey = function (it, create) {
    // return primitive with prefix
    if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMeta(it);
    // return object ID
    } return it[META].i;
  };
  var getWeak = function (it, create) {
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMeta(it);
    // return hash weak collections IDs
    } return it[META].w;
  };
  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
    return it;
  };
  var meta = module.exports = {
    KEY: META,
    NEED: false,
    fastKey: fastKey,
    getWeak: getWeak,
    onFreeze: onFreeze
  };
  });
  var _meta_1 = _meta.KEY;
  var _meta_2 = _meta.NEED;
  var _meta_3 = _meta.fastKey;
  var _meta_4 = _meta.getWeak;
  var _meta_5 = _meta.onFreeze;

  var f$2 = Object.getOwnPropertySymbols;

  var _objectGops = {
  	f: f$2
  };

  var f$3 = {}.propertyIsEnumerable;

  var _objectPie = {
  	f: f$3
  };

  // all enumerable object keys, includes symbols



  var _enumKeys = function (it) {
    var result = _objectKeys(it);
    var getSymbols = _objectGops.f;
    if (getSymbols) {
      var symbols = getSymbols(it);
      var isEnum = _objectPie.f;
      var i = 0;
      var key;
      while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
    } return result;
  };

  // 7.2.2 IsArray(argument)

  var _isArray = Array.isArray || function isArray(arg) {
    return _cof(arg) == 'Array';
  };

  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

  var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

  var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return _objectKeysInternal(O, hiddenKeys);
  };

  var _objectGopn = {
  	f: f$4
  };

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

  var gOPN = _objectGopn.f;
  var toString$1 = {}.toString;

  var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
    ? Object.getOwnPropertyNames(window) : [];

  var getWindowNames = function (it) {
    try {
      return gOPN(it);
    } catch (e) {
      return windowNames.slice();
    }
  };

  var f$5 = function getOwnPropertyNames(it) {
    return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
  };

  var _objectGopnExt = {
  	f: f$5
  };

  var gOPD = Object.getOwnPropertyDescriptor;

  var f$6 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
    O = _toIobject(O);
    P = _toPrimitive(P, true);
    if (_ie8DomDefine) try {
      return gOPD(O, P);
    } catch (e) { /* empty */ }
    if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
  };

  var _objectGopd = {
  	f: f$6
  };

  // ECMAScript 6 symbols shim





  var META = _meta.KEY;



















  var gOPD$1 = _objectGopd.f;
  var dP$2 = _objectDp.f;
  var gOPN$1 = _objectGopnExt.f;
  var $Symbol = _global.Symbol;
  var $JSON = _global.JSON;
  var _stringify = $JSON && $JSON.stringify;
  var PROTOTYPE$2 = 'prototype';
  var HIDDEN = _wks('_hidden');
  var TO_PRIMITIVE = _wks('toPrimitive');
  var isEnum = {}.propertyIsEnumerable;
  var SymbolRegistry = _shared('symbol-registry');
  var AllSymbols = _shared('symbols');
  var OPSymbols = _shared('op-symbols');
  var ObjectProto$1 = Object[PROTOTYPE$2];
  var USE_NATIVE = typeof $Symbol == 'function';
  var QObject = _global.QObject;
  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDesc = _descriptors && _fails(function () {
    return _objectCreate(dP$2({}, 'a', {
      get: function () { return dP$2(this, 'a', { value: 7 }).a; }
    })).a != 7;
  }) ? function (it, key, D) {
    var protoDesc = gOPD$1(ObjectProto$1, key);
    if (protoDesc) delete ObjectProto$1[key];
    dP$2(it, key, D);
    if (protoDesc && it !== ObjectProto$1) dP$2(ObjectProto$1, key, protoDesc);
  } : dP$2;

  var wrap = function (tag) {
    var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
    sym._k = tag;
    return sym;
  };

  var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    return it instanceof $Symbol;
  };

  var $defineProperty = function defineProperty(it, key, D) {
    if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
    _anObject(it);
    key = _toPrimitive(key, true);
    _anObject(D);
    if (_has(AllSymbols, key)) {
      if (!D.enumerable) {
        if (!_has(it, HIDDEN)) dP$2(it, HIDDEN, _propertyDesc(1, {}));
        it[HIDDEN][key] = true;
      } else {
        if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
        D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
      } return setSymbolDesc(it, key, D);
    } return dP$2(it, key, D);
  };
  var $defineProperties = function defineProperties(it, P) {
    _anObject(it);
    var keys = _enumKeys(P = _toIobject(P));
    var i = 0;
    var l = keys.length;
    var key;
    while (l > i) $defineProperty(it, key = keys[i++], P[key]);
    return it;
  };
  var $create = function create(it, P) {
    return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
  };
  var $propertyIsEnumerable = function propertyIsEnumerable(key) {
    var E = isEnum.call(this, key = _toPrimitive(key, true));
    if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
    return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
  };
  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
    it = _toIobject(it);
    key = _toPrimitive(key, true);
    if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
    var D = gOPD$1(it, key);
    if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
    return D;
  };
  var $getOwnPropertyNames = function getOwnPropertyNames(it) {
    var names = gOPN$1(_toIobject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
    } return result;
  };
  var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
    var IS_OP = it === ObjectProto$1;
    var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
    } return result;
  };

  // 19.4.1.1 Symbol([description])
  if (!USE_NATIVE) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
      var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
      var $set = function (value) {
        if (this === ObjectProto$1) $set.call(OPSymbols, value);
        if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDesc(this, tag, _propertyDesc(1, value));
      };
      if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
      return wrap(tag);
    };
    _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
      return this._k;
    });

    _objectGopd.f = $getOwnPropertyDescriptor;
    _objectDp.f = $defineProperty;
    _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
    _objectPie.f = $propertyIsEnumerable;
    _objectGops.f = $getOwnPropertySymbols;

    if (_descriptors && !_library) {
      _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
    }

    _wksExt.f = function (name) {
      return wrap(_wks(name));
    };
  }

  _export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

  for (var es6Symbols = (
    // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
    'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
  ).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

  for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

  _export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
    // 19.4.2.1 Symbol.for(key)
    'for': function (key) {
      return _has(SymbolRegistry, key += '')
        ? SymbolRegistry[key]
        : SymbolRegistry[key] = $Symbol(key);
    },
    // 19.4.2.5 Symbol.keyFor(sym)
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
      for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
    },
    useSetter: function () { setter = true; },
    useSimple: function () { setter = false; }
  });

  _export(_export.S + _export.F * !USE_NATIVE, 'Object', {
    // 19.1.2.2 Object.create(O [, Properties])
    create: $create,
    // 19.1.2.4 Object.defineProperty(O, P, Attributes)
    defineProperty: $defineProperty,
    // 19.1.2.3 Object.defineProperties(O, Properties)
    defineProperties: $defineProperties,
    // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    // 19.1.2.7 Object.getOwnPropertyNames(O)
    getOwnPropertyNames: $getOwnPropertyNames,
    // 19.1.2.8 Object.getOwnPropertySymbols(O)
    getOwnPropertySymbols: $getOwnPropertySymbols
  });

  // 24.3.2 JSON.stringify(value [, replacer [, space]])
  $JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
    var S = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    // WebKit converts symbol values to JSON as null
    // V8 throws on boxed symbols
    return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
  })), 'JSON', {
    stringify: function stringify(it) {
      var args = [it];
      var i = 1;
      var replacer, $replacer;
      while (arguments.length > i) args.push(arguments[i++]);
      $replacer = replacer = args[1];
      if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!_isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return _stringify.apply($JSON, args);
    }
  });

  // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
  $Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
  // 19.4.3.5 Symbol.prototype[@@toStringTag]
  _setToStringTag($Symbol, 'Symbol');
  // 20.2.1.9 Math[@@toStringTag]
  _setToStringTag(Math, 'Math', true);
  // 24.3.3 JSON[@@toStringTag]
  _setToStringTag(_global.JSON, 'JSON', true);

  var quot = /"/g;
  // B.2.3.2.1 CreateHTML(string, tag, attribute, value)
  var createHTML = function (string, tag, attribute, value) {
    var S = String(_defined(string));
    var p1 = '<' + tag;
    if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
    return p1 + '>' + S + '</' + tag + '>';
  };
  var _stringHtml = function (NAME, exec) {
    var O = {};
    O[NAME] = exec(createHTML);
    _export(_export.P + _export.F * _fails(function () {
      var test = ''[NAME]('"');
      return test !== test.toLowerCase() || test.split('"').length > 3;
    }), 'String', O);
  };

  // B.2.3.13 String.prototype.sub()
  _stringHtml('sub', function (createHTML) {
    return function sub() {
      return createHTML(this, 'sub', '', '');
    };
  });

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isFunction(x) {
      return typeof x === 'function';
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var _enable_super_gross_mode_that_will_cause_bad_things = false;
  var config = {
      Promise: undefined,
      set useDeprecatedSynchronousErrorHandling(value) {
          if (value) {
              var error = /*@__PURE__*/ new Error();
              /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
          }
          else if (_enable_super_gross_mode_that_will_cause_bad_things) {
              /*@__PURE__*/ console.log('RxJS: Back to a better error behavior. Thank you. <3');
          }
          _enable_super_gross_mode_that_will_cause_bad_things = value;
      },
      get useDeprecatedSynchronousErrorHandling() {
          return _enable_super_gross_mode_that_will_cause_bad_things;
      },
  };

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function hostReportError(err) {
      setTimeout(function () { throw err; });
  }

  /** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
  var empty = {
      closed: true,
      next: function (value) { },
      error: function (err) {
          if (config.useDeprecatedSynchronousErrorHandling) {
              throw err;
          }
          else {
              hostReportError(err);
          }
      },
      complete: function () { }
  };

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isObject(x) {
      return x != null && typeof x === 'object';
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var errorObject = { e: {} };

  /** PURE_IMPORTS_START _errorObject PURE_IMPORTS_END */
  var tryCatchTarget;
  function tryCatcher() {
      try {
          return tryCatchTarget.apply(this, arguments);
      }
      catch (e) {
          errorObject.e = e;
          return errorObject;
      }
  }
  function tryCatch(fn) {
      tryCatchTarget = fn;
      return tryCatcher;
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function UnsubscriptionErrorImpl(errors) {
      Error.call(this);
      this.message = errors ?
          errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
      this.name = 'UnsubscriptionError';
      this.errors = errors;
      return this;
  }
  UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
  var UnsubscriptionError = UnsubscriptionErrorImpl;

  /** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_tryCatch,_util_errorObject,_util_UnsubscriptionError PURE_IMPORTS_END */
  var Subscription = /*@__PURE__*/ (function () {
      function Subscription(unsubscribe) {
          this.closed = false;
          this._parent = null;
          this._parents = null;
          this._subscriptions = null;
          if (unsubscribe) {
              this._unsubscribe = unsubscribe;
          }
      }
      Subscription.prototype.unsubscribe = function () {
          var hasErrors = false;
          var errors;
          if (this.closed) {
              return;
          }
          var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
          this.closed = true;
          this._parent = null;
          this._parents = null;
          this._subscriptions = null;
          var index = -1;
          var len = _parents ? _parents.length : 0;
          while (_parent) {
              _parent.remove(this);
              _parent = ++index < len && _parents[index] || null;
          }
          if (isFunction(_unsubscribe)) {
              var trial = tryCatch(_unsubscribe).call(this);
              if (trial === errorObject) {
                  hasErrors = true;
                  errors = errors || (errorObject.e instanceof UnsubscriptionError ?
                      flattenUnsubscriptionErrors(errorObject.e.errors) : [errorObject.e]);
              }
          }
          if (isArray(_subscriptions)) {
              index = -1;
              len = _subscriptions.length;
              while (++index < len) {
                  var sub = _subscriptions[index];
                  if (isObject(sub)) {
                      var trial = tryCatch(sub.unsubscribe).call(sub);
                      if (trial === errorObject) {
                          hasErrors = true;
                          errors = errors || [];
                          var err = errorObject.e;
                          if (err instanceof UnsubscriptionError) {
                              errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                          }
                          else {
                              errors.push(err);
                          }
                      }
                  }
              }
          }
          if (hasErrors) {
              throw new UnsubscriptionError(errors);
          }
      };
      Subscription.prototype.add = function (teardown) {
          if (!teardown || (teardown === Subscription.EMPTY)) {
              return Subscription.EMPTY;
          }
          if (teardown === this) {
              return this;
          }
          var subscription = teardown;
          switch (typeof teardown) {
              case 'function':
                  subscription = new Subscription(teardown);
              case 'object':
                  if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                      return subscription;
                  }
                  else if (this.closed) {
                      subscription.unsubscribe();
                      return subscription;
                  }
                  else if (typeof subscription._addParent !== 'function') {
                      var tmp = subscription;
                      subscription = new Subscription();
                      subscription._subscriptions = [tmp];
                  }
                  break;
              default:
                  throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
          }
          var subscriptions = this._subscriptions || (this._subscriptions = []);
          subscriptions.push(subscription);
          subscription._addParent(this);
          return subscription;
      };
      Subscription.prototype.remove = function (subscription) {
          var subscriptions = this._subscriptions;
          if (subscriptions) {
              var subscriptionIndex = subscriptions.indexOf(subscription);
              if (subscriptionIndex !== -1) {
                  subscriptions.splice(subscriptionIndex, 1);
              }
          }
      };
      Subscription.prototype._addParent = function (parent) {
          var _a = this, _parent = _a._parent, _parents = _a._parents;
          if (!_parent || _parent === parent) {
              this._parent = parent;
          }
          else if (!_parents) {
              this._parents = [parent];
          }
          else if (_parents.indexOf(parent) === -1) {
              _parents.push(parent);
          }
      };
      Subscription.EMPTY = (function (empty) {
          empty.closed = true;
          return empty;
      }(new Subscription()));
      return Subscription;
  }());
  function flattenUnsubscriptionErrors(errors) {
      return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var rxSubscriber = typeof Symbol === 'function'
      ? /*@__PURE__*/ Symbol('rxSubscriber')
      : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();

  /** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
  var Subscriber = /*@__PURE__*/ (function (_super) {
      __extends(Subscriber, _super);
      function Subscriber(destinationOrNext, error, complete) {
          var _this = _super.call(this) || this;
          _this.syncErrorValue = null;
          _this.syncErrorThrown = false;
          _this.syncErrorThrowable = false;
          _this.isStopped = false;
          _this._parentSubscription = null;
          switch (arguments.length) {
              case 0:
                  _this.destination = empty;
                  break;
              case 1:
                  if (!destinationOrNext) {
                      _this.destination = empty;
                      break;
                  }
                  if (typeof destinationOrNext === 'object') {
                      if (destinationOrNext instanceof Subscriber) {
                          _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                          _this.destination = destinationOrNext;
                          destinationOrNext.add(_this);
                      }
                      else {
                          _this.syncErrorThrowable = true;
                          _this.destination = new SafeSubscriber(_this, destinationOrNext);
                      }
                      break;
                  }
              default:
                  _this.syncErrorThrowable = true;
                  _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                  break;
          }
          return _this;
      }
      Subscriber.prototype[rxSubscriber] = function () { return this; };
      Subscriber.create = function (next, error, complete) {
          var subscriber = new Subscriber(next, error, complete);
          subscriber.syncErrorThrowable = false;
          return subscriber;
      };
      Subscriber.prototype.next = function (value) {
          if (!this.isStopped) {
              this._next(value);
          }
      };
      Subscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              this.isStopped = true;
              this._error(err);
          }
      };
      Subscriber.prototype.complete = function () {
          if (!this.isStopped) {
              this.isStopped = true;
              this._complete();
          }
      };
      Subscriber.prototype.unsubscribe = function () {
          if (this.closed) {
              return;
          }
          this.isStopped = true;
          _super.prototype.unsubscribe.call(this);
      };
      Subscriber.prototype._next = function (value) {
          this.destination.next(value);
      };
      Subscriber.prototype._error = function (err) {
          this.destination.error(err);
          this.unsubscribe();
      };
      Subscriber.prototype._complete = function () {
          this.destination.complete();
          this.unsubscribe();
      };
      Subscriber.prototype._unsubscribeAndRecycle = function () {
          var _a = this, _parent = _a._parent, _parents = _a._parents;
          this._parent = null;
          this._parents = null;
          this.unsubscribe();
          this.closed = false;
          this.isStopped = false;
          this._parent = _parent;
          this._parents = _parents;
          this._parentSubscription = null;
          return this;
      };
      return Subscriber;
  }(Subscription));
  var SafeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SafeSubscriber, _super);
      function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
          var _this = _super.call(this) || this;
          _this._parentSubscriber = _parentSubscriber;
          var next;
          var context = _this;
          if (isFunction(observerOrNext)) {
              next = observerOrNext;
          }
          else if (observerOrNext) {
              next = observerOrNext.next;
              error = observerOrNext.error;
              complete = observerOrNext.complete;
              if (observerOrNext !== empty) {
                  context = Object.create(observerOrNext);
                  if (isFunction(context.unsubscribe)) {
                      _this.add(context.unsubscribe.bind(context));
                  }
                  context.unsubscribe = _this.unsubscribe.bind(_this);
              }
          }
          _this._context = context;
          _this._next = next;
          _this._error = error;
          _this._complete = complete;
          return _this;
      }
      SafeSubscriber.prototype.next = function (value) {
          if (!this.isStopped && this._next) {
              var _parentSubscriber = this._parentSubscriber;
              if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                  this.__tryOrUnsub(this._next, value);
              }
              else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              var _parentSubscriber = this._parentSubscriber;
              var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
              if (this._error) {
                  if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                      this.__tryOrUnsub(this._error, err);
                      this.unsubscribe();
                  }
                  else {
                      this.__tryOrSetError(_parentSubscriber, this._error, err);
                      this.unsubscribe();
                  }
              }
              else if (!_parentSubscriber.syncErrorThrowable) {
                  this.unsubscribe();
                  if (useDeprecatedSynchronousErrorHandling) {
                      throw err;
                  }
                  hostReportError(err);
              }
              else {
                  if (useDeprecatedSynchronousErrorHandling) {
                      _parentSubscriber.syncErrorValue = err;
                      _parentSubscriber.syncErrorThrown = true;
                  }
                  else {
                      hostReportError(err);
                  }
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.complete = function () {
          var _this = this;
          if (!this.isStopped) {
              var _parentSubscriber = this._parentSubscriber;
              if (this._complete) {
                  var wrappedComplete = function () { return _this._complete.call(_this._context); };
                  if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                      this.__tryOrUnsub(wrappedComplete);
                      this.unsubscribe();
                  }
                  else {
                      this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                      this.unsubscribe();
                  }
              }
              else {
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
          try {
              fn.call(this._context, value);
          }
          catch (err) {
              this.unsubscribe();
              if (config.useDeprecatedSynchronousErrorHandling) {
                  throw err;
              }
              else {
                  hostReportError(err);
              }
          }
      };
      SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
          if (!config.useDeprecatedSynchronousErrorHandling) {
              throw new Error('bad call');
          }
          try {
              fn.call(this._context, value);
          }
          catch (err) {
              if (config.useDeprecatedSynchronousErrorHandling) {
                  parent.syncErrorValue = err;
                  parent.syncErrorThrown = true;
                  return true;
              }
              else {
                  hostReportError(err);
                  return true;
              }
          }
          return false;
      };
      SafeSubscriber.prototype._unsubscribe = function () {
          var _parentSubscriber = this._parentSubscriber;
          this._context = null;
          this._parentSubscriber = null;
          _parentSubscriber.unsubscribe();
      };
      return SafeSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
  function canReportError(observer) {
      while (observer) {
          var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
          if (closed_1 || isStopped) {
              return false;
          }
          else if (destination && destination instanceof Subscriber) {
              observer = destination;
          }
          else {
              observer = null;
          }
      }
      return true;
  }

  /** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
  function toSubscriber(nextOrObserver, error, complete) {
      if (nextOrObserver) {
          if (nextOrObserver instanceof Subscriber) {
              return nextOrObserver;
          }
          if (nextOrObserver[rxSubscriber]) {
              return nextOrObserver[rxSubscriber]();
          }
      }
      if (!nextOrObserver && !error && !complete) {
          return new Subscriber(empty);
      }
      return new Subscriber(nextOrObserver, error, complete);
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var observable = typeof Symbol === 'function' && Symbol.observable || '@@observable';

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function noop() { }

  /** PURE_IMPORTS_START _noop PURE_IMPORTS_END */
  function pipeFromArray(fns) {
      if (!fns) {
          return noop;
      }
      if (fns.length === 1) {
          return fns[0];
      }
      return function piped(input) {
          return fns.reduce(function (prev, fn) { return fn(prev); }, input);
      };
  }

  /** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_internal_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
  var Observable = /*@__PURE__*/ (function () {
      function Observable(subscribe) {
          this._isScalar = false;
          if (subscribe) {
              this._subscribe = subscribe;
          }
      }
      Observable.prototype.lift = function (operator) {
          var observable$$1 = new Observable();
          observable$$1.source = this;
          observable$$1.operator = operator;
          return observable$$1;
      };
      Observable.prototype.subscribe = function (observerOrNext, error, complete) {
          var operator = this.operator;
          var sink = toSubscriber(observerOrNext, error, complete);
          if (operator) {
              operator.call(sink, this.source);
          }
          else {
              sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                  this._subscribe(sink) :
                  this._trySubscribe(sink));
          }
          if (config.useDeprecatedSynchronousErrorHandling) {
              if (sink.syncErrorThrowable) {
                  sink.syncErrorThrowable = false;
                  if (sink.syncErrorThrown) {
                      throw sink.syncErrorValue;
                  }
              }
          }
          return sink;
      };
      Observable.prototype._trySubscribe = function (sink) {
          try {
              return this._subscribe(sink);
          }
          catch (err) {
              if (config.useDeprecatedSynchronousErrorHandling) {
                  sink.syncErrorThrown = true;
                  sink.syncErrorValue = err;
              }
              if (canReportError(sink)) {
                  sink.error(err);
              }
              else {
                  console.warn(err);
              }
          }
      };
      Observable.prototype.forEach = function (next, promiseCtor) {
          var _this = this;
          promiseCtor = getPromiseCtor(promiseCtor);
          return new promiseCtor(function (resolve, reject) {
              var subscription;
              subscription = _this.subscribe(function (value) {
                  try {
                      next(value);
                  }
                  catch (err) {
                      reject(err);
                      if (subscription) {
                          subscription.unsubscribe();
                      }
                  }
              }, reject, resolve);
          });
      };
      Observable.prototype._subscribe = function (subscriber) {
          var source = this.source;
          return source && source.subscribe(subscriber);
      };
      Observable.prototype[observable] = function () {
          return this;
      };
      Observable.prototype.pipe = function () {
          var operations = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              operations[_i] = arguments[_i];
          }
          if (operations.length === 0) {
              return this;
          }
          return pipeFromArray(operations)(this);
      };
      Observable.prototype.toPromise = function (promiseCtor) {
          var _this = this;
          promiseCtor = getPromiseCtor(promiseCtor);
          return new promiseCtor(function (resolve, reject) {
              var value;
              _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
          });
      };
      Observable.create = function (subscribe) {
          return new Observable(subscribe);
      };
      return Observable;
  }());
  function getPromiseCtor(promiseCtor) {
      if (!promiseCtor) {
          promiseCtor = config.Promise || Promise;
      }
      if (!promiseCtor) {
          throw new Error('no Promise impl found');
      }
      return promiseCtor;
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function ObjectUnsubscribedErrorImpl() {
      Error.call(this);
      this.message = 'object unsubscribed';
      this.name = 'ObjectUnsubscribedError';
      return this;
  }
  ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
  var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

  /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
  var SubjectSubscription = /*@__PURE__*/ (function (_super) {
      __extends(SubjectSubscription, _super);
      function SubjectSubscription(subject, subscriber) {
          var _this = _super.call(this) || this;
          _this.subject = subject;
          _this.subscriber = subscriber;
          _this.closed = false;
          return _this;
      }
      SubjectSubscription.prototype.unsubscribe = function () {
          if (this.closed) {
              return;
          }
          this.closed = true;
          var subject = this.subject;
          var observers = subject.observers;
          this.subject = null;
          if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
              return;
          }
          var subscriberIndex = observers.indexOf(this.subscriber);
          if (subscriberIndex !== -1) {
              observers.splice(subscriberIndex, 1);
          }
      };
      return SubjectSubscription;
  }(Subscription));

  /** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
  var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SubjectSubscriber, _super);
      function SubjectSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.destination = destination;
          return _this;
      }
      return SubjectSubscriber;
  }(Subscriber));
  var Subject = /*@__PURE__*/ (function (_super) {
      __extends(Subject, _super);
      function Subject() {
          var _this = _super.call(this) || this;
          _this.observers = [];
          _this.closed = false;
          _this.isStopped = false;
          _this.hasError = false;
          _this.thrownError = null;
          return _this;
      }
      Subject.prototype[rxSubscriber] = function () {
          return new SubjectSubscriber(this);
      };
      Subject.prototype.lift = function (operator) {
          var subject = new AnonymousSubject(this, this);
          subject.operator = operator;
          return subject;
      };
      Subject.prototype.next = function (value) {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          if (!this.isStopped) {
              var observers = this.observers;
              var len = observers.length;
              var copy = observers.slice();
              for (var i = 0; i < len; i++) {
                  copy[i].next(value);
              }
          }
      };
      Subject.prototype.error = function (err) {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          this.hasError = true;
          this.thrownError = err;
          this.isStopped = true;
          var observers = this.observers;
          var len = observers.length;
          var copy = observers.slice();
          for (var i = 0; i < len; i++) {
              copy[i].error(err);
          }
          this.observers.length = 0;
      };
      Subject.prototype.complete = function () {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          this.isStopped = true;
          var observers = this.observers;
          var len = observers.length;
          var copy = observers.slice();
          for (var i = 0; i < len; i++) {
              copy[i].complete();
          }
          this.observers.length = 0;
      };
      Subject.prototype.unsubscribe = function () {
          this.isStopped = true;
          this.closed = true;
          this.observers = null;
      };
      Subject.prototype._trySubscribe = function (subscriber) {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          else {
              return _super.prototype._trySubscribe.call(this, subscriber);
          }
      };
      Subject.prototype._subscribe = function (subscriber) {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          else if (this.hasError) {
              subscriber.error(this.thrownError);
              return Subscription.EMPTY;
          }
          else if (this.isStopped) {
              subscriber.complete();
              return Subscription.EMPTY;
          }
          else {
              this.observers.push(subscriber);
              return new SubjectSubscription(this, subscriber);
          }
      };
      Subject.prototype.asObservable = function () {
          var observable = new Observable();
          observable.source = this;
          return observable;
      };
      Subject.create = function (destination, source) {
          return new AnonymousSubject(destination, source);
      };
      return Subject;
  }(Observable));
  var AnonymousSubject = /*@__PURE__*/ (function (_super) {
      __extends(AnonymousSubject, _super);
      function AnonymousSubject(destination, source) {
          var _this = _super.call(this) || this;
          _this.destination = destination;
          _this.source = source;
          return _this;
      }
      AnonymousSubject.prototype.next = function (value) {
          var destination = this.destination;
          if (destination && destination.next) {
              destination.next(value);
          }
      };
      AnonymousSubject.prototype.error = function (err) {
          var destination = this.destination;
          if (destination && destination.error) {
              this.destination.error(err);
          }
      };
      AnonymousSubject.prototype.complete = function () {
          var destination = this.destination;
          if (destination && destination.complete) {
              this.destination.complete();
          }
      };
      AnonymousSubject.prototype._subscribe = function (subscriber) {
          var source = this.source;
          if (source) {
              return this.source.subscribe(subscriber);
          }
          else {
              return Subscription.EMPTY;
          }
      };
      return AnonymousSubject;
  }(Subject));

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  function refCount() {
      return function refCountOperatorFunction(source) {
          return source.lift(new RefCountOperator(source));
      };
  }
  var RefCountOperator = /*@__PURE__*/ (function () {
      function RefCountOperator(connectable) {
          this.connectable = connectable;
      }
      RefCountOperator.prototype.call = function (subscriber, source) {
          var connectable = this.connectable;
          connectable._refCount++;
          var refCounter = new RefCountSubscriber(subscriber, connectable);
          var subscription = source.subscribe(refCounter);
          if (!refCounter.closed) {
              refCounter.connection = connectable.connect();
          }
          return subscription;
      };
      return RefCountOperator;
  }());
  var RefCountSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(RefCountSubscriber, _super);
      function RefCountSubscriber(destination, connectable) {
          var _this = _super.call(this, destination) || this;
          _this.connectable = connectable;
          return _this;
      }
      RefCountSubscriber.prototype._unsubscribe = function () {
          var connectable = this.connectable;
          if (!connectable) {
              this.connection = null;
              return;
          }
          this.connectable = null;
          var refCount = connectable._refCount;
          if (refCount <= 0) {
              this.connection = null;
              return;
          }
          connectable._refCount = refCount - 1;
          if (refCount > 1) {
              this.connection = null;
              return;
          }
          var connection = this.connection;
          var sharedConnection = connectable._connection;
          this.connection = null;
          if (sharedConnection && (!connection || sharedConnection === connection)) {
              sharedConnection.unsubscribe();
          }
      };
      return RefCountSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subject,_Observable,_Subscriber,_Subscription,_operators_refCount PURE_IMPORTS_END */
  var ConnectableObservable = /*@__PURE__*/ (function (_super) {
      __extends(ConnectableObservable, _super);
      function ConnectableObservable(source, subjectFactory) {
          var _this = _super.call(this) || this;
          _this.source = source;
          _this.subjectFactory = subjectFactory;
          _this._refCount = 0;
          _this._isComplete = false;
          return _this;
      }
      ConnectableObservable.prototype._subscribe = function (subscriber) {
          return this.getSubject().subscribe(subscriber);
      };
      ConnectableObservable.prototype.getSubject = function () {
          var subject = this._subject;
          if (!subject || subject.isStopped) {
              this._subject = this.subjectFactory();
          }
          return this._subject;
      };
      ConnectableObservable.prototype.connect = function () {
          var connection = this._connection;
          if (!connection) {
              this._isComplete = false;
              connection = this._connection = new Subscription();
              connection.add(this.source
                  .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
              if (connection.closed) {
                  this._connection = null;
                  connection = Subscription.EMPTY;
              }
              else {
                  this._connection = connection;
              }
          }
          return connection;
      };
      ConnectableObservable.prototype.refCount = function () {
          return refCount()(this);
      };
      return ConnectableObservable;
  }(Observable));
  var connectableProto = ConnectableObservable.prototype;
  var connectableObservableDescriptor = {
      operator: { value: null },
      _refCount: { value: 0, writable: true },
      _subject: { value: null, writable: true },
      _connection: { value: null, writable: true },
      _subscribe: { value: connectableProto._subscribe },
      _isComplete: { value: connectableProto._isComplete, writable: true },
      getSubject: { value: connectableProto.getSubject },
      connect: { value: connectableProto.connect },
      refCount: { value: connectableProto.refCount }
  };
  var ConnectableSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ConnectableSubscriber, _super);
      function ConnectableSubscriber(destination, connectable) {
          var _this = _super.call(this, destination) || this;
          _this.connectable = connectable;
          return _this;
      }
      ConnectableSubscriber.prototype._error = function (err) {
          this._unsubscribe();
          _super.prototype._error.call(this, err);
      };
      ConnectableSubscriber.prototype._complete = function () {
          this.connectable._isComplete = true;
          this._unsubscribe();
          _super.prototype._complete.call(this);
      };
      ConnectableSubscriber.prototype._unsubscribe = function () {
          var connectable = this.connectable;
          if (connectable) {
              this.connectable = null;
              var connection = connectable._connection;
              connectable._refCount = 0;
              connectable._subject = null;
              connectable._connection = null;
              if (connection) {
                  connection.unsubscribe();
              }
          }
      };
      return ConnectableSubscriber;
  }(SubjectSubscriber));
  var RefCountSubscriber$1 = /*@__PURE__*/ (function (_super) {
      __extends(RefCountSubscriber, _super);
      function RefCountSubscriber(destination, connectable) {
          var _this = _super.call(this, destination) || this;
          _this.connectable = connectable;
          return _this;
      }
      RefCountSubscriber.prototype._unsubscribe = function () {
          var connectable = this.connectable;
          if (!connectable) {
              this.connection = null;
              return;
          }
          this.connectable = null;
          var refCount$$1 = connectable._refCount;
          if (refCount$$1 <= 0) {
              this.connection = null;
              return;
          }
          connectable._refCount = refCount$$1 - 1;
          if (refCount$$1 > 1) {
              this.connection = null;
              return;
          }
          var connection = this.connection;
          var sharedConnection = connectable._connection;
          this.connection = null;
          if (sharedConnection && (!connection || sharedConnection === connection)) {
              sharedConnection.unsubscribe();
          }
      };
      return RefCountSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber,_Subscription,_Observable,_Subject PURE_IMPORTS_END */
  var GroupBySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(GroupBySubscriber, _super);
      function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
          var _this = _super.call(this, destination) || this;
          _this.keySelector = keySelector;
          _this.elementSelector = elementSelector;
          _this.durationSelector = durationSelector;
          _this.subjectSelector = subjectSelector;
          _this.groups = null;
          _this.attemptedToUnsubscribe = false;
          _this.count = 0;
          return _this;
      }
      GroupBySubscriber.prototype._next = function (value) {
          var key;
          try {
              key = this.keySelector(value);
          }
          catch (err) {
              this.error(err);
              return;
          }
          this._group(value, key);
      };
      GroupBySubscriber.prototype._group = function (value, key) {
          var groups = this.groups;
          if (!groups) {
              groups = this.groups = new Map();
          }
          var group = groups.get(key);
          var element;
          if (this.elementSelector) {
              try {
                  element = this.elementSelector(value);
              }
              catch (err) {
                  this.error(err);
              }
          }
          else {
              element = value;
          }
          if (!group) {
              group = (this.subjectSelector ? this.subjectSelector() : new Subject());
              groups.set(key, group);
              var groupedObservable = new GroupedObservable(key, group, this);
              this.destination.next(groupedObservable);
              if (this.durationSelector) {
                  var duration = void 0;
                  try {
                      duration = this.durationSelector(new GroupedObservable(key, group));
                  }
                  catch (err) {
                      this.error(err);
                      return;
                  }
                  this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
              }
          }
          if (!group.closed) {
              group.next(element);
          }
      };
      GroupBySubscriber.prototype._error = function (err) {
          var groups = this.groups;
          if (groups) {
              groups.forEach(function (group, key) {
                  group.error(err);
              });
              groups.clear();
          }
          this.destination.error(err);
      };
      GroupBySubscriber.prototype._complete = function () {
          var groups = this.groups;
          if (groups) {
              groups.forEach(function (group, key) {
                  group.complete();
              });
              groups.clear();
          }
          this.destination.complete();
      };
      GroupBySubscriber.prototype.removeGroup = function (key) {
          this.groups.delete(key);
      };
      GroupBySubscriber.prototype.unsubscribe = function () {
          if (!this.closed) {
              this.attemptedToUnsubscribe = true;
              if (this.count === 0) {
                  _super.prototype.unsubscribe.call(this);
              }
          }
      };
      return GroupBySubscriber;
  }(Subscriber));
  var GroupDurationSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(GroupDurationSubscriber, _super);
      function GroupDurationSubscriber(key, group, parent) {
          var _this = _super.call(this, group) || this;
          _this.key = key;
          _this.group = group;
          _this.parent = parent;
          return _this;
      }
      GroupDurationSubscriber.prototype._next = function (value) {
          this.complete();
      };
      GroupDurationSubscriber.prototype._unsubscribe = function () {
          var _a = this, parent = _a.parent, key = _a.key;
          this.key = this.parent = null;
          if (parent) {
              parent.removeGroup(key);
          }
      };
      return GroupDurationSubscriber;
  }(Subscriber));
  var GroupedObservable = /*@__PURE__*/ (function (_super) {
      __extends(GroupedObservable, _super);
      function GroupedObservable(key, groupSubject, refCountSubscription) {
          var _this = _super.call(this) || this;
          _this.key = key;
          _this.groupSubject = groupSubject;
          _this.refCountSubscription = refCountSubscription;
          return _this;
      }
      GroupedObservable.prototype._subscribe = function (subscriber) {
          var subscription = new Subscription();
          var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
          if (refCountSubscription && !refCountSubscription.closed) {
              subscription.add(new InnerRefCountSubscription(refCountSubscription));
          }
          subscription.add(groupSubject.subscribe(subscriber));
          return subscription;
      };
      return GroupedObservable;
  }(Observable));
  var InnerRefCountSubscription = /*@__PURE__*/ (function (_super) {
      __extends(InnerRefCountSubscription, _super);
      function InnerRefCountSubscription(parent) {
          var _this = _super.call(this) || this;
          _this.parent = parent;
          parent.count++;
          return _this;
      }
      InnerRefCountSubscription.prototype.unsubscribe = function () {
          var parent = this.parent;
          if (!parent.closed && !this.closed) {
              _super.prototype.unsubscribe.call(this);
              parent.count -= 1;
              if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                  parent.unsubscribe();
              }
          }
      };
      return InnerRefCountSubscription;
  }(Subscription));

  /** PURE_IMPORTS_START tslib,_Subject,_util_ObjectUnsubscribedError PURE_IMPORTS_END */
  var BehaviorSubject = /*@__PURE__*/ (function (_super) {
      __extends(BehaviorSubject, _super);
      function BehaviorSubject(_value) {
          var _this = _super.call(this) || this;
          _this._value = _value;
          return _this;
      }
      Object.defineProperty(BehaviorSubject.prototype, "value", {
          get: function () {
              return this.getValue();
          },
          enumerable: true,
          configurable: true
      });
      BehaviorSubject.prototype._subscribe = function (subscriber) {
          var subscription = _super.prototype._subscribe.call(this, subscriber);
          if (subscription && !subscription.closed) {
              subscriber.next(this._value);
          }
          return subscription;
      };
      BehaviorSubject.prototype.getValue = function () {
          if (this.hasError) {
              throw this.thrownError;
          }
          else if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          else {
              return this._value;
          }
      };
      BehaviorSubject.prototype.next = function (value) {
          _super.prototype.next.call(this, this._value = value);
      };
      return BehaviorSubject;
  }(Subject));

  /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
  var Action = /*@__PURE__*/ (function (_super) {
      __extends(Action, _super);
      function Action(scheduler, work) {
          return _super.call(this) || this;
      }
      Action.prototype.schedule = function (state, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          return this;
      };
      return Action;
  }(Subscription));

  /** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */
  var AsyncAction = /*@__PURE__*/ (function (_super) {
      __extends(AsyncAction, _super);
      function AsyncAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          _this.pending = false;
          return _this;
      }
      AsyncAction.prototype.schedule = function (state, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if (this.closed) {
              return this;
          }
          this.state = state;
          var id = this.id;
          var scheduler = this.scheduler;
          if (id != null) {
              this.id = this.recycleAsyncId(scheduler, id, delay);
          }
          this.pending = true;
          this.delay = delay;
          this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
          return this;
      };
      AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          return setInterval(scheduler.flush.bind(scheduler, this), delay);
      };
      AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if (delay !== null && this.delay === delay && this.pending === false) {
              return id;
          }
          clearInterval(id);
      };
      AsyncAction.prototype.execute = function (state, delay) {
          if (this.closed) {
              return new Error('executing a cancelled action');
          }
          this.pending = false;
          var error = this._execute(state, delay);
          if (error) {
              return error;
          }
          else if (this.pending === false && this.id != null) {
              this.id = this.recycleAsyncId(this.scheduler, this.id, null);
          }
      };
      AsyncAction.prototype._execute = function (state, delay) {
          var errored = false;
          var errorValue = undefined;
          try {
              this.work(state);
          }
          catch (e) {
              errored = true;
              errorValue = !!e && e || new Error(e);
          }
          if (errored) {
              this.unsubscribe();
              return errorValue;
          }
      };
      AsyncAction.prototype._unsubscribe = function () {
          var id = this.id;
          var scheduler = this.scheduler;
          var actions = scheduler.actions;
          var index = actions.indexOf(this);
          this.work = null;
          this.state = null;
          this.pending = false;
          this.scheduler = null;
          if (index !== -1) {
              actions.splice(index, 1);
          }
          if (id != null) {
              this.id = this.recycleAsyncId(scheduler, id, null);
          }
          this.delay = null;
      };
      return AsyncAction;
  }(Action));

  /** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
  var QueueAction = /*@__PURE__*/ (function (_super) {
      __extends(QueueAction, _super);
      function QueueAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          return _this;
      }
      QueueAction.prototype.schedule = function (state, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if (delay > 0) {
              return _super.prototype.schedule.call(this, state, delay);
          }
          this.delay = delay;
          this.state = state;
          this.scheduler.flush(this);
          return this;
      };
      QueueAction.prototype.execute = function (state, delay) {
          return (delay > 0 || this.closed) ?
              _super.prototype.execute.call(this, state, delay) :
              this._execute(state, delay);
      };
      QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
              return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
          }
          return scheduler.flush(this);
      };
      return QueueAction;
  }(AsyncAction));

  var Scheduler = /*@__PURE__*/ (function () {
      function Scheduler(SchedulerAction, now) {
          if (now === void 0) {
              now = Scheduler.now;
          }
          this.SchedulerAction = SchedulerAction;
          this.now = now;
      }
      Scheduler.prototype.schedule = function (work, delay, state) {
          if (delay === void 0) {
              delay = 0;
          }
          return new this.SchedulerAction(this, work).schedule(state, delay);
      };
      Scheduler.now = function () { return Date.now(); };
      return Scheduler;
  }());

  /** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */
  var AsyncScheduler = /*@__PURE__*/ (function (_super) {
      __extends(AsyncScheduler, _super);
      function AsyncScheduler(SchedulerAction, now) {
          if (now === void 0) {
              now = Scheduler.now;
          }
          var _this = _super.call(this, SchedulerAction, function () {
              if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
                  return AsyncScheduler.delegate.now();
              }
              else {
                  return now();
              }
          }) || this;
          _this.actions = [];
          _this.active = false;
          _this.scheduled = undefined;
          return _this;
      }
      AsyncScheduler.prototype.schedule = function (work, delay, state) {
          if (delay === void 0) {
              delay = 0;
          }
          if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
              return AsyncScheduler.delegate.schedule(work, delay, state);
          }
          else {
              return _super.prototype.schedule.call(this, work, delay, state);
          }
      };
      AsyncScheduler.prototype.flush = function (action) {
          var actions = this.actions;
          if (this.active) {
              actions.push(action);
              return;
          }
          var error;
          this.active = true;
          do {
              if (error = action.execute(action.state, action.delay)) {
                  break;
              }
          } while (action = actions.shift());
          this.active = false;
          if (error) {
              while (action = actions.shift()) {
                  action.unsubscribe();
              }
              throw error;
          }
      };
      return AsyncScheduler;
  }(Scheduler));

  /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
  var QueueScheduler = /*@__PURE__*/ (function (_super) {
      __extends(QueueScheduler, _super);
      function QueueScheduler() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return QueueScheduler;
  }(AsyncScheduler));

  /** PURE_IMPORTS_START _QueueAction,_QueueScheduler PURE_IMPORTS_END */
  var queue = /*@__PURE__*/ new QueueScheduler(QueueAction);

  /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
  var EMPTY = /*@__PURE__*/ new Observable(function (subscriber) { return subscriber.complete(); });
  function empty$1(scheduler) {
      return scheduler ? emptyScheduled(scheduler) : EMPTY;
  }
  function emptyScheduled(scheduler) {
      return new Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isScheduler(value) {
      return value && typeof value.schedule === 'function';
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var subscribeToArray = function (array) {
      return function (subscriber) {
          for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
              subscriber.next(array[i]);
          }
          if (!subscriber.closed) {
              subscriber.complete();
          }
      };
  };

  /** PURE_IMPORTS_START _Observable,_Subscription,_util_subscribeToArray PURE_IMPORTS_END */
  function fromArray(input, scheduler) {
      if (!scheduler) {
          return new Observable(subscribeToArray(input));
      }
      else {
          return new Observable(function (subscriber) {
              var sub = new Subscription();
              var i = 0;
              sub.add(scheduler.schedule(function () {
                  if (i === input.length) {
                      subscriber.complete();
                      return;
                  }
                  subscriber.next(input[i++]);
                  if (!subscriber.closed) {
                      sub.add(this.schedule());
                  }
              }));
              return sub;
          });
      }
  }

  /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
  function scalar(value) {
      var result = new Observable(function (subscriber) {
          subscriber.next(value);
          subscriber.complete();
      });
      result._isScalar = true;
      result.value = value;
      return result;
  }

  /** PURE_IMPORTS_START _util_isScheduler,_fromArray,_empty,_scalar PURE_IMPORTS_END */
  function of() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
      }
      var scheduler = args[args.length - 1];
      if (isScheduler(scheduler)) {
          args.pop();
      }
      else {
          scheduler = undefined;
      }
      switch (args.length) {
          case 0:
              return empty$1(scheduler);
          case 1:
              return scheduler ? fromArray(args, scheduler) : scalar(args[0]);
          default:
              return fromArray(args, scheduler);
      }
  }

  /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
  function throwError(error, scheduler) {
      if (!scheduler) {
          return new Observable(function (subscriber) { return subscriber.error(error); });
      }
      else {
          return new Observable(function (subscriber) { return scheduler.schedule(dispatch, 0, { error: error, subscriber: subscriber }); });
      }
  }
  function dispatch(_a) {
      var error = _a.error, subscriber = _a.subscriber;
      subscriber.error(error);
  }

  /** PURE_IMPORTS_START _observable_empty,_observable_of,_observable_throwError PURE_IMPORTS_END */
  var Notification = /*@__PURE__*/ (function () {
      function Notification(kind, value, error) {
          this.kind = kind;
          this.value = value;
          this.error = error;
          this.hasValue = kind === 'N';
      }
      Notification.prototype.observe = function (observer) {
          switch (this.kind) {
              case 'N':
                  return observer.next && observer.next(this.value);
              case 'E':
                  return observer.error && observer.error(this.error);
              case 'C':
                  return observer.complete && observer.complete();
          }
      };
      Notification.prototype.do = function (next, error, complete) {
          var kind = this.kind;
          switch (kind) {
              case 'N':
                  return next && next(this.value);
              case 'E':
                  return error && error(this.error);
              case 'C':
                  return complete && complete();
          }
      };
      Notification.prototype.accept = function (nextOrObserver, error, complete) {
          if (nextOrObserver && typeof nextOrObserver.next === 'function') {
              return this.observe(nextOrObserver);
          }
          else {
              return this.do(nextOrObserver, error, complete);
          }
      };
      Notification.prototype.toObservable = function () {
          var kind = this.kind;
          switch (kind) {
              case 'N':
                  return of(this.value);
              case 'E':
                  return throwError(this.error);
              case 'C':
                  return empty$1();
          }
          throw new Error('unexpected notification kind value');
      };
      Notification.createNext = function (value) {
          if (typeof value !== 'undefined') {
              return new Notification('N', value);
          }
          return Notification.undefinedValueNotification;
      };
      Notification.createError = function (err) {
          return new Notification('E', undefined, err);
      };
      Notification.createComplete = function () {
          return Notification.completeNotification;
      };
      Notification.completeNotification = new Notification('C');
      Notification.undefinedValueNotification = new Notification('N', undefined);
      return Notification;
  }());

  /** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */
  var ObserveOnSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ObserveOnSubscriber, _super);
      function ObserveOnSubscriber(destination, scheduler, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          var _this = _super.call(this, destination) || this;
          _this.scheduler = scheduler;
          _this.delay = delay;
          return _this;
      }
      ObserveOnSubscriber.dispatch = function (arg) {
          var notification = arg.notification, destination = arg.destination;
          notification.observe(destination);
          this.unsubscribe();
      };
      ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
          var destination = this.destination;
          destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
      };
      ObserveOnSubscriber.prototype._next = function (value) {
          this.scheduleMessage(Notification.createNext(value));
      };
      ObserveOnSubscriber.prototype._error = function (err) {
          this.scheduleMessage(Notification.createError(err));
          this.unsubscribe();
      };
      ObserveOnSubscriber.prototype._complete = function () {
          this.scheduleMessage(Notification.createComplete());
          this.unsubscribe();
      };
      return ObserveOnSubscriber;
  }(Subscriber));
  var ObserveOnMessage = /*@__PURE__*/ (function () {
      function ObserveOnMessage(notification, destination) {
          this.notification = notification;
          this.destination = destination;
      }
      return ObserveOnMessage;
  }());

  /** PURE_IMPORTS_START tslib,_Subject,_scheduler_queue,_Subscription,_operators_observeOn,_util_ObjectUnsubscribedError,_SubjectSubscription PURE_IMPORTS_END */
  var ReplaySubject = /*@__PURE__*/ (function (_super) {
      __extends(ReplaySubject, _super);
      function ReplaySubject(bufferSize, windowTime, scheduler) {
          if (bufferSize === void 0) {
              bufferSize = Number.POSITIVE_INFINITY;
          }
          if (windowTime === void 0) {
              windowTime = Number.POSITIVE_INFINITY;
          }
          var _this = _super.call(this) || this;
          _this.scheduler = scheduler;
          _this._events = [];
          _this._infiniteTimeWindow = false;
          _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
          _this._windowTime = windowTime < 1 ? 1 : windowTime;
          if (windowTime === Number.POSITIVE_INFINITY) {
              _this._infiniteTimeWindow = true;
              _this.next = _this.nextInfiniteTimeWindow;
          }
          else {
              _this.next = _this.nextTimeWindow;
          }
          return _this;
      }
      ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
          var _events = this._events;
          _events.push(value);
          if (_events.length > this._bufferSize) {
              _events.shift();
          }
          _super.prototype.next.call(this, value);
      };
      ReplaySubject.prototype.nextTimeWindow = function (value) {
          this._events.push(new ReplayEvent(this._getNow(), value));
          this._trimBufferThenGetEvents();
          _super.prototype.next.call(this, value);
      };
      ReplaySubject.prototype._subscribe = function (subscriber) {
          var _infiniteTimeWindow = this._infiniteTimeWindow;
          var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
          var scheduler = this.scheduler;
          var len = _events.length;
          var subscription;
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          else if (this.isStopped || this.hasError) {
              subscription = Subscription.EMPTY;
          }
          else {
              this.observers.push(subscriber);
              subscription = new SubjectSubscription(this, subscriber);
          }
          if (scheduler) {
              subscriber.add(subscriber = new ObserveOnSubscriber(subscriber, scheduler));
          }
          if (_infiniteTimeWindow) {
              for (var i = 0; i < len && !subscriber.closed; i++) {
                  subscriber.next(_events[i]);
              }
          }
          else {
              for (var i = 0; i < len && !subscriber.closed; i++) {
                  subscriber.next(_events[i].value);
              }
          }
          if (this.hasError) {
              subscriber.error(this.thrownError);
          }
          else if (this.isStopped) {
              subscriber.complete();
          }
          return subscription;
      };
      ReplaySubject.prototype._getNow = function () {
          return (this.scheduler || queue).now();
      };
      ReplaySubject.prototype._trimBufferThenGetEvents = function () {
          var now = this._getNow();
          var _bufferSize = this._bufferSize;
          var _windowTime = this._windowTime;
          var _events = this._events;
          var eventsCount = _events.length;
          var spliceCount = 0;
          while (spliceCount < eventsCount) {
              if ((now - _events[spliceCount].time) < _windowTime) {
                  break;
              }
              spliceCount++;
          }
          if (eventsCount > _bufferSize) {
              spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
          }
          if (spliceCount > 0) {
              _events.splice(0, spliceCount);
          }
          return _events;
      };
      return ReplaySubject;
  }(Subject));
  var ReplayEvent = /*@__PURE__*/ (function () {
      function ReplayEvent(time, value) {
          this.time = time;
          this.value = value;
      }
      return ReplayEvent;
  }());

  /** PURE_IMPORTS_START tslib,_Subject,_Subscription PURE_IMPORTS_END */
  var AsyncSubject = /*@__PURE__*/ (function (_super) {
      __extends(AsyncSubject, _super);
      function AsyncSubject() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.value = null;
          _this.hasNext = false;
          _this.hasCompleted = false;
          return _this;
      }
      AsyncSubject.prototype._subscribe = function (subscriber) {
          if (this.hasError) {
              subscriber.error(this.thrownError);
              return Subscription.EMPTY;
          }
          else if (this.hasCompleted && this.hasNext) {
              subscriber.next(this.value);
              subscriber.complete();
              return Subscription.EMPTY;
          }
          return _super.prototype._subscribe.call(this, subscriber);
      };
      AsyncSubject.prototype.next = function (value) {
          if (!this.hasCompleted) {
              this.value = value;
              this.hasNext = true;
          }
      };
      AsyncSubject.prototype.error = function (error) {
          if (!this.hasCompleted) {
              _super.prototype.error.call(this, error);
          }
      };
      AsyncSubject.prototype.complete = function () {
          this.hasCompleted = true;
          if (this.hasNext) {
              _super.prototype.next.call(this, this.value);
          }
          _super.prototype.complete.call(this);
      };
      return AsyncSubject;
  }(Subject));

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var nextHandle = 1;
  var tasksByHandle = {};
  function runIfPresent(handle) {
      var cb = tasksByHandle[handle];
      if (cb) {
          cb();
      }
  }
  var Immediate = {
      setImmediate: function (cb) {
          var handle = nextHandle++;
          tasksByHandle[handle] = cb;
          Promise.resolve().then(function () { return runIfPresent(handle); });
          return handle;
      },
      clearImmediate: function (handle) {
          delete tasksByHandle[handle];
      },
  };

  /** PURE_IMPORTS_START tslib,_util_Immediate,_AsyncAction PURE_IMPORTS_END */
  var AsapAction = /*@__PURE__*/ (function (_super) {
      __extends(AsapAction, _super);
      function AsapAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          return _this;
      }
      AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if (delay !== null && delay > 0) {
              return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
          }
          scheduler.actions.push(this);
          return scheduler.scheduled || (scheduler.scheduled = Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
      };
      AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
              return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
          }
          if (scheduler.actions.length === 0) {
              Immediate.clearImmediate(id);
              scheduler.scheduled = undefined;
          }
          return undefined;
      };
      return AsapAction;
  }(AsyncAction));

  /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
  var AsapScheduler = /*@__PURE__*/ (function (_super) {
      __extends(AsapScheduler, _super);
      function AsapScheduler() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      AsapScheduler.prototype.flush = function (action) {
          this.active = true;
          this.scheduled = undefined;
          var actions = this.actions;
          var error;
          var index = -1;
          var count = actions.length;
          action = action || actions.shift();
          do {
              if (error = action.execute(action.state, action.delay)) {
                  break;
              }
          } while (++index < count && (action = actions.shift()));
          this.active = false;
          if (error) {
              while (++index < count && (action = actions.shift())) {
                  action.unsubscribe();
              }
              throw error;
          }
      };
      return AsapScheduler;
  }(AsyncScheduler));

  /** PURE_IMPORTS_START _AsapAction,_AsapScheduler PURE_IMPORTS_END */
  var asap = /*@__PURE__*/ new AsapScheduler(AsapAction);

  /** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
  var async = /*@__PURE__*/ new AsyncScheduler(AsyncAction);

  /** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
  var AnimationFrameAction = /*@__PURE__*/ (function (_super) {
      __extends(AnimationFrameAction, _super);
      function AnimationFrameAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          return _this;
      }
      AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if (delay !== null && delay > 0) {
              return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
          }
          scheduler.actions.push(this);
          return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function () { return scheduler.flush(null); }));
      };
      AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
              return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
          }
          if (scheduler.actions.length === 0) {
              cancelAnimationFrame(id);
              scheduler.scheduled = undefined;
          }
          return undefined;
      };
      return AnimationFrameAction;
  }(AsyncAction));

  /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
  var AnimationFrameScheduler = /*@__PURE__*/ (function (_super) {
      __extends(AnimationFrameScheduler, _super);
      function AnimationFrameScheduler() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      AnimationFrameScheduler.prototype.flush = function (action) {
          this.active = true;
          this.scheduled = undefined;
          var actions = this.actions;
          var error;
          var index = -1;
          var count = actions.length;
          action = action || actions.shift();
          do {
              if (error = action.execute(action.state, action.delay)) {
                  break;
              }
          } while (++index < count && (action = actions.shift()));
          this.active = false;
          if (error) {
              while (++index < count && (action = actions.shift())) {
                  action.unsubscribe();
              }
              throw error;
          }
      };
      return AnimationFrameScheduler;
  }(AsyncScheduler));

  /** PURE_IMPORTS_START _AnimationFrameAction,_AnimationFrameScheduler PURE_IMPORTS_END */
  var animationFrame = /*@__PURE__*/ new AnimationFrameScheduler(AnimationFrameAction);

  /** PURE_IMPORTS_START tslib,_AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
  var VirtualTimeScheduler = /*@__PURE__*/ (function (_super) {
      __extends(VirtualTimeScheduler, _super);
      function VirtualTimeScheduler(SchedulerAction, maxFrames) {
          if (SchedulerAction === void 0) {
              SchedulerAction = VirtualAction;
          }
          if (maxFrames === void 0) {
              maxFrames = Number.POSITIVE_INFINITY;
          }
          var _this = _super.call(this, SchedulerAction, function () { return _this.frame; }) || this;
          _this.maxFrames = maxFrames;
          _this.frame = 0;
          _this.index = -1;
          return _this;
      }
      VirtualTimeScheduler.prototype.flush = function () {
          var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
          var error, action;
          while ((action = actions.shift()) && (this.frame = action.delay) <= maxFrames) {
              if (error = action.execute(action.state, action.delay)) {
                  break;
              }
          }
          if (error) {
              while (action = actions.shift()) {
                  action.unsubscribe();
              }
              throw error;
          }
      };
      VirtualTimeScheduler.frameTimeFactor = 10;
      return VirtualTimeScheduler;
  }(AsyncScheduler));
  var VirtualAction = /*@__PURE__*/ (function (_super) {
      __extends(VirtualAction, _super);
      function VirtualAction(scheduler, work, index) {
          if (index === void 0) {
              index = scheduler.index += 1;
          }
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          _this.index = index;
          _this.active = true;
          _this.index = scheduler.index = index;
          return _this;
      }
      VirtualAction.prototype.schedule = function (state, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if (!this.id) {
              return _super.prototype.schedule.call(this, state, delay);
          }
          this.active = false;
          var action = new VirtualAction(this.scheduler, this.work);
          this.add(action);
          return action.schedule(state, delay);
      };
      VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          this.delay = scheduler.frame + delay;
          var actions = scheduler.actions;
          actions.push(this);
          actions.sort(VirtualAction.sortActions);
          return true;
      };
      VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          return undefined;
      };
      VirtualAction.prototype._execute = function (state, delay) {
          if (this.active === true) {
              return _super.prototype._execute.call(this, state, delay);
          }
      };
      VirtualAction.sortActions = function (a, b) {
          if (a.delay === b.delay) {
              if (a.index === b.index) {
                  return 0;
              }
              else if (a.index > b.index) {
                  return 1;
              }
              else {
                  return -1;
              }
          }
          else if (a.delay > b.delay) {
              return 1;
          }
          else {
              return -1;
          }
      };
      return VirtualAction;
  }(AsyncAction));

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function EmptyErrorImpl() {
      Error.call(this);
      this.message = 'no elements in sequence';
      this.name = 'EmptyError';
      return this;
  }
  EmptyErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
  var EmptyError = EmptyErrorImpl;

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var MapSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(MapSubscriber, _super);
      function MapSubscriber(destination, project, thisArg) {
          var _this = _super.call(this, destination) || this;
          _this.project = project;
          _this.count = 0;
          _this.thisArg = thisArg || _this;
          return _this;
      }
      MapSubscriber.prototype._next = function (value) {
          var result;
          try {
              result = this.project.call(this.thisArg, value, this.count++);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.next(result);
      };
      return MapSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isArray,_util_isScheduler PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isScheduler,_util_isArray PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var OuterSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(OuterSubscriber, _super);
      function OuterSubscriber() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.destination.next(innerValue);
      };
      OuterSubscriber.prototype.notifyError = function (error, innerSub) {
          this.destination.error(error);
      };
      OuterSubscriber.prototype.notifyComplete = function (innerSub) {
          this.destination.complete();
      };
      return OuterSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var InnerSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(InnerSubscriber, _super);
      function InnerSubscriber(parent, outerValue, outerIndex) {
          var _this = _super.call(this) || this;
          _this.parent = parent;
          _this.outerValue = outerValue;
          _this.outerIndex = outerIndex;
          _this.index = 0;
          return _this;
      }
      InnerSubscriber.prototype._next = function (value) {
          this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
      };
      InnerSubscriber.prototype._error = function (error) {
          this.parent.notifyError(error, this);
          this.unsubscribe();
      };
      InnerSubscriber.prototype._complete = function () {
          this.parent.notifyComplete(this);
          this.unsubscribe();
      };
      return InnerSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
  var subscribeToPromise = function (promise) {
      return function (subscriber) {
          promise.then(function (value) {
              if (!subscriber.closed) {
                  subscriber.next(value);
                  subscriber.complete();
              }
          }, function (err) { return subscriber.error(err); })
              .then(null, hostReportError);
          return subscriber;
      };
  };

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function getSymbolIterator() {
      if (typeof Symbol !== 'function' || !Symbol.iterator) {
          return '@@iterator';
      }
      return Symbol.iterator;
  }
  var iterator = /*@__PURE__*/ getSymbolIterator();

  /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
  var subscribeToIterable = function (iterable) {
      return function (subscriber) {
          var iterator$$1 = iterable[iterator]();
          do {
              var item = iterator$$1.next();
              if (item.done) {
                  subscriber.complete();
                  break;
              }
              subscriber.next(item.value);
              if (subscriber.closed) {
                  break;
              }
          } while (true);
          if (typeof iterator$$1.return === 'function') {
              subscriber.add(function () {
                  if (iterator$$1.return) {
                      iterator$$1.return();
                  }
              });
          }
          return subscriber;
      };
  };

  /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
  var subscribeToObservable = function (obj) {
      return function (subscriber) {
          var obs = obj[observable]();
          if (typeof obs.subscribe !== 'function') {
              throw new TypeError('Provided object does not correctly implement Symbol.observable');
          }
          else {
              return obs.subscribe(subscriber);
          }
      };
  };

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isPromise(value) {
      return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
  }

  /** PURE_IMPORTS_START _Observable,_subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
  var subscribeTo = function (result) {
      if (result instanceof Observable) {
          return function (subscriber) {
              if (result._isScalar) {
                  subscriber.next(result.value);
                  subscriber.complete();
                  return undefined;
              }
              else {
                  return result.subscribe(subscriber);
              }
          };
      }
      else if (result && typeof result[observable] === 'function') {
          return subscribeToObservable(result);
      }
      else if (isArrayLike(result)) {
          return subscribeToArray(result);
      }
      else if (isPromise(result)) {
          return subscribeToPromise(result);
      }
      else if (result && typeof result[iterator] === 'function') {
          return subscribeToIterable(result);
      }
      else {
          var value = isObject(result) ? 'an invalid object' : "'" + result + "'";
          var msg = "You provided " + value + " where a stream was expected."
              + ' You can provide an Observable, Promise, Array, or Iterable.';
          throw new TypeError(msg);
      }
  };

  /** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo PURE_IMPORTS_END */
  function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, destination) {
      if (destination === void 0) {
          destination = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
      }
      if (destination.closed) {
          return;
      }
      return subscribeTo(result)(destination);
  }

  /** PURE_IMPORTS_START tslib,_util_isScheduler,_util_isArray,_OuterSubscriber,_util_subscribeToResult,_fromArray PURE_IMPORTS_END */
  var NONE = {};
  var CombineLatestSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(CombineLatestSubscriber, _super);
      function CombineLatestSubscriber(destination, resultSelector) {
          var _this = _super.call(this, destination) || this;
          _this.resultSelector = resultSelector;
          _this.active = 0;
          _this.values = [];
          _this.observables = [];
          return _this;
      }
      CombineLatestSubscriber.prototype._next = function (observable) {
          this.values.push(NONE);
          this.observables.push(observable);
      };
      CombineLatestSubscriber.prototype._complete = function () {
          var observables = this.observables;
          var len = observables.length;
          if (len === 0) {
              this.destination.complete();
          }
          else {
              this.active = len;
              this.toRespond = len;
              for (var i = 0; i < len; i++) {
                  var observable = observables[i];
                  this.add(subscribeToResult(this, observable, observable, i));
              }
          }
      };
      CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
          if ((this.active -= 1) === 0) {
              this.destination.complete();
          }
      };
      CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          var values = this.values;
          var oldVal = values[outerIndex];
          var toRespond = !this.toRespond
              ? 0
              : oldVal === NONE ? --this.toRespond : this.toRespond;
          values[outerIndex] = innerValue;
          if (toRespond === 0) {
              if (this.resultSelector) {
                  this._tryResultSelector(values);
              }
              else {
                  this.destination.next(values.slice());
              }
          }
      };
      CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
          var result;
          try {
              result = this.resultSelector.apply(this, values);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.next(result);
      };
      return CombineLatestSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable,_Subscription,_util_subscribeToPromise PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator,_util_subscribeToIterable PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable,_util_subscribeToObservable PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable,_util_isPromise,_util_isArrayLike,_util_isInteropObservable,_util_isIterable,_fromArray,_fromPromise,_fromIterable,_fromObservable,_util_subscribeTo PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_InnerSubscriber,_map,_observable_from PURE_IMPORTS_END */
  var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(MergeMapSubscriber, _super);
      function MergeMapSubscriber(destination, project, concurrent) {
          if (concurrent === void 0) {
              concurrent = Number.POSITIVE_INFINITY;
          }
          var _this = _super.call(this, destination) || this;
          _this.project = project;
          _this.concurrent = concurrent;
          _this.hasCompleted = false;
          _this.buffer = [];
          _this.active = 0;
          _this.index = 0;
          return _this;
      }
      MergeMapSubscriber.prototype._next = function (value) {
          if (this.active < this.concurrent) {
              this._tryNext(value);
          }
          else {
              this.buffer.push(value);
          }
      };
      MergeMapSubscriber.prototype._tryNext = function (value) {
          var result;
          var index = this.index++;
          try {
              result = this.project(value, index);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.active++;
          this._innerSub(result, value, index);
      };
      MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
          var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
          var destination = this.destination;
          destination.add(innerSubscriber);
          subscribeToResult(this, ish, value, index, innerSubscriber);
      };
      MergeMapSubscriber.prototype._complete = function () {
          this.hasCompleted = true;
          if (this.active === 0 && this.buffer.length === 0) {
              this.destination.complete();
          }
          this.unsubscribe();
      };
      MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.destination.next(innerValue);
      };
      MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
          var buffer = this.buffer;
          this.remove(innerSub);
          this.active--;
          if (buffer.length > 0) {
              this._next(buffer.shift());
          }
          else if (this.active === 0 && this.hasCompleted) {
              this.destination.complete();
          }
      };
      return MergeMapSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START _mergeMap,_util_identity PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _mergeAll PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _util_isScheduler,_of,_from,_operators_concatAll PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_Observable,_util_isArray,_empty,_util_subscribeToResult,_OuterSubscriber,_operators_map PURE_IMPORTS_END */
  var ForkJoinSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ForkJoinSubscriber, _super);
      function ForkJoinSubscriber(destination, sources) {
          var _this = _super.call(this, destination) || this;
          _this.sources = sources;
          _this.completed = 0;
          _this.haveValues = 0;
          var len = sources.length;
          _this.values = new Array(len);
          for (var i = 0; i < len; i++) {
              var source = sources[i];
              var innerSubscription = subscribeToResult(_this, source, null, i);
              if (innerSubscription) {
                  _this.add(innerSubscription);
              }
          }
          return _this;
      }
      ForkJoinSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.values[outerIndex] = innerValue;
          if (!innerSub._hasValue) {
              innerSub._hasValue = true;
              this.haveValues++;
          }
      };
      ForkJoinSubscriber.prototype.notifyComplete = function (innerSub) {
          var _a = this, destination = _a.destination, haveValues = _a.haveValues, values = _a.values;
          var len = values.length;
          if (!innerSub._hasValue) {
              destination.complete();
              return;
          }
          this.completed++;
          if (this.completed !== len) {
              return;
          }
          if (haveValues === len) {
              destination.next(values);
          }
          destination.complete();
      };
      return ForkJoinSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable,_util_identity,_util_isScheduler PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _defer,_empty PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _isArray PURE_IMPORTS_END */
  function isNumeric(val) {
      return !isArray(val) && (val - parseFloat(val) + 1) >= 0;
  }

  /** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable,_util_isScheduler,_operators_mergeAll,_fromArray PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable,_util_noop PURE_IMPORTS_END */
  var NEVER = /*@__PURE__*/ new Observable(noop);

  /** PURE_IMPORTS_START _Observable,_from,_util_isArray,_empty PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_util_isArray,_fromArray,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var RaceSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(RaceSubscriber, _super);
      function RaceSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.hasFirst = false;
          _this.observables = [];
          _this.subscriptions = [];
          return _this;
      }
      RaceSubscriber.prototype._next = function (observable) {
          this.observables.push(observable);
      };
      RaceSubscriber.prototype._complete = function () {
          var observables = this.observables;
          var len = observables.length;
          if (len === 0) {
              this.destination.complete();
          }
          else {
              for (var i = 0; i < len && !this.hasFirst; i++) {
                  var observable = observables[i];
                  var subscription = subscribeToResult(this, observable, observable, i);
                  if (this.subscriptions) {
                      this.subscriptions.push(subscription);
                  }
                  this.add(subscription);
              }
              this.observables = null;
          }
      };
      RaceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          if (!this.hasFirst) {
              this.hasFirst = true;
              for (var i = 0; i < this.subscriptions.length; i++) {
                  if (i !== outerIndex) {
                      var subscription = this.subscriptions[i];
                      subscription.unsubscribe();
                      this.remove(subscription);
                  }
              }
              this.subscriptions = null;
          }
          this.destination.next(innerValue);
      };
      return RaceSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_fromArray,_util_isArray,_Subscriber,_OuterSubscriber,_util_subscribeToResult,_.._internal_symbol_iterator PURE_IMPORTS_END */
  var ZipSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ZipSubscriber, _super);
      function ZipSubscriber(destination, resultSelector, values) {
          if (values === void 0) {
              values = Object.create(null);
          }
          var _this = _super.call(this, destination) || this;
          _this.iterators = [];
          _this.active = 0;
          _this.resultSelector = (typeof resultSelector === 'function') ? resultSelector : null;
          _this.values = values;
          return _this;
      }
      ZipSubscriber.prototype._next = function (value) {
          var iterators = this.iterators;
          if (isArray(value)) {
              iterators.push(new StaticArrayIterator(value));
          }
          else if (typeof value[iterator] === 'function') {
              iterators.push(new StaticIterator(value[iterator]()));
          }
          else {
              iterators.push(new ZipBufferIterator(this.destination, this, value));
          }
      };
      ZipSubscriber.prototype._complete = function () {
          var iterators = this.iterators;
          var len = iterators.length;
          this.unsubscribe();
          if (len === 0) {
              this.destination.complete();
              return;
          }
          this.active = len;
          for (var i = 0; i < len; i++) {
              var iterator$$1 = iterators[i];
              if (iterator$$1.stillUnsubscribed) {
                  var destination = this.destination;
                  destination.add(iterator$$1.subscribe(iterator$$1, i));
              }
              else {
                  this.active--;
              }
          }
      };
      ZipSubscriber.prototype.notifyInactive = function () {
          this.active--;
          if (this.active === 0) {
              this.destination.complete();
          }
      };
      ZipSubscriber.prototype.checkIterators = function () {
          var iterators = this.iterators;
          var len = iterators.length;
          var destination = this.destination;
          for (var i = 0; i < len; i++) {
              var iterator$$1 = iterators[i];
              if (typeof iterator$$1.hasValue === 'function' && !iterator$$1.hasValue()) {
                  return;
              }
          }
          var shouldComplete = false;
          var args = [];
          for (var i = 0; i < len; i++) {
              var iterator$$1 = iterators[i];
              var result = iterator$$1.next();
              if (iterator$$1.hasCompleted()) {
                  shouldComplete = true;
              }
              if (result.done) {
                  destination.complete();
                  return;
              }
              args.push(result.value);
          }
          if (this.resultSelector) {
              this._tryresultSelector(args);
          }
          else {
              destination.next(args);
          }
          if (shouldComplete) {
              destination.complete();
          }
      };
      ZipSubscriber.prototype._tryresultSelector = function (args) {
          var result;
          try {
              result = this.resultSelector.apply(this, args);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.next(result);
      };
      return ZipSubscriber;
  }(Subscriber));
  var StaticIterator = /*@__PURE__*/ (function () {
      function StaticIterator(iterator$$1) {
          this.iterator = iterator$$1;
          this.nextResult = iterator$$1.next();
      }
      StaticIterator.prototype.hasValue = function () {
          return true;
      };
      StaticIterator.prototype.next = function () {
          var result = this.nextResult;
          this.nextResult = this.iterator.next();
          return result;
      };
      StaticIterator.prototype.hasCompleted = function () {
          var nextResult = this.nextResult;
          return nextResult && nextResult.done;
      };
      return StaticIterator;
  }());
  var StaticArrayIterator = /*@__PURE__*/ (function () {
      function StaticArrayIterator(array) {
          this.array = array;
          this.index = 0;
          this.length = 0;
          this.length = array.length;
      }
      StaticArrayIterator.prototype[iterator] = function () {
          return this;
      };
      StaticArrayIterator.prototype.next = function (value) {
          var i = this.index++;
          var array = this.array;
          return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
      };
      StaticArrayIterator.prototype.hasValue = function () {
          return this.array.length > this.index;
      };
      StaticArrayIterator.prototype.hasCompleted = function () {
          return this.array.length === this.index;
      };
      return StaticArrayIterator;
  }());
  var ZipBufferIterator = /*@__PURE__*/ (function (_super) {
      __extends(ZipBufferIterator, _super);
      function ZipBufferIterator(destination, parent, observable) {
          var _this = _super.call(this, destination) || this;
          _this.parent = parent;
          _this.observable = observable;
          _this.stillUnsubscribed = true;
          _this.buffer = [];
          _this.isComplete = false;
          return _this;
      }
      ZipBufferIterator.prototype[iterator] = function () {
          return this;
      };
      ZipBufferIterator.prototype.next = function () {
          var buffer = this.buffer;
          if (buffer.length === 0 && this.isComplete) {
              return { value: null, done: true };
          }
          else {
              return { value: buffer.shift(), done: false };
          }
      };
      ZipBufferIterator.prototype.hasValue = function () {
          return this.buffer.length > 0;
      };
      ZipBufferIterator.prototype.hasCompleted = function () {
          return this.buffer.length === 0 && this.isComplete;
      };
      ZipBufferIterator.prototype.notifyComplete = function () {
          if (this.buffer.length > 0) {
              this.isComplete = true;
              this.parent.notifyInactive();
          }
          else {
              this.destination.complete();
          }
      };
      ZipBufferIterator.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.buffer.push(innerValue);
          this.parent.checkIterators();
      };
      ZipBufferIterator.prototype.subscribe = function (value, index) {
          return subscribeToResult(this, this.observable, this, index);
      };
      return ZipBufferIterator;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var AuditSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(AuditSubscriber, _super);
      function AuditSubscriber(destination, durationSelector) {
          var _this = _super.call(this, destination) || this;
          _this.durationSelector = durationSelector;
          _this.hasValue = false;
          return _this;
      }
      AuditSubscriber.prototype._next = function (value) {
          this.value = value;
          this.hasValue = true;
          if (!this.throttled) {
              var duration = tryCatch(this.durationSelector)(value);
              if (duration === errorObject) {
                  this.destination.error(errorObject.e);
              }
              else {
                  var innerSubscription = subscribeToResult(this, duration);
                  if (!innerSubscription || innerSubscription.closed) {
                      this.clearThrottle();
                  }
                  else {
                      this.add(this.throttled = innerSubscription);
                  }
              }
          }
      };
      AuditSubscriber.prototype.clearThrottle = function () {
          var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
          if (throttled) {
              this.remove(throttled);
              this.throttled = null;
              throttled.unsubscribe();
          }
          if (hasValue) {
              this.value = null;
              this.hasValue = false;
              this.destination.next(value);
          }
      };
      AuditSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
          this.clearThrottle();
      };
      AuditSubscriber.prototype.notifyComplete = function () {
          this.clearThrottle();
      };
      return AuditSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START _scheduler_async,_audit,_observable_timer PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var BufferSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(BufferSubscriber, _super);
      function BufferSubscriber(destination, closingNotifier) {
          var _this = _super.call(this, destination) || this;
          _this.buffer = [];
          _this.add(subscribeToResult(_this, closingNotifier));
          return _this;
      }
      BufferSubscriber.prototype._next = function (value) {
          this.buffer.push(value);
      };
      BufferSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          var buffer = this.buffer;
          this.buffer = [];
          this.destination.next(buffer);
      };
      return BufferSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var BufferCountSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(BufferCountSubscriber, _super);
      function BufferCountSubscriber(destination, bufferSize) {
          var _this = _super.call(this, destination) || this;
          _this.bufferSize = bufferSize;
          _this.buffer = [];
          return _this;
      }
      BufferCountSubscriber.prototype._next = function (value) {
          var buffer = this.buffer;
          buffer.push(value);
          if (buffer.length == this.bufferSize) {
              this.destination.next(buffer);
              this.buffer = [];
          }
      };
      BufferCountSubscriber.prototype._complete = function () {
          var buffer = this.buffer;
          if (buffer.length > 0) {
              this.destination.next(buffer);
          }
          _super.prototype._complete.call(this);
      };
      return BufferCountSubscriber;
  }(Subscriber));
  var BufferSkipCountSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(BufferSkipCountSubscriber, _super);
      function BufferSkipCountSubscriber(destination, bufferSize, startBufferEvery) {
          var _this = _super.call(this, destination) || this;
          _this.bufferSize = bufferSize;
          _this.startBufferEvery = startBufferEvery;
          _this.buffers = [];
          _this.count = 0;
          return _this;
      }
      BufferSkipCountSubscriber.prototype._next = function (value) {
          var _a = this, bufferSize = _a.bufferSize, startBufferEvery = _a.startBufferEvery, buffers = _a.buffers, count = _a.count;
          this.count++;
          if (count % startBufferEvery === 0) {
              buffers.push([]);
          }
          for (var i = buffers.length; i--;) {
              var buffer = buffers[i];
              buffer.push(value);
              if (buffer.length === bufferSize) {
                  buffers.splice(i, 1);
                  this.destination.next(buffer);
              }
          }
      };
      BufferSkipCountSubscriber.prototype._complete = function () {
          var _a = this, buffers = _a.buffers, destination = _a.destination;
          while (buffers.length > 0) {
              var buffer = buffers.shift();
              if (buffer.length > 0) {
                  destination.next(buffer);
              }
          }
          _super.prototype._complete.call(this);
      };
      return BufferSkipCountSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_scheduler_async,_Subscriber,_util_isScheduler PURE_IMPORTS_END */
  var Context = /*@__PURE__*/ (function () {
      function Context() {
          this.buffer = [];
      }
      return Context;
  }());
  var BufferTimeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(BufferTimeSubscriber, _super);
      function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.bufferTimeSpan = bufferTimeSpan;
          _this.bufferCreationInterval = bufferCreationInterval;
          _this.maxBufferSize = maxBufferSize;
          _this.scheduler = scheduler;
          _this.contexts = [];
          var context = _this.openContext();
          _this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
          if (_this.timespanOnly) {
              var timeSpanOnlyState = { subscriber: _this, context: context, bufferTimeSpan: bufferTimeSpan };
              _this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
          }
          else {
              var closeState = { subscriber: _this, context: context };
              var creationState = { bufferTimeSpan: bufferTimeSpan, bufferCreationInterval: bufferCreationInterval, subscriber: _this, scheduler: scheduler };
              _this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
              _this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
          }
          return _this;
      }
      BufferTimeSubscriber.prototype._next = function (value) {
          var contexts = this.contexts;
          var len = contexts.length;
          var filledBufferContext;
          for (var i = 0; i < len; i++) {
              var context_1 = contexts[i];
              var buffer = context_1.buffer;
              buffer.push(value);
              if (buffer.length == this.maxBufferSize) {
                  filledBufferContext = context_1;
              }
          }
          if (filledBufferContext) {
              this.onBufferFull(filledBufferContext);
          }
      };
      BufferTimeSubscriber.prototype._error = function (err) {
          this.contexts.length = 0;
          _super.prototype._error.call(this, err);
      };
      BufferTimeSubscriber.prototype._complete = function () {
          var _a = this, contexts = _a.contexts, destination = _a.destination;
          while (contexts.length > 0) {
              var context_2 = contexts.shift();
              destination.next(context_2.buffer);
          }
          _super.prototype._complete.call(this);
      };
      BufferTimeSubscriber.prototype._unsubscribe = function () {
          this.contexts = null;
      };
      BufferTimeSubscriber.prototype.onBufferFull = function (context) {
          this.closeContext(context);
          var closeAction = context.closeAction;
          closeAction.unsubscribe();
          this.remove(closeAction);
          if (!this.closed && this.timespanOnly) {
              context = this.openContext();
              var bufferTimeSpan = this.bufferTimeSpan;
              var timeSpanOnlyState = { subscriber: this, context: context, bufferTimeSpan: bufferTimeSpan };
              this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
          }
      };
      BufferTimeSubscriber.prototype.openContext = function () {
          var context = new Context();
          this.contexts.push(context);
          return context;
      };
      BufferTimeSubscriber.prototype.closeContext = function (context) {
          this.destination.next(context.buffer);
          var contexts = this.contexts;
          var spliceIndex = contexts ? contexts.indexOf(context) : -1;
          if (spliceIndex >= 0) {
              contexts.splice(contexts.indexOf(context), 1);
          }
      };
      return BufferTimeSubscriber;
  }(Subscriber));
  function dispatchBufferTimeSpanOnly(state) {
      var subscriber = state.subscriber;
      var prevContext = state.context;
      if (prevContext) {
          subscriber.closeContext(prevContext);
      }
      if (!subscriber.closed) {
          state.context = subscriber.openContext();
          state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
      }
  }
  function dispatchBufferCreation(state) {
      var bufferCreationInterval = state.bufferCreationInterval, bufferTimeSpan = state.bufferTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler;
      var context = subscriber.openContext();
      var action = this;
      if (!subscriber.closed) {
          subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber: subscriber, context: context }));
          action.schedule(state, bufferCreationInterval);
      }
  }
  function dispatchBufferClose(arg) {
      var subscriber = arg.subscriber, context = arg.context;
      subscriber.closeContext(context);
  }

  /** PURE_IMPORTS_START tslib,_Subscription,_util_subscribeToResult,_OuterSubscriber PURE_IMPORTS_END */
  var BufferToggleSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(BufferToggleSubscriber, _super);
      function BufferToggleSubscriber(destination, openings, closingSelector) {
          var _this = _super.call(this, destination) || this;
          _this.openings = openings;
          _this.closingSelector = closingSelector;
          _this.contexts = [];
          _this.add(subscribeToResult(_this, openings));
          return _this;
      }
      BufferToggleSubscriber.prototype._next = function (value) {
          var contexts = this.contexts;
          var len = contexts.length;
          for (var i = 0; i < len; i++) {
              contexts[i].buffer.push(value);
          }
      };
      BufferToggleSubscriber.prototype._error = function (err) {
          var contexts = this.contexts;
          while (contexts.length > 0) {
              var context_1 = contexts.shift();
              context_1.subscription.unsubscribe();
              context_1.buffer = null;
              context_1.subscription = null;
          }
          this.contexts = null;
          _super.prototype._error.call(this, err);
      };
      BufferToggleSubscriber.prototype._complete = function () {
          var contexts = this.contexts;
          while (contexts.length > 0) {
              var context_2 = contexts.shift();
              this.destination.next(context_2.buffer);
              context_2.subscription.unsubscribe();
              context_2.buffer = null;
              context_2.subscription = null;
          }
          this.contexts = null;
          _super.prototype._complete.call(this);
      };
      BufferToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
      };
      BufferToggleSubscriber.prototype.notifyComplete = function (innerSub) {
          this.closeBuffer(innerSub.context);
      };
      BufferToggleSubscriber.prototype.openBuffer = function (value) {
          try {
              var closingSelector = this.closingSelector;
              var closingNotifier = closingSelector.call(this, value);
              if (closingNotifier) {
                  this.trySubscribe(closingNotifier);
              }
          }
          catch (err) {
              this._error(err);
          }
      };
      BufferToggleSubscriber.prototype.closeBuffer = function (context) {
          var contexts = this.contexts;
          if (contexts && context) {
              var buffer = context.buffer, subscription = context.subscription;
              this.destination.next(buffer);
              contexts.splice(contexts.indexOf(context), 1);
              this.remove(subscription);
              subscription.unsubscribe();
          }
      };
      BufferToggleSubscriber.prototype.trySubscribe = function (closingNotifier) {
          var contexts = this.contexts;
          var buffer = [];
          var subscription = new Subscription();
          var context = { buffer: buffer, subscription: subscription };
          contexts.push(context);
          var innerSubscription = subscribeToResult(this, closingNotifier, context);
          if (!innerSubscription || innerSubscription.closed) {
              this.closeBuffer(context);
          }
          else {
              innerSubscription.context = context;
              this.add(innerSubscription);
              subscription.add(innerSubscription);
          }
      };
      return BufferToggleSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_Subscription,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var BufferWhenSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(BufferWhenSubscriber, _super);
      function BufferWhenSubscriber(destination, closingSelector) {
          var _this = _super.call(this, destination) || this;
          _this.closingSelector = closingSelector;
          _this.subscribing = false;
          _this.openBuffer();
          return _this;
      }
      BufferWhenSubscriber.prototype._next = function (value) {
          this.buffer.push(value);
      };
      BufferWhenSubscriber.prototype._complete = function () {
          var buffer = this.buffer;
          if (buffer) {
              this.destination.next(buffer);
          }
          _super.prototype._complete.call(this);
      };
      BufferWhenSubscriber.prototype._unsubscribe = function () {
          this.buffer = null;
          this.subscribing = false;
      };
      BufferWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.openBuffer();
      };
      BufferWhenSubscriber.prototype.notifyComplete = function () {
          if (this.subscribing) {
              this.complete();
          }
          else {
              this.openBuffer();
          }
      };
      BufferWhenSubscriber.prototype.openBuffer = function () {
          var closingSubscription = this.closingSubscription;
          if (closingSubscription) {
              this.remove(closingSubscription);
              closingSubscription.unsubscribe();
          }
          var buffer = this.buffer;
          if (this.buffer) {
              this.destination.next(buffer);
          }
          this.buffer = [];
          var closingNotifier = tryCatch(this.closingSelector)();
          if (closingNotifier === errorObject) {
              this.error(errorObject.e);
          }
          else {
              closingSubscription = new Subscription();
              this.closingSubscription = closingSubscription;
              this.add(closingSubscription);
              this.subscribing = true;
              closingSubscription.add(subscribeToResult(this, closingNotifier));
              this.subscribing = false;
          }
      };
      return BufferWhenSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var CatchSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(CatchSubscriber, _super);
      function CatchSubscriber(destination, selector, caught) {
          var _this = _super.call(this, destination) || this;
          _this.selector = selector;
          _this.caught = caught;
          return _this;
      }
      CatchSubscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              var result = void 0;
              try {
                  result = this.selector(err, this.caught);
              }
              catch (err2) {
                  _super.prototype.error.call(this, err2);
                  return;
              }
              this._unsubscribeAndRecycle();
              var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
              this.add(innerSubscriber);
              subscribeToResult(this, result, undefined, undefined, innerSubscriber);
          }
      };
      return CatchSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START _observable_combineLatest PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _util_isArray,_observable_combineLatest,_observable_from PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _observable_concat PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _mergeMap PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _concatMap PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var CountSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(CountSubscriber, _super);
      function CountSubscriber(destination, predicate, source) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.source = source;
          _this.count = 0;
          _this.index = 0;
          return _this;
      }
      CountSubscriber.prototype._next = function (value) {
          if (this.predicate) {
              this._tryPredicate(value);
          }
          else {
              this.count++;
          }
      };
      CountSubscriber.prototype._tryPredicate = function (value) {
          var result;
          try {
              result = this.predicate(value, this.index++, this.source);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          if (result) {
              this.count++;
          }
      };
      CountSubscriber.prototype._complete = function () {
          this.destination.next(this.count);
          this.destination.complete();
      };
      return CountSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var DebounceSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DebounceSubscriber, _super);
      function DebounceSubscriber(destination, durationSelector) {
          var _this = _super.call(this, destination) || this;
          _this.durationSelector = durationSelector;
          _this.hasValue = false;
          _this.durationSubscription = null;
          return _this;
      }
      DebounceSubscriber.prototype._next = function (value) {
          try {
              var result = this.durationSelector.call(this, value);
              if (result) {
                  this._tryNext(value, result);
              }
          }
          catch (err) {
              this.destination.error(err);
          }
      };
      DebounceSubscriber.prototype._complete = function () {
          this.emitValue();
          this.destination.complete();
      };
      DebounceSubscriber.prototype._tryNext = function (value, duration) {
          var subscription = this.durationSubscription;
          this.value = value;
          this.hasValue = true;
          if (subscription) {
              subscription.unsubscribe();
              this.remove(subscription);
          }
          subscription = subscribeToResult(this, duration);
          if (subscription && !subscription.closed) {
              this.add(this.durationSubscription = subscription);
          }
      };
      DebounceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.emitValue();
      };
      DebounceSubscriber.prototype.notifyComplete = function () {
          this.emitValue();
      };
      DebounceSubscriber.prototype.emitValue = function () {
          if (this.hasValue) {
              var value = this.value;
              var subscription = this.durationSubscription;
              if (subscription) {
                  this.durationSubscription = null;
                  subscription.unsubscribe();
                  this.remove(subscription);
              }
              this.value = null;
              this.hasValue = false;
              _super.prototype._next.call(this, value);
          }
      };
      return DebounceSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async PURE_IMPORTS_END */
  var DebounceTimeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DebounceTimeSubscriber, _super);
      function DebounceTimeSubscriber(destination, dueTime, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.dueTime = dueTime;
          _this.scheduler = scheduler;
          _this.debouncedSubscription = null;
          _this.lastValue = null;
          _this.hasValue = false;
          return _this;
      }
      DebounceTimeSubscriber.prototype._next = function (value) {
          this.clearDebounce();
          this.lastValue = value;
          this.hasValue = true;
          this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext$2, this.dueTime, this));
      };
      DebounceTimeSubscriber.prototype._complete = function () {
          this.debouncedNext();
          this.destination.complete();
      };
      DebounceTimeSubscriber.prototype.debouncedNext = function () {
          this.clearDebounce();
          if (this.hasValue) {
              var lastValue = this.lastValue;
              this.lastValue = null;
              this.hasValue = false;
              this.destination.next(lastValue);
          }
      };
      DebounceTimeSubscriber.prototype.clearDebounce = function () {
          var debouncedSubscription = this.debouncedSubscription;
          if (debouncedSubscription !== null) {
              this.remove(debouncedSubscription);
              debouncedSubscription.unsubscribe();
              this.debouncedSubscription = null;
          }
      };
      return DebounceTimeSubscriber;
  }(Subscriber));
  function dispatchNext$2(subscriber) {
      subscriber.debouncedNext();
  }

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var DefaultIfEmptySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DefaultIfEmptySubscriber, _super);
      function DefaultIfEmptySubscriber(destination, defaultValue) {
          var _this = _super.call(this, destination) || this;
          _this.defaultValue = defaultValue;
          _this.isEmpty = true;
          return _this;
      }
      DefaultIfEmptySubscriber.prototype._next = function (value) {
          this.isEmpty = false;
          this.destination.next(value);
      };
      DefaultIfEmptySubscriber.prototype._complete = function () {
          if (this.isEmpty) {
              this.destination.next(this.defaultValue);
          }
          this.destination.complete();
      };
      return DefaultIfEmptySubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_scheduler_async,_util_isDate,_Subscriber,_Notification PURE_IMPORTS_END */
  var DelaySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DelaySubscriber, _super);
      function DelaySubscriber(destination, delay, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.delay = delay;
          _this.scheduler = scheduler;
          _this.queue = [];
          _this.active = false;
          _this.errored = false;
          return _this;
      }
      DelaySubscriber.dispatch = function (state) {
          var source = state.source;
          var queue = source.queue;
          var scheduler = state.scheduler;
          var destination = state.destination;
          while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
              queue.shift().notification.observe(destination);
          }
          if (queue.length > 0) {
              var delay_1 = Math.max(0, queue[0].time - scheduler.now());
              this.schedule(state, delay_1);
          }
          else {
              this.unsubscribe();
              source.active = false;
          }
      };
      DelaySubscriber.prototype._schedule = function (scheduler) {
          this.active = true;
          var destination = this.destination;
          destination.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
              source: this, destination: this.destination, scheduler: scheduler
          }));
      };
      DelaySubscriber.prototype.scheduleNotification = function (notification) {
          if (this.errored === true) {
              return;
          }
          var scheduler = this.scheduler;
          var message = new DelayMessage(scheduler.now() + this.delay, notification);
          this.queue.push(message);
          if (this.active === false) {
              this._schedule(scheduler);
          }
      };
      DelaySubscriber.prototype._next = function (value) {
          this.scheduleNotification(Notification.createNext(value));
      };
      DelaySubscriber.prototype._error = function (err) {
          this.errored = true;
          this.queue = [];
          this.destination.error(err);
          this.unsubscribe();
      };
      DelaySubscriber.prototype._complete = function () {
          this.scheduleNotification(Notification.createComplete());
          this.unsubscribe();
      };
      return DelaySubscriber;
  }(Subscriber));
  var DelayMessage = /*@__PURE__*/ (function () {
      function DelayMessage(time, notification) {
          this.time = time;
          this.notification = notification;
      }
      return DelayMessage;
  }());

  /** PURE_IMPORTS_START tslib,_Subscriber,_Observable,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var DelayWhenSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DelayWhenSubscriber, _super);
      function DelayWhenSubscriber(destination, delayDurationSelector) {
          var _this = _super.call(this, destination) || this;
          _this.delayDurationSelector = delayDurationSelector;
          _this.completed = false;
          _this.delayNotifierSubscriptions = [];
          _this.index = 0;
          return _this;
      }
      DelayWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.destination.next(outerValue);
          this.removeSubscription(innerSub);
          this.tryComplete();
      };
      DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
          this._error(error);
      };
      DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
          var value = this.removeSubscription(innerSub);
          if (value) {
              this.destination.next(value);
          }
          this.tryComplete();
      };
      DelayWhenSubscriber.prototype._next = function (value) {
          var index = this.index++;
          try {
              var delayNotifier = this.delayDurationSelector(value, index);
              if (delayNotifier) {
                  this.tryDelay(delayNotifier, value);
              }
          }
          catch (err) {
              this.destination.error(err);
          }
      };
      DelayWhenSubscriber.prototype._complete = function () {
          this.completed = true;
          this.tryComplete();
          this.unsubscribe();
      };
      DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
          subscription.unsubscribe();
          var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
          if (subscriptionIdx !== -1) {
              this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
          }
          return subscription.outerValue;
      };
      DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
          var notifierSubscription = subscribeToResult(this, delayNotifier, value);
          if (notifierSubscription && !notifierSubscription.closed) {
              var destination = this.destination;
              destination.add(notifierSubscription);
              this.delayNotifierSubscriptions.push(notifierSubscription);
          }
      };
      DelayWhenSubscriber.prototype.tryComplete = function () {
          if (this.completed && this.delayNotifierSubscriptions.length === 0) {
              this.destination.complete();
          }
      };
      return DelayWhenSubscriber;
  }(OuterSubscriber));
  var SubscriptionDelayObservable = /*@__PURE__*/ (function (_super) {
      __extends(SubscriptionDelayObservable, _super);
      function SubscriptionDelayObservable(source, subscriptionDelay) {
          var _this = _super.call(this) || this;
          _this.source = source;
          _this.subscriptionDelay = subscriptionDelay;
          return _this;
      }
      SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
          this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
      };
      return SubscriptionDelayObservable;
  }(Observable));
  var SubscriptionDelaySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SubscriptionDelaySubscriber, _super);
      function SubscriptionDelaySubscriber(parent, source) {
          var _this = _super.call(this) || this;
          _this.parent = parent;
          _this.source = source;
          _this.sourceSubscribed = false;
          return _this;
      }
      SubscriptionDelaySubscriber.prototype._next = function (unused) {
          this.subscribeToSource();
      };
      SubscriptionDelaySubscriber.prototype._error = function (err) {
          this.unsubscribe();
          this.parent.error(err);
      };
      SubscriptionDelaySubscriber.prototype._complete = function () {
          this.unsubscribe();
          this.subscribeToSource();
      };
      SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
          if (!this.sourceSubscribed) {
              this.sourceSubscribed = true;
              this.unsubscribe();
              this.source.subscribe(this.parent);
          }
      };
      return SubscriptionDelaySubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var DeMaterializeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DeMaterializeSubscriber, _super);
      function DeMaterializeSubscriber(destination) {
          return _super.call(this, destination) || this;
      }
      DeMaterializeSubscriber.prototype._next = function (value) {
          value.observe(this.destination);
      };
      return DeMaterializeSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var DistinctSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DistinctSubscriber, _super);
      function DistinctSubscriber(destination, keySelector, flushes) {
          var _this = _super.call(this, destination) || this;
          _this.keySelector = keySelector;
          _this.values = new Set();
          if (flushes) {
              _this.add(subscribeToResult(_this, flushes));
          }
          return _this;
      }
      DistinctSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.values.clear();
      };
      DistinctSubscriber.prototype.notifyError = function (error, innerSub) {
          this._error(error);
      };
      DistinctSubscriber.prototype._next = function (value) {
          if (this.keySelector) {
              this._useKeySelector(value);
          }
          else {
              this._finalizeNext(value, value);
          }
      };
      DistinctSubscriber.prototype._useKeySelector = function (value) {
          var key;
          var destination = this.destination;
          try {
              key = this.keySelector(value);
          }
          catch (err) {
              destination.error(err);
              return;
          }
          this._finalizeNext(key, value);
      };
      DistinctSubscriber.prototype._finalizeNext = function (key, value) {
          var values = this.values;
          if (!values.has(key)) {
              values.add(key);
              this.destination.next(value);
          }
      };
      return DistinctSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_tryCatch,_util_errorObject PURE_IMPORTS_END */
  var DistinctUntilChangedSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DistinctUntilChangedSubscriber, _super);
      function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
          var _this = _super.call(this, destination) || this;
          _this.keySelector = keySelector;
          _this.hasKey = false;
          if (typeof compare === 'function') {
              _this.compare = compare;
          }
          return _this;
      }
      DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
          return x === y;
      };
      DistinctUntilChangedSubscriber.prototype._next = function (value) {
          var keySelector = this.keySelector;
          var key = value;
          if (keySelector) {
              key = tryCatch(this.keySelector)(value);
              if (key === errorObject) {
                  return this.destination.error(errorObject.e);
              }
          }
          var result = false;
          if (this.hasKey) {
              result = tryCatch(this.compare)(this.key, key);
              if (result === errorObject) {
                  return this.destination.error(errorObject.e);
              }
          }
          else {
              this.hasKey = true;
          }
          if (Boolean(result) === false) {
              this.key = key;
              this.destination.next(value);
          }
      };
      return DistinctUntilChangedSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _distinctUntilChanged PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var FilterSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(FilterSubscriber, _super);
      function FilterSubscriber(destination, predicate, thisArg) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.thisArg = thisArg;
          _this.count = 0;
          return _this;
      }
      FilterSubscriber.prototype._next = function (value) {
          var result;
          try {
              result = this.predicate.call(this.thisArg, value, this.count++);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          if (result) {
              this.destination.next(value);
          }
      };
      return FilterSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_noop,_util_isFunction PURE_IMPORTS_END */
  var TapSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(TapSubscriber, _super);
      function TapSubscriber(destination, observerOrNext, error, complete) {
          var _this = _super.call(this, destination) || this;
          _this._tapNext = noop;
          _this._tapError = noop;
          _this._tapComplete = noop;
          _this._tapError = error || noop;
          _this._tapComplete = complete || noop;
          if (isFunction(observerOrNext)) {
              _this._context = _this;
              _this._tapNext = observerOrNext;
          }
          else if (observerOrNext) {
              _this._context = observerOrNext;
              _this._tapNext = observerOrNext.next || noop;
              _this._tapError = observerOrNext.error || noop;
              _this._tapComplete = observerOrNext.complete || noop;
          }
          return _this;
      }
      TapSubscriber.prototype._next = function (value) {
          try {
              this._tapNext.call(this._context, value);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.next(value);
      };
      TapSubscriber.prototype._error = function (err) {
          try {
              this._tapError.call(this._context, err);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.error(err);
      };
      TapSubscriber.prototype._complete = function () {
          try {
              this._tapComplete.call(this._context);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          return this.destination.complete();
      };
      return TapSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _tap,_util_EmptyError PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError,_observable_empty PURE_IMPORTS_END */
  var TakeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(TakeSubscriber, _super);
      function TakeSubscriber(destination, total) {
          var _this = _super.call(this, destination) || this;
          _this.total = total;
          _this.count = 0;
          return _this;
      }
      TakeSubscriber.prototype._next = function (value) {
          var total = this.total;
          var count = ++this.count;
          if (count <= total) {
              this.destination.next(value);
              if (count === total) {
                  this.destination.complete();
                  this.unsubscribe();
              }
          }
      };
      return TakeSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _util_ArgumentOutOfRangeError,_filter,_throwIfEmpty,_defaultIfEmpty,_take PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _observable_fromArray,_observable_scalar,_observable_empty,_observable_concat,_util_isScheduler PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var EverySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(EverySubscriber, _super);
      function EverySubscriber(destination, predicate, thisArg, source) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.thisArg = thisArg;
          _this.source = source;
          _this.index = 0;
          _this.thisArg = thisArg || _this;
          return _this;
      }
      EverySubscriber.prototype.notifyComplete = function (everyValueMatch) {
          this.destination.next(everyValueMatch);
          this.destination.complete();
      };
      EverySubscriber.prototype._next = function (value) {
          var result = false;
          try {
              result = this.predicate.call(this.thisArg, value, this.index++, this.source);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          if (!result) {
              this.notifyComplete(false);
          }
      };
      EverySubscriber.prototype._complete = function () {
          this.notifyComplete(true);
      };
      return EverySubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var SwitchFirstSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SwitchFirstSubscriber, _super);
      function SwitchFirstSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.hasCompleted = false;
          _this.hasSubscription = false;
          return _this;
      }
      SwitchFirstSubscriber.prototype._next = function (value) {
          if (!this.hasSubscription) {
              this.hasSubscription = true;
              this.add(subscribeToResult(this, value));
          }
      };
      SwitchFirstSubscriber.prototype._complete = function () {
          this.hasCompleted = true;
          if (!this.hasSubscription) {
              this.destination.complete();
          }
      };
      SwitchFirstSubscriber.prototype.notifyComplete = function (innerSub) {
          this.remove(innerSub);
          this.hasSubscription = false;
          if (this.hasCompleted) {
              this.destination.complete();
          }
      };
      return SwitchFirstSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult,_map,_observable_from PURE_IMPORTS_END */
  var ExhaustMapSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ExhaustMapSubscriber, _super);
      function ExhaustMapSubscriber(destination, project) {
          var _this = _super.call(this, destination) || this;
          _this.project = project;
          _this.hasSubscription = false;
          _this.hasCompleted = false;
          _this.index = 0;
          return _this;
      }
      ExhaustMapSubscriber.prototype._next = function (value) {
          if (!this.hasSubscription) {
              this.tryNext(value);
          }
      };
      ExhaustMapSubscriber.prototype.tryNext = function (value) {
          var result;
          var index = this.index++;
          try {
              result = this.project(value, index);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.hasSubscription = true;
          this._innerSub(result, value, index);
      };
      ExhaustMapSubscriber.prototype._innerSub = function (result, value, index) {
          var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
          var destination = this.destination;
          destination.add(innerSubscriber);
          subscribeToResult(this, result, value, index, innerSubscriber);
      };
      ExhaustMapSubscriber.prototype._complete = function () {
          this.hasCompleted = true;
          if (!this.hasSubscription) {
              this.destination.complete();
          }
          this.unsubscribe();
      };
      ExhaustMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.destination.next(innerValue);
      };
      ExhaustMapSubscriber.prototype.notifyError = function (err) {
          this.destination.error(err);
      };
      ExhaustMapSubscriber.prototype.notifyComplete = function (innerSub) {
          var destination = this.destination;
          destination.remove(innerSub);
          this.hasSubscription = false;
          if (this.hasCompleted) {
              this.destination.complete();
          }
      };
      return ExhaustMapSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var ExpandSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ExpandSubscriber, _super);
      function ExpandSubscriber(destination, project, concurrent, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.project = project;
          _this.concurrent = concurrent;
          _this.scheduler = scheduler;
          _this.index = 0;
          _this.active = 0;
          _this.hasCompleted = false;
          if (concurrent < Number.POSITIVE_INFINITY) {
              _this.buffer = [];
          }
          return _this;
      }
      ExpandSubscriber.dispatch = function (arg) {
          var subscriber = arg.subscriber, result = arg.result, value = arg.value, index = arg.index;
          subscriber.subscribeToProjection(result, value, index);
      };
      ExpandSubscriber.prototype._next = function (value) {
          var destination = this.destination;
          if (destination.closed) {
              this._complete();
              return;
          }
          var index = this.index++;
          if (this.active < this.concurrent) {
              destination.next(value);
              var result = tryCatch(this.project)(value, index);
              if (result === errorObject) {
                  destination.error(errorObject.e);
              }
              else if (!this.scheduler) {
                  this.subscribeToProjection(result, value, index);
              }
              else {
                  var state = { subscriber: this, result: result, value: value, index: index };
                  var destination_1 = this.destination;
                  destination_1.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
              }
          }
          else {
              this.buffer.push(value);
          }
      };
      ExpandSubscriber.prototype.subscribeToProjection = function (result, value, index) {
          this.active++;
          var destination = this.destination;
          destination.add(subscribeToResult(this, result, value, index));
      };
      ExpandSubscriber.prototype._complete = function () {
          this.hasCompleted = true;
          if (this.hasCompleted && this.active === 0) {
              this.destination.complete();
          }
          this.unsubscribe();
      };
      ExpandSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this._next(innerValue);
      };
      ExpandSubscriber.prototype.notifyComplete = function (innerSub) {
          var buffer = this.buffer;
          var destination = this.destination;
          destination.remove(innerSub);
          this.active--;
          if (buffer && buffer.length > 0) {
              this._next(buffer.shift());
          }
          if (this.hasCompleted && this.active === 0) {
              this.destination.complete();
          }
      };
      return ExpandSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber,_Subscription PURE_IMPORTS_END */
  var FinallySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(FinallySubscriber, _super);
      function FinallySubscriber(destination, callback) {
          var _this = _super.call(this, destination) || this;
          _this.add(new Subscription(callback));
          return _this;
      }
      return FinallySubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var FindValueSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(FindValueSubscriber, _super);
      function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.source = source;
          _this.yieldIndex = yieldIndex;
          _this.thisArg = thisArg;
          _this.index = 0;
          return _this;
      }
      FindValueSubscriber.prototype.notifyComplete = function (value) {
          var destination = this.destination;
          destination.next(value);
          destination.complete();
          this.unsubscribe();
      };
      FindValueSubscriber.prototype._next = function (value) {
          var _a = this, predicate = _a.predicate, thisArg = _a.thisArg;
          var index = this.index++;
          try {
              var result = predicate.call(thisArg || this, value, index, this.source);
              if (result) {
                  this.notifyComplete(this.yieldIndex ? index : value);
              }
          }
          catch (err) {
              this.destination.error(err);
          }
      };
      FindValueSubscriber.prototype._complete = function () {
          this.notifyComplete(this.yieldIndex ? -1 : undefined);
      };
      return FindValueSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _operators_find PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _util_EmptyError,_filter,_take,_defaultIfEmpty,_throwIfEmpty,_util_identity PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var IgnoreElementsSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(IgnoreElementsSubscriber, _super);
      function IgnoreElementsSubscriber() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      IgnoreElementsSubscriber.prototype._next = function (unused) {
      };
      return IgnoreElementsSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var IsEmptySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(IsEmptySubscriber, _super);
      function IsEmptySubscriber(destination) {
          return _super.call(this, destination) || this;
      }
      IsEmptySubscriber.prototype.notifyComplete = function (isEmpty) {
          var destination = this.destination;
          destination.next(isEmpty);
          destination.complete();
      };
      IsEmptySubscriber.prototype._next = function (value) {
          this.notifyComplete(false);
      };
      IsEmptySubscriber.prototype._complete = function () {
          this.notifyComplete(true);
      };
      return IsEmptySubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError,_observable_empty PURE_IMPORTS_END */
  var TakeLastSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(TakeLastSubscriber, _super);
      function TakeLastSubscriber(destination, total) {
          var _this = _super.call(this, destination) || this;
          _this.total = total;
          _this.ring = new Array();
          _this.count = 0;
          return _this;
      }
      TakeLastSubscriber.prototype._next = function (value) {
          var ring = this.ring;
          var total = this.total;
          var count = this.count++;
          if (ring.length < total) {
              ring.push(value);
          }
          else {
              var index = count % total;
              ring[index] = value;
          }
      };
      TakeLastSubscriber.prototype._complete = function () {
          var destination = this.destination;
          var count = this.count;
          if (count > 0) {
              var total = this.count >= this.total ? this.total : this.count;
              var ring = this.ring;
              for (var i = 0; i < total; i++) {
                  var idx = (count++) % total;
                  destination.next(ring[idx]);
              }
          }
          destination.complete();
      };
      return TakeLastSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _util_EmptyError,_filter,_takeLast,_throwIfEmpty,_defaultIfEmpty,_util_identity PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var MapToSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(MapToSubscriber, _super);
      function MapToSubscriber(destination, value) {
          var _this = _super.call(this, destination) || this;
          _this.value = value;
          return _this;
      }
      MapToSubscriber.prototype._next = function (x) {
          this.destination.next(this.value);
      };
      return MapToSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */
  var MaterializeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(MaterializeSubscriber, _super);
      function MaterializeSubscriber(destination) {
          return _super.call(this, destination) || this;
      }
      MaterializeSubscriber.prototype._next = function (value) {
          this.destination.next(Notification.createNext(value));
      };
      MaterializeSubscriber.prototype._error = function (err) {
          var destination = this.destination;
          destination.next(Notification.createError(err));
          destination.complete();
      };
      MaterializeSubscriber.prototype._complete = function () {
          var destination = this.destination;
          destination.next(Notification.createComplete());
          destination.complete();
      };
      return MaterializeSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var ScanSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ScanSubscriber, _super);
      function ScanSubscriber(destination, accumulator, _seed, hasSeed) {
          var _this = _super.call(this, destination) || this;
          _this.accumulator = accumulator;
          _this._seed = _seed;
          _this.hasSeed = hasSeed;
          _this.index = 0;
          return _this;
      }
      Object.defineProperty(ScanSubscriber.prototype, "seed", {
          get: function () {
              return this._seed;
          },
          set: function (value) {
              this.hasSeed = true;
              this._seed = value;
          },
          enumerable: true,
          configurable: true
      });
      ScanSubscriber.prototype._next = function (value) {
          if (!this.hasSeed) {
              this.seed = value;
              this.destination.next(value);
          }
          else {
              return this._tryNext(value);
          }
      };
      ScanSubscriber.prototype._tryNext = function (value) {
          var index = this.index++;
          var result;
          try {
              result = this.accumulator(this.seed, value, index);
          }
          catch (err) {
              this.destination.error(err);
          }
          this.seed = result;
          this.destination.next(result);
      };
      return ScanSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _scan,_takeLast,_defaultIfEmpty,_util_pipe PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _observable_merge PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _mergeMap PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_util_tryCatch,_util_errorObject,_util_subscribeToResult,_OuterSubscriber,_InnerSubscriber PURE_IMPORTS_END */
  var MergeScanSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(MergeScanSubscriber, _super);
      function MergeScanSubscriber(destination, accumulator, acc, concurrent) {
          var _this = _super.call(this, destination) || this;
          _this.accumulator = accumulator;
          _this.acc = acc;
          _this.concurrent = concurrent;
          _this.hasValue = false;
          _this.hasCompleted = false;
          _this.buffer = [];
          _this.active = 0;
          _this.index = 0;
          return _this;
      }
      MergeScanSubscriber.prototype._next = function (value) {
          if (this.active < this.concurrent) {
              var index = this.index++;
              var ish = tryCatch(this.accumulator)(this.acc, value);
              var destination = this.destination;
              if (ish === errorObject) {
                  destination.error(errorObject.e);
              }
              else {
                  this.active++;
                  this._innerSub(ish, value, index);
              }
          }
          else {
              this.buffer.push(value);
          }
      };
      MergeScanSubscriber.prototype._innerSub = function (ish, value, index) {
          var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
          var destination = this.destination;
          destination.add(innerSubscriber);
          subscribeToResult(this, ish, value, index, innerSubscriber);
      };
      MergeScanSubscriber.prototype._complete = function () {
          this.hasCompleted = true;
          if (this.active === 0 && this.buffer.length === 0) {
              if (this.hasValue === false) {
                  this.destination.next(this.acc);
              }
              this.destination.complete();
          }
          this.unsubscribe();
      };
      MergeScanSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          var destination = this.destination;
          this.acc = innerValue;
          this.hasValue = true;
          destination.next(innerValue);
      };
      MergeScanSubscriber.prototype.notifyComplete = function (innerSub) {
          var buffer = this.buffer;
          var destination = this.destination;
          destination.remove(innerSub);
          this.active--;
          if (buffer.length > 0) {
              this._next(buffer.shift());
          }
          else if (this.active === 0 && this.hasCompleted) {
              if (this.hasValue === false) {
                  this.destination.next(this.acc);
              }
              this.destination.complete();
          }
      };
      return MergeScanSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _observable_ConnectableObservable PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_observable_from,_util_isArray,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var OnErrorResumeNextSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(OnErrorResumeNextSubscriber, _super);
      function OnErrorResumeNextSubscriber(destination, nextSources) {
          var _this = _super.call(this, destination) || this;
          _this.destination = destination;
          _this.nextSources = nextSources;
          return _this;
      }
      OnErrorResumeNextSubscriber.prototype.notifyError = function (error, innerSub) {
          this.subscribeToNextSource();
      };
      OnErrorResumeNextSubscriber.prototype.notifyComplete = function (innerSub) {
          this.subscribeToNextSource();
      };
      OnErrorResumeNextSubscriber.prototype._error = function (err) {
          this.subscribeToNextSource();
          this.unsubscribe();
      };
      OnErrorResumeNextSubscriber.prototype._complete = function () {
          this.subscribeToNextSource();
          this.unsubscribe();
      };
      OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function () {
          var next = this.nextSources.shift();
          if (next) {
              var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
              var destination = this.destination;
              destination.add(innerSubscriber);
              subscribeToResult(this, next, undefined, undefined, innerSubscriber);
          }
          else {
              this.destination.complete();
          }
      };
      return OnErrorResumeNextSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var PairwiseSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(PairwiseSubscriber, _super);
      function PairwiseSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.hasPrev = false;
          return _this;
      }
      PairwiseSubscriber.prototype._next = function (value) {
          if (this.hasPrev) {
              this.destination.next([this.prev, value]);
          }
          else {
              this.hasPrev = true;
          }
          this.prev = value;
      };
      return PairwiseSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _util_not,_filter PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _map PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _Subject,_multicast PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _BehaviorSubject,_multicast PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _AsyncSubject,_multicast PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _ReplaySubject,_multicast PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _util_isArray,_observable_race PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_Subscriber,_observable_empty PURE_IMPORTS_END */
  var RepeatSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(RepeatSubscriber, _super);
      function RepeatSubscriber(destination, count, source) {
          var _this = _super.call(this, destination) || this;
          _this.count = count;
          _this.source = source;
          return _this;
      }
      RepeatSubscriber.prototype.complete = function () {
          if (!this.isStopped) {
              var _a = this, source = _a.source, count = _a.count;
              if (count === 0) {
                  return _super.prototype.complete.call(this);
              }
              else if (count > -1) {
                  this.count = count - 1;
              }
              source.subscribe(this._unsubscribeAndRecycle());
          }
      };
      return RepeatSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subject,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var RepeatWhenSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(RepeatWhenSubscriber, _super);
      function RepeatWhenSubscriber(destination, notifier, source) {
          var _this = _super.call(this, destination) || this;
          _this.notifier = notifier;
          _this.source = source;
          _this.sourceIsBeingSubscribedTo = true;
          return _this;
      }
      RepeatWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.sourceIsBeingSubscribedTo = true;
          this.source.subscribe(this);
      };
      RepeatWhenSubscriber.prototype.notifyComplete = function (innerSub) {
          if (this.sourceIsBeingSubscribedTo === false) {
              return _super.prototype.complete.call(this);
          }
      };
      RepeatWhenSubscriber.prototype.complete = function () {
          this.sourceIsBeingSubscribedTo = false;
          if (!this.isStopped) {
              if (!this.retries) {
                  this.subscribeToRetries();
              }
              if (!this.retriesSubscription || this.retriesSubscription.closed) {
                  return _super.prototype.complete.call(this);
              }
              this._unsubscribeAndRecycle();
              this.notifications.next();
          }
      };
      RepeatWhenSubscriber.prototype._unsubscribe = function () {
          var _a = this, notifications = _a.notifications, retriesSubscription = _a.retriesSubscription;
          if (notifications) {
              notifications.unsubscribe();
              this.notifications = null;
          }
          if (retriesSubscription) {
              retriesSubscription.unsubscribe();
              this.retriesSubscription = null;
          }
          this.retries = null;
      };
      RepeatWhenSubscriber.prototype._unsubscribeAndRecycle = function () {
          var _unsubscribe = this._unsubscribe;
          this._unsubscribe = null;
          _super.prototype._unsubscribeAndRecycle.call(this);
          this._unsubscribe = _unsubscribe;
          return this;
      };
      RepeatWhenSubscriber.prototype.subscribeToRetries = function () {
          this.notifications = new Subject();
          var retries = tryCatch(this.notifier)(this.notifications);
          if (retries === errorObject) {
              return _super.prototype.complete.call(this);
          }
          this.retries = retries;
          this.retriesSubscription = subscribeToResult(this, retries);
      };
      return RepeatWhenSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var RetrySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(RetrySubscriber, _super);
      function RetrySubscriber(destination, count, source) {
          var _this = _super.call(this, destination) || this;
          _this.count = count;
          _this.source = source;
          return _this;
      }
      RetrySubscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              var _a = this, source = _a.source, count = _a.count;
              if (count === 0) {
                  return _super.prototype.error.call(this, err);
              }
              else if (count > -1) {
                  this.count = count - 1;
              }
              source.subscribe(this._unsubscribeAndRecycle());
          }
      };
      return RetrySubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subject,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var RetryWhenSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(RetryWhenSubscriber, _super);
      function RetryWhenSubscriber(destination, notifier, source) {
          var _this = _super.call(this, destination) || this;
          _this.notifier = notifier;
          _this.source = source;
          return _this;
      }
      RetryWhenSubscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              var errors = this.errors;
              var retries = this.retries;
              var retriesSubscription = this.retriesSubscription;
              if (!retries) {
                  errors = new Subject();
                  retries = tryCatch(this.notifier)(errors);
                  if (retries === errorObject) {
                      return _super.prototype.error.call(this, errorObject.e);
                  }
                  retriesSubscription = subscribeToResult(this, retries);
              }
              else {
                  this.errors = null;
                  this.retriesSubscription = null;
              }
              this._unsubscribeAndRecycle();
              this.errors = errors;
              this.retries = retries;
              this.retriesSubscription = retriesSubscription;
              errors.next(err);
          }
      };
      RetryWhenSubscriber.prototype._unsubscribe = function () {
          var _a = this, errors = _a.errors, retriesSubscription = _a.retriesSubscription;
          if (errors) {
              errors.unsubscribe();
              this.errors = null;
          }
          if (retriesSubscription) {
              retriesSubscription.unsubscribe();
              this.retriesSubscription = null;
          }
          this.retries = null;
      };
      RetryWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          var _unsubscribe = this._unsubscribe;
          this._unsubscribe = null;
          this._unsubscribeAndRecycle();
          this._unsubscribe = _unsubscribe;
          this.source.subscribe(this);
      };
      return RetryWhenSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var SampleSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SampleSubscriber, _super);
      function SampleSubscriber() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.hasValue = false;
          return _this;
      }
      SampleSubscriber.prototype._next = function (value) {
          this.value = value;
          this.hasValue = true;
      };
      SampleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.emitValue();
      };
      SampleSubscriber.prototype.notifyComplete = function () {
          this.emitValue();
      };
      SampleSubscriber.prototype.emitValue = function () {
          if (this.hasValue) {
              this.hasValue = false;
              this.destination.next(this.value);
          }
      };
      return SampleSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async PURE_IMPORTS_END */
  var SampleTimeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SampleTimeSubscriber, _super);
      function SampleTimeSubscriber(destination, period, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.period = period;
          _this.scheduler = scheduler;
          _this.hasValue = false;
          _this.add(scheduler.schedule(dispatchNotification, period, { subscriber: _this, period: period }));
          return _this;
      }
      SampleTimeSubscriber.prototype._next = function (value) {
          this.lastValue = value;
          this.hasValue = true;
      };
      SampleTimeSubscriber.prototype.notifyNext = function () {
          if (this.hasValue) {
              this.hasValue = false;
              this.destination.next(this.lastValue);
          }
      };
      return SampleTimeSubscriber;
  }(Subscriber));
  function dispatchNotification(state) {
      var subscriber = state.subscriber, period = state.period;
      subscriber.notifyNext();
      this.schedule(state, period);
  }

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_tryCatch,_util_errorObject PURE_IMPORTS_END */
  var SequenceEqualSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SequenceEqualSubscriber, _super);
      function SequenceEqualSubscriber(destination, compareTo, comparor) {
          var _this = _super.call(this, destination) || this;
          _this.compareTo = compareTo;
          _this.comparor = comparor;
          _this._a = [];
          _this._b = [];
          _this._oneComplete = false;
          _this.destination.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, _this)));
          return _this;
      }
      SequenceEqualSubscriber.prototype._next = function (value) {
          if (this._oneComplete && this._b.length === 0) {
              this.emit(false);
          }
          else {
              this._a.push(value);
              this.checkValues();
          }
      };
      SequenceEqualSubscriber.prototype._complete = function () {
          if (this._oneComplete) {
              this.emit(this._a.length === 0 && this._b.length === 0);
          }
          else {
              this._oneComplete = true;
          }
          this.unsubscribe();
      };
      SequenceEqualSubscriber.prototype.checkValues = function () {
          var _c = this, _a = _c._a, _b = _c._b, comparor = _c.comparor;
          while (_a.length > 0 && _b.length > 0) {
              var a = _a.shift();
              var b = _b.shift();
              var areEqual = false;
              if (comparor) {
                  areEqual = tryCatch(comparor)(a, b);
                  if (areEqual === errorObject) {
                      this.destination.error(errorObject.e);
                  }
              }
              else {
                  areEqual = a === b;
              }
              if (!areEqual) {
                  this.emit(false);
              }
          }
      };
      SequenceEqualSubscriber.prototype.emit = function (value) {
          var destination = this.destination;
          destination.next(value);
          destination.complete();
      };
      SequenceEqualSubscriber.prototype.nextB = function (value) {
          if (this._oneComplete && this._a.length === 0) {
              this.emit(false);
          }
          else {
              this._b.push(value);
              this.checkValues();
          }
      };
      SequenceEqualSubscriber.prototype.completeB = function () {
          if (this._oneComplete) {
              this.emit(this._a.length === 0 && this._b.length === 0);
          }
          else {
              this._oneComplete = true;
          }
      };
      return SequenceEqualSubscriber;
  }(Subscriber));
  var SequenceEqualCompareToSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SequenceEqualCompareToSubscriber, _super);
      function SequenceEqualCompareToSubscriber(destination, parent) {
          var _this = _super.call(this, destination) || this;
          _this.parent = parent;
          return _this;
      }
      SequenceEqualCompareToSubscriber.prototype._next = function (value) {
          this.parent.nextB(value);
      };
      SequenceEqualCompareToSubscriber.prototype._error = function (err) {
          this.parent.error(err);
          this.unsubscribe();
      };
      SequenceEqualCompareToSubscriber.prototype._complete = function () {
          this.parent.completeB();
          this.unsubscribe();
      };
      return SequenceEqualCompareToSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _multicast,_refCount,_Subject PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _ReplaySubject PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_EmptyError PURE_IMPORTS_END */
  var SingleSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SingleSubscriber, _super);
      function SingleSubscriber(destination, predicate, source) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.source = source;
          _this.seenValue = false;
          _this.index = 0;
          return _this;
      }
      SingleSubscriber.prototype.applySingleValue = function (value) {
          if (this.seenValue) {
              this.destination.error('Sequence contains more than one element');
          }
          else {
              this.seenValue = true;
              this.singleValue = value;
          }
      };
      SingleSubscriber.prototype._next = function (value) {
          var index = this.index++;
          if (this.predicate) {
              this.tryNext(value, index);
          }
          else {
              this.applySingleValue(value);
          }
      };
      SingleSubscriber.prototype.tryNext = function (value, index) {
          try {
              if (this.predicate(value, index, this.source)) {
                  this.applySingleValue(value);
              }
          }
          catch (err) {
              this.destination.error(err);
          }
      };
      SingleSubscriber.prototype._complete = function () {
          var destination = this.destination;
          if (this.index > 0) {
              destination.next(this.seenValue ? this.singleValue : undefined);
              destination.complete();
          }
          else {
              destination.error(new EmptyError);
          }
      };
      return SingleSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var SkipSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SkipSubscriber, _super);
      function SkipSubscriber(destination, total) {
          var _this = _super.call(this, destination) || this;
          _this.total = total;
          _this.count = 0;
          return _this;
      }
      SkipSubscriber.prototype._next = function (x) {
          if (++this.count > this.total) {
              this.destination.next(x);
          }
      };
      return SkipSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError PURE_IMPORTS_END */
  var SkipLastSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SkipLastSubscriber, _super);
      function SkipLastSubscriber(destination, _skipCount) {
          var _this = _super.call(this, destination) || this;
          _this._skipCount = _skipCount;
          _this._count = 0;
          _this._ring = new Array(_skipCount);
          return _this;
      }
      SkipLastSubscriber.prototype._next = function (value) {
          var skipCount = this._skipCount;
          var count = this._count++;
          if (count < skipCount) {
              this._ring[count] = value;
          }
          else {
              var currentIndex = count % skipCount;
              var ring = this._ring;
              var oldValue = ring[currentIndex];
              ring[currentIndex] = value;
              this.destination.next(oldValue);
          }
      };
      return SkipLastSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var SkipUntilSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SkipUntilSubscriber, _super);
      function SkipUntilSubscriber(destination, notifier) {
          var _this = _super.call(this, destination) || this;
          _this.hasValue = false;
          var innerSubscriber = new InnerSubscriber(_this, undefined, undefined);
          _this.add(innerSubscriber);
          _this.innerSubscription = innerSubscriber;
          subscribeToResult(_this, notifier, undefined, undefined, innerSubscriber);
          return _this;
      }
      SkipUntilSubscriber.prototype._next = function (value) {
          if (this.hasValue) {
              _super.prototype._next.call(this, value);
          }
      };
      SkipUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.hasValue = true;
          if (this.innerSubscription) {
              this.innerSubscription.unsubscribe();
          }
      };
      SkipUntilSubscriber.prototype.notifyComplete = function () {
      };
      return SkipUntilSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var SkipWhileSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SkipWhileSubscriber, _super);
      function SkipWhileSubscriber(destination, predicate) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.skipping = true;
          _this.index = 0;
          return _this;
      }
      SkipWhileSubscriber.prototype._next = function (value) {
          var destination = this.destination;
          if (this.skipping) {
              this.tryCallPredicate(value);
          }
          if (!this.skipping) {
              destination.next(value);
          }
      };
      SkipWhileSubscriber.prototype.tryCallPredicate = function (value) {
          try {
              var result = this.predicate(value, this.index++);
              this.skipping = Boolean(result);
          }
          catch (err) {
              this.destination.error(err);
          }
      };
      return SkipWhileSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _observable_fromArray,_observable_scalar,_observable_empty,_observable_concat,_util_isScheduler PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_Observable,_scheduler_asap,_util_isNumeric PURE_IMPORTS_END */
  var SubscribeOnObservable = /*@__PURE__*/ (function (_super) {
      __extends(SubscribeOnObservable, _super);
      function SubscribeOnObservable(source, delayTime, scheduler) {
          if (delayTime === void 0) {
              delayTime = 0;
          }
          if (scheduler === void 0) {
              scheduler = asap;
          }
          var _this = _super.call(this) || this;
          _this.source = source;
          _this.delayTime = delayTime;
          _this.scheduler = scheduler;
          if (!isNumeric(delayTime) || delayTime < 0) {
              _this.delayTime = 0;
          }
          if (!scheduler || typeof scheduler.schedule !== 'function') {
              _this.scheduler = asap;
          }
          return _this;
      }
      SubscribeOnObservable.create = function (source, delay, scheduler) {
          if (delay === void 0) {
              delay = 0;
          }
          if (scheduler === void 0) {
              scheduler = asap;
          }
          return new SubscribeOnObservable(source, delay, scheduler);
      };
      SubscribeOnObservable.dispatch = function (arg) {
          var source = arg.source, subscriber = arg.subscriber;
          return this.add(source.subscribe(subscriber));
      };
      SubscribeOnObservable.prototype._subscribe = function (subscriber) {
          var delay = this.delayTime;
          var source = this.source;
          var scheduler = this.scheduler;
          return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
              source: source, subscriber: subscriber
          });
      };
      return SubscribeOnObservable;
  }(Observable));

  /** PURE_IMPORTS_START _observable_SubscribeOnObservable PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult,_map,_observable_from PURE_IMPORTS_END */
  var SwitchMapSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SwitchMapSubscriber, _super);
      function SwitchMapSubscriber(destination, project) {
          var _this = _super.call(this, destination) || this;
          _this.project = project;
          _this.index = 0;
          return _this;
      }
      SwitchMapSubscriber.prototype._next = function (value) {
          var result;
          var index = this.index++;
          try {
              result = this.project(value, index);
          }
          catch (error) {
              this.destination.error(error);
              return;
          }
          this._innerSub(result, value, index);
      };
      SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
          var innerSubscription = this.innerSubscription;
          if (innerSubscription) {
              innerSubscription.unsubscribe();
          }
          var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
          var destination = this.destination;
          destination.add(innerSubscriber);
          this.innerSubscription = subscribeToResult(this, result, value, index, innerSubscriber);
      };
      SwitchMapSubscriber.prototype._complete = function () {
          var innerSubscription = this.innerSubscription;
          if (!innerSubscription || innerSubscription.closed) {
              _super.prototype._complete.call(this);
          }
          this.unsubscribe();
      };
      SwitchMapSubscriber.prototype._unsubscribe = function () {
          this.innerSubscription = null;
      };
      SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
          var destination = this.destination;
          destination.remove(innerSub);
          this.innerSubscription = null;
          if (this.isStopped) {
              _super.prototype._complete.call(this);
          }
      };
      SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.destination.next(innerValue);
      };
      return SwitchMapSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START _switchMap,_util_identity PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _switchMap PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var TakeUntilSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(TakeUntilSubscriber, _super);
      function TakeUntilSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.seenValue = false;
          return _this;
      }
      TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.seenValue = true;
          this.complete();
      };
      TakeUntilSubscriber.prototype.notifyComplete = function () {
      };
      return TakeUntilSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var TakeWhileSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(TakeWhileSubscriber, _super);
      function TakeWhileSubscriber(destination, predicate) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.index = 0;
          return _this;
      }
      TakeWhileSubscriber.prototype._next = function (value) {
          var destination = this.destination;
          var result;
          try {
              result = this.predicate(value, this.index++);
          }
          catch (err) {
              destination.error(err);
              return;
          }
          this.nextOrComplete(value, result);
      };
      TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
          var destination = this.destination;
          if (Boolean(predicateResult)) {
              destination.next(value);
          }
          else {
              destination.complete();
          }
      };
      return TakeWhileSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var ThrottleSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ThrottleSubscriber, _super);
      function ThrottleSubscriber(destination, durationSelector, _leading, _trailing) {
          var _this = _super.call(this, destination) || this;
          _this.destination = destination;
          _this.durationSelector = durationSelector;
          _this._leading = _leading;
          _this._trailing = _trailing;
          _this._hasValue = false;
          return _this;
      }
      ThrottleSubscriber.prototype._next = function (value) {
          this._hasValue = true;
          this._sendValue = value;
          if (!this._throttled) {
              if (this._leading) {
                  this.send();
              }
              else {
                  this.throttle(value);
              }
          }
      };
      ThrottleSubscriber.prototype.send = function () {
          var _a = this, _hasValue = _a._hasValue, _sendValue = _a._sendValue;
          if (_hasValue) {
              this.destination.next(_sendValue);
              this.throttle(_sendValue);
          }
          this._hasValue = false;
          this._sendValue = null;
      };
      ThrottleSubscriber.prototype.throttle = function (value) {
          var duration = this.tryDurationSelector(value);
          if (duration) {
              this.add(this._throttled = subscribeToResult(this, duration));
          }
      };
      ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
          try {
              return this.durationSelector(value);
          }
          catch (err) {
              this.destination.error(err);
              return null;
          }
      };
      ThrottleSubscriber.prototype.throttlingDone = function () {
          var _a = this, _throttled = _a._throttled, _trailing = _a._trailing;
          if (_throttled) {
              _throttled.unsubscribe();
          }
          this._throttled = null;
          if (_trailing) {
              this.send();
          }
      };
      ThrottleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.throttlingDone();
      };
      ThrottleSubscriber.prototype.notifyComplete = function () {
          this.throttlingDone();
      };
      return ThrottleSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async,_throttle PURE_IMPORTS_END */
  var ThrottleTimeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ThrottleTimeSubscriber, _super);
      function ThrottleTimeSubscriber(destination, duration, scheduler, leading, trailing) {
          var _this = _super.call(this, destination) || this;
          _this.duration = duration;
          _this.scheduler = scheduler;
          _this.leading = leading;
          _this.trailing = trailing;
          _this._hasTrailingValue = false;
          _this._trailingValue = null;
          return _this;
      }
      ThrottleTimeSubscriber.prototype._next = function (value) {
          if (this.throttled) {
              if (this.trailing) {
                  this._trailingValue = value;
                  this._hasTrailingValue = true;
              }
          }
          else {
              this.add(this.throttled = this.scheduler.schedule(dispatchNext$3, this.duration, { subscriber: this }));
              if (this.leading) {
                  this.destination.next(value);
              }
          }
      };
      ThrottleTimeSubscriber.prototype._complete = function () {
          if (this._hasTrailingValue) {
              this.destination.next(this._trailingValue);
              this.destination.complete();
          }
          else {
              this.destination.complete();
          }
      };
      ThrottleTimeSubscriber.prototype.clearThrottle = function () {
          var throttled = this.throttled;
          if (throttled) {
              if (this.trailing && this._hasTrailingValue) {
                  this.destination.next(this._trailingValue);
                  this._trailingValue = null;
                  this._hasTrailingValue = false;
              }
              throttled.unsubscribe();
              this.remove(throttled);
              this.throttled = null;
          }
      };
      return ThrottleTimeSubscriber;
  }(Subscriber));
  function dispatchNext$3(arg) {
      var subscriber = arg.subscriber;
      subscriber.clearThrottle();
  }

  /** PURE_IMPORTS_START _scheduler_async,_scan,_observable_defer,_map PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_scheduler_async,_util_isDate,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var TimeoutWithSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(TimeoutWithSubscriber, _super);
      function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.absoluteTimeout = absoluteTimeout;
          _this.waitFor = waitFor;
          _this.withObservable = withObservable;
          _this.scheduler = scheduler;
          _this.action = null;
          _this.scheduleTimeout();
          return _this;
      }
      TimeoutWithSubscriber.dispatchTimeout = function (subscriber) {
          var withObservable = subscriber.withObservable;
          subscriber._unsubscribeAndRecycle();
          subscriber.add(subscribeToResult(subscriber, withObservable));
      };
      TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
          var action = this.action;
          if (action) {
              this.action = action.schedule(this, this.waitFor);
          }
          else {
              this.add(this.action = this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, this));
          }
      };
      TimeoutWithSubscriber.prototype._next = function (value) {
          if (!this.absoluteTimeout) {
              this.scheduleTimeout();
          }
          _super.prototype._next.call(this, value);
      };
      TimeoutWithSubscriber.prototype._unsubscribe = function () {
          this.action = null;
          this.scheduler = null;
          this.withObservable = null;
      };
      return TimeoutWithSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START _scheduler_async,_util_TimeoutError,_timeoutWith,_observable_throwError PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _scheduler_async,_map PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */

  /** PURE_IMPORTS_START tslib,_Subject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var WindowSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(WindowSubscriber, _super);
      function WindowSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.window = new Subject();
          destination.next(_this.window);
          return _this;
      }
      WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.openWindow();
      };
      WindowSubscriber.prototype.notifyError = function (error, innerSub) {
          this._error(error);
      };
      WindowSubscriber.prototype.notifyComplete = function (innerSub) {
          this._complete();
      };
      WindowSubscriber.prototype._next = function (value) {
          this.window.next(value);
      };
      WindowSubscriber.prototype._error = function (err) {
          this.window.error(err);
          this.destination.error(err);
      };
      WindowSubscriber.prototype._complete = function () {
          this.window.complete();
          this.destination.complete();
      };
      WindowSubscriber.prototype._unsubscribe = function () {
          this.window = null;
      };
      WindowSubscriber.prototype.openWindow = function () {
          var prevWindow = this.window;
          if (prevWindow) {
              prevWindow.complete();
          }
          var destination = this.destination;
          var newWindow = this.window = new Subject();
          destination.next(newWindow);
      };
      return WindowSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_Subscriber,_Subject PURE_IMPORTS_END */
  var WindowCountSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(WindowCountSubscriber, _super);
      function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
          var _this = _super.call(this, destination) || this;
          _this.destination = destination;
          _this.windowSize = windowSize;
          _this.startWindowEvery = startWindowEvery;
          _this.windows = [new Subject()];
          _this.count = 0;
          destination.next(_this.windows[0]);
          return _this;
      }
      WindowCountSubscriber.prototype._next = function (value) {
          var startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
          var destination = this.destination;
          var windowSize = this.windowSize;
          var windows = this.windows;
          var len = windows.length;
          for (var i = 0; i < len && !this.closed; i++) {
              windows[i].next(value);
          }
          var c = this.count - windowSize + 1;
          if (c >= 0 && c % startWindowEvery === 0 && !this.closed) {
              windows.shift().complete();
          }
          if (++this.count % startWindowEvery === 0 && !this.closed) {
              var window_1 = new Subject();
              windows.push(window_1);
              destination.next(window_1);
          }
      };
      WindowCountSubscriber.prototype._error = function (err) {
          var windows = this.windows;
          if (windows) {
              while (windows.length > 0 && !this.closed) {
                  windows.shift().error(err);
              }
          }
          this.destination.error(err);
      };
      WindowCountSubscriber.prototype._complete = function () {
          var windows = this.windows;
          if (windows) {
              while (windows.length > 0 && !this.closed) {
                  windows.shift().complete();
              }
          }
          this.destination.complete();
      };
      WindowCountSubscriber.prototype._unsubscribe = function () {
          this.count = 0;
          this.windows = null;
      };
      return WindowCountSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subject,_scheduler_async,_Subscriber,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */
  var CountedSubject = /*@__PURE__*/ (function (_super) {
      __extends(CountedSubject, _super);
      function CountedSubject() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._numberOfNextedValues = 0;
          return _this;
      }
      CountedSubject.prototype.next = function (value) {
          this._numberOfNextedValues++;
          _super.prototype.next.call(this, value);
      };
      Object.defineProperty(CountedSubject.prototype, "numberOfNextedValues", {
          get: function () {
              return this._numberOfNextedValues;
          },
          enumerable: true,
          configurable: true
      });
      return CountedSubject;
  }(Subject));
  var WindowTimeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(WindowTimeSubscriber, _super);
      function WindowTimeSubscriber(destination, windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.destination = destination;
          _this.windowTimeSpan = windowTimeSpan;
          _this.windowCreationInterval = windowCreationInterval;
          _this.maxWindowSize = maxWindowSize;
          _this.scheduler = scheduler;
          _this.windows = [];
          var window = _this.openWindow();
          if (windowCreationInterval !== null && windowCreationInterval >= 0) {
              var closeState = { subscriber: _this, window: window, context: null };
              var creationState = { windowTimeSpan: windowTimeSpan, windowCreationInterval: windowCreationInterval, subscriber: _this, scheduler: scheduler };
              _this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
              _this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
          }
          else {
              var timeSpanOnlyState = { subscriber: _this, window: window, windowTimeSpan: windowTimeSpan };
              _this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
          }
          return _this;
      }
      WindowTimeSubscriber.prototype._next = function (value) {
          var windows = this.windows;
          var len = windows.length;
          for (var i = 0; i < len; i++) {
              var window_1 = windows[i];
              if (!window_1.closed) {
                  window_1.next(value);
                  if (window_1.numberOfNextedValues >= this.maxWindowSize) {
                      this.closeWindow(window_1);
                  }
              }
          }
      };
      WindowTimeSubscriber.prototype._error = function (err) {
          var windows = this.windows;
          while (windows.length > 0) {
              windows.shift().error(err);
          }
          this.destination.error(err);
      };
      WindowTimeSubscriber.prototype._complete = function () {
          var windows = this.windows;
          while (windows.length > 0) {
              var window_2 = windows.shift();
              if (!window_2.closed) {
                  window_2.complete();
              }
          }
          this.destination.complete();
      };
      WindowTimeSubscriber.prototype.openWindow = function () {
          var window = new CountedSubject();
          this.windows.push(window);
          var destination = this.destination;
          destination.next(window);
          return window;
      };
      WindowTimeSubscriber.prototype.closeWindow = function (window) {
          window.complete();
          var windows = this.windows;
          windows.splice(windows.indexOf(window), 1);
      };
      return WindowTimeSubscriber;
  }(Subscriber));
  function dispatchWindowTimeSpanOnly(state) {
      var subscriber = state.subscriber, windowTimeSpan = state.windowTimeSpan, window = state.window;
      if (window) {
          subscriber.closeWindow(window);
      }
      state.window = subscriber.openWindow();
      this.schedule(state, windowTimeSpan);
  }
  function dispatchWindowCreation(state) {
      var windowTimeSpan = state.windowTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler, windowCreationInterval = state.windowCreationInterval;
      var window = subscriber.openWindow();
      var action = this;
      var context = { action: action, subscription: null };
      var timeSpanState = { subscriber: subscriber, window: window, context: context };
      context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
      action.add(context.subscription);
      action.schedule(state, windowCreationInterval);
  }
  function dispatchWindowClose(state) {
      var subscriber = state.subscriber, window = state.window, context = state.context;
      if (context && context.action && context.subscription) {
          context.action.remove(context.subscription);
      }
      subscriber.closeWindow(window);
  }

  /** PURE_IMPORTS_START tslib,_Subject,_Subscription,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var WindowToggleSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(WindowToggleSubscriber, _super);
      function WindowToggleSubscriber(destination, openings, closingSelector) {
          var _this = _super.call(this, destination) || this;
          _this.openings = openings;
          _this.closingSelector = closingSelector;
          _this.contexts = [];
          _this.add(_this.openSubscription = subscribeToResult(_this, openings, openings));
          return _this;
      }
      WindowToggleSubscriber.prototype._next = function (value) {
          var contexts = this.contexts;
          if (contexts) {
              var len = contexts.length;
              for (var i = 0; i < len; i++) {
                  contexts[i].window.next(value);
              }
          }
      };
      WindowToggleSubscriber.prototype._error = function (err) {
          var contexts = this.contexts;
          this.contexts = null;
          if (contexts) {
              var len = contexts.length;
              var index = -1;
              while (++index < len) {
                  var context_1 = contexts[index];
                  context_1.window.error(err);
                  context_1.subscription.unsubscribe();
              }
          }
          _super.prototype._error.call(this, err);
      };
      WindowToggleSubscriber.prototype._complete = function () {
          var contexts = this.contexts;
          this.contexts = null;
          if (contexts) {
              var len = contexts.length;
              var index = -1;
              while (++index < len) {
                  var context_2 = contexts[index];
                  context_2.window.complete();
                  context_2.subscription.unsubscribe();
              }
          }
          _super.prototype._complete.call(this);
      };
      WindowToggleSubscriber.prototype._unsubscribe = function () {
          var contexts = this.contexts;
          this.contexts = null;
          if (contexts) {
              var len = contexts.length;
              var index = -1;
              while (++index < len) {
                  var context_3 = contexts[index];
                  context_3.window.unsubscribe();
                  context_3.subscription.unsubscribe();
              }
          }
      };
      WindowToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          if (outerValue === this.openings) {
              var closingSelector = this.closingSelector;
              var closingNotifier = tryCatch(closingSelector)(innerValue);
              if (closingNotifier === errorObject) {
                  return this.error(errorObject.e);
              }
              else {
                  var window_1 = new Subject();
                  var subscription = new Subscription();
                  var context_4 = { window: window_1, subscription: subscription };
                  this.contexts.push(context_4);
                  var innerSubscription = subscribeToResult(this, closingNotifier, context_4);
                  if (innerSubscription.closed) {
                      this.closeWindow(this.contexts.length - 1);
                  }
                  else {
                      innerSubscription.context = context_4;
                      subscription.add(innerSubscription);
                  }
                  this.destination.next(window_1);
              }
          }
          else {
              this.closeWindow(this.contexts.indexOf(outerValue));
          }
      };
      WindowToggleSubscriber.prototype.notifyError = function (err) {
          this.error(err);
      };
      WindowToggleSubscriber.prototype.notifyComplete = function (inner) {
          if (inner !== this.openSubscription) {
              this.closeWindow(this.contexts.indexOf(inner.context));
          }
      };
      WindowToggleSubscriber.prototype.closeWindow = function (index) {
          if (index === -1) {
              return;
          }
          var contexts = this.contexts;
          var context = contexts[index];
          var window = context.window, subscription = context.subscription;
          contexts.splice(index, 1);
          window.complete();
          subscription.unsubscribe();
      };
      return WindowToggleSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_Subject,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var WindowSubscriber$1 = /*@__PURE__*/ (function (_super) {
      __extends(WindowSubscriber, _super);
      function WindowSubscriber(destination, closingSelector) {
          var _this = _super.call(this, destination) || this;
          _this.destination = destination;
          _this.closingSelector = closingSelector;
          _this.openWindow();
          return _this;
      }
      WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.openWindow(innerSub);
      };
      WindowSubscriber.prototype.notifyError = function (error, innerSub) {
          this._error(error);
      };
      WindowSubscriber.prototype.notifyComplete = function (innerSub) {
          this.openWindow(innerSub);
      };
      WindowSubscriber.prototype._next = function (value) {
          this.window.next(value);
      };
      WindowSubscriber.prototype._error = function (err) {
          this.window.error(err);
          this.destination.error(err);
          this.unsubscribeClosingNotification();
      };
      WindowSubscriber.prototype._complete = function () {
          this.window.complete();
          this.destination.complete();
          this.unsubscribeClosingNotification();
      };
      WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
          if (this.closingNotification) {
              this.closingNotification.unsubscribe();
          }
      };
      WindowSubscriber.prototype.openWindow = function (innerSub) {
          if (innerSub === void 0) {
              innerSub = null;
          }
          if (innerSub) {
              this.remove(innerSub);
              innerSub.unsubscribe();
          }
          var prevWindow = this.window;
          if (prevWindow) {
              prevWindow.complete();
          }
          var window = this.window = new Subject();
          this.destination.next(window);
          var closingNotifier = tryCatch(this.closingSelector)();
          if (closingNotifier === errorObject) {
              var err = errorObject.e;
              this.destination.error(err);
              this.window.error(err);
          }
          else {
              this.add(this.closingNotification = subscribeToResult(this, closingNotifier));
          }
      };
      return WindowSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var WithLatestFromSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(WithLatestFromSubscriber, _super);
      function WithLatestFromSubscriber(destination, observables, project) {
          var _this = _super.call(this, destination) || this;
          _this.observables = observables;
          _this.project = project;
          _this.toRespond = [];
          var len = observables.length;
          _this.values = new Array(len);
          for (var i = 0; i < len; i++) {
              _this.toRespond.push(i);
          }
          for (var i = 0; i < len; i++) {
              var observable = observables[i];
              _this.add(subscribeToResult(_this, observable, observable, i));
          }
          return _this;
      }
      WithLatestFromSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.values[outerIndex] = innerValue;
          var toRespond = this.toRespond;
          if (toRespond.length > 0) {
              var found = toRespond.indexOf(outerIndex);
              if (found !== -1) {
                  toRespond.splice(found, 1);
              }
          }
      };
      WithLatestFromSubscriber.prototype.notifyComplete = function () {
      };
      WithLatestFromSubscriber.prototype._next = function (value) {
          if (this.toRespond.length === 0) {
              var args = [value].concat(this.values);
              if (this.project) {
                  this._tryProject(args);
              }
              else {
                  this.destination.next(args);
              }
          }
      };
      WithLatestFromSubscriber.prototype._tryProject = function (args) {
          var result;
          try {
              result = this.project.apply(this, args);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.next(result);
      };
      return WithLatestFromSubscriber;
  }(OuterSubscriber));

  /** PURE_IMPORTS_START _observable_zip PURE_IMPORTS_END */

  /** PURE_IMPORTS_START _observable_zip PURE_IMPORTS_END */

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  // call something on iterator step with safe closing on error

  var _iterCall = function (iterator, fn, value, entries) {
    try {
      return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (e) {
      var ret = iterator['return'];
      if (ret !== undefined) _anObject(ret.call(iterator));
      throw e;
    }
  };

  // check on default Array iterator

  var ITERATOR$2 = _wks('iterator');
  var ArrayProto$1 = Array.prototype;

  var _isArrayIter = function (it) {
    return it !== undefined && (_iterators.Array === it || ArrayProto$1[ITERATOR$2] === it);
  };

  var _createProperty = function (object, index, value) {
    if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
    else object[index] = value;
  };

  // getting tag from 19.1.3.6 Object.prototype.toString()

  var TAG$1 = _wks('toStringTag');
  // ES3 wrong here
  var ARG = _cof(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (e) { /* empty */ }
  };

  var _classof = function (it) {
    var O, T, B;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
      // builtinTag case
      : ARG ? _cof(O)
      // ES3 arguments fallback
      : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
  };

  var ITERATOR$3 = _wks('iterator');

  var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$3]
      || it['@@iterator']
      || _iterators[_classof(it)];
  };

  var ITERATOR$4 = _wks('iterator');
  var SAFE_CLOSING = false;

  try {
    var riter = [7][ITERATOR$4]();
    riter['return'] = function () { SAFE_CLOSING = true; };
  } catch (e) { /* empty */ }

  var _iterDetect = function (exec, skipClosing) {
    if (!skipClosing && !SAFE_CLOSING) return false;
    var safe = false;
    try {
      var arr = [7];
      var iter = arr[ITERATOR$4]();
      iter.next = function () { return { done: safe = true }; };
      arr[ITERATOR$4] = function () { return iter; };
      exec(arr);
    } catch (e) { /* empty */ }
    return safe;
  };

  _export(_export.S + _export.F * !_iterDetect(function (iter) { }), 'Array', {
    // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
    from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
      var O = _toObject(arrayLike);
      var C = typeof this == 'function' ? this : Array;
      var aLen = arguments.length;
      var mapfn = aLen > 1 ? arguments[1] : undefined;
      var mapping = mapfn !== undefined;
      var index = 0;
      var iterFn = core_getIteratorMethod(O);
      var length, result, step, iterator;
      if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
      // if object isn't iterable or it's array with default iterator - use simple case
      if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
        for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
          _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
        }
      } else {
        length = _toLength(O.length);
        for (result = new C(length); length > index; index++) {
          _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
        }
      }
      result.length = index;
      return result;
    }
  });

  var NODE_ENV$1 = process.env.NODE_ENV; // returns { cancelled$, setInterceptComplete }

  let localStore;
  let arrLogics = [];

  const decorateProcess = (process) => (context, dipatch, done) => {
    process(context, localStore.dispatch, done);
  };

  const plugin = (logicMiddleware) => ({

    onModel(model) {
      const logics = model.logics || [];

      logics.forEach(logic => {
        if (logic.process) {
          logic.process = decorateProcess(logic.process);
        }
        arrLogics.push(createLogic(logic));
      });
    },

    onStoreCreated(store) {
      localStore = store;
      logicMiddleware.addLogic(arrLogics);
    }
  });

  return plugin;

})));
