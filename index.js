/**
 * Module dependencies
 */
var attr = require('attr')
  , siblings = require('siblings');

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

