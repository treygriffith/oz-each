
;(function(){

/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("matthewp~attr@master", function (exports, module) {
/*
** Fallback for older IE without get/setAttribute
 */
function fetch(el, attr) {
  var attrs = el.attributes;
  for(var i = 0; i < attrs.length; i++) {
    if (attr[i] !== undefined) {
      if(attr[i].nodeName === attr) {
        return attr[i];
      }
    }
  }
  return null;
}

function Attr(el) {
  this.el = el;
}

Attr.prototype.get = function(attr) {
  return (this.el.getAttribute && this.el.getAttribute(attr))
    || (fetch(this.el, attr) === null ? null : fetch(this.el, attr).value);
};

Attr.prototype.set = function(attr, val) {
  if(this.el.setAttribute) {
    this.el.setAttribute(attr, val);
  } else {
    fetch(this.el, attr).value = val;
  }

  return this;
};

Attr.prototype.has = function(attr) {
  return (this.el.hasAttribute && this.el.hasAttribute(attr))
    || fetch(this.el, attr) !== null;
};

module.exports = function(el) {
  return new Attr(el);
};

module.exports.Attr = Attr;

});

require.register("component~query@0.0.3", function (exports, module) {
function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};

});

require.register("component~matches-selector@0.1.2", function (exports, module) {
/**
 * Module dependencies.
 */

var query = require("component~query@0.0.3");

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matches
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = query.all(selector, el.parentNode);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}

});

require.register("ramitos~children@master", function (exports, module) {
var matches = require("component~matches-selector@0.1.2")

// same code as jquery with just the adition of selector matching
module.exports = function (el, selector) {
  var n = el.firstChild
  var matched = [];

  for(; n; n = n.nextSibling) {
    if(n.nodeType === 1 && (!selector || (selector && matches(n, selector))))
      matched.push(n)
  }

  return matched
}
});

require.register("treygriffith~siblings@0.0.4", function (exports, module) {
var children = require("ramitos~children@master")

module.exports = function (el, selector) {
  return children(el.parentNode, selector).filter(function (sibling) {
    return sibling !== el
  })
}

});

require.register("oz-each", function (exports, module) {
/**
 * Module dependencies
 */
var attr = require("matthewp~attr@master")
  , siblings = require("treygriffith~siblings@0.0.4");

/**
 * Export plugin
 */
module.exports = function (Oz) {
  Oz.tag('oz-each', render, '[oz-each-index]');
};

module.exports.render = render;

/**
 * Iterate over array-like objects and namespace the resulting nodes to the value iterated over
 * template: <div oz-each="people"><p oz-text="name"></p></div>
 * context: { people: [ {name: 'Tobi'}, {name: 'Brian'} ] }
 * output: <div oz-each="people" oz-each-index="0"><p oz-text="name">Tobi</p></div>
 *         <div oz-each="people" oz-each-index="1"><p oz-text="name">Brian</p></div>
 */

function render (el, ctx, prop, scope, next) {

  var newEl
    , existing = {}
    , after
    , val = this.get(ctx, prop);

  // nothing to do if there is no array at all
  if(!val) return this.hide(el);

  this.show(el);

  // find all the existing elements
  siblings(el, '[oz-each-index]').forEach(function (el, i) {

    // remove elements that are no longer around
    if(i >= val.length) return el.parentNode.removeChild(el);

    // keep track of the existing elements
    existing[i] = el;
  });

  // use a for loop instead of `.forEach` to allow array-like values with a length property
  for(var i=0; i<val.length; i++) {

    after = existing[i + 1] || el;
    newEl = existing[i] || el.cloneNode(true);

    // we need to be able to reference this element later
    attr(newEl).set('oz-each-index', i);

    // insert in the correct ordering
    after.parentNode.insertBefore(newEl, after);

    next(newEl, val[i], this.scope(scope, prop + '.' + i));
  }

  // hide template element
  this.hide(el);
}


});

if (typeof exports == "object") {
  module.exports = require("oz-each");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("oz-each"); });
} else {
  this["oz-each"] = require("oz-each");
}
})()
