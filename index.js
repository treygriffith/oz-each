/**
 * Module dependencies
 */
var attr = require('attr')
  , siblings = require('siblings');

/**
 * Export plugin
 */
module.exports = function (Oz) {
  Oz.tag('oz-each', render);
};

module.exports.render = render;

var index = 'oz-each-index';

/**
 * Iterate over array-like objects and namespace the resulting nodes to the value iterated over
 * template: <div oz-each="people"><p oz-text="name"></p></div>
 * context: { people: [ {name: 'Tobi'}, {name: 'Brian'} ] }
 * output: <div oz-each="people" oz-each-index="0"><p oz-text="name">Tobi</p></div>
 *         <div oz-each="people" oz-each-index="1"><p oz-text="name">Brian</p></div>
 */

function render (el, val, scope, raw) {

  if(attr(el).get(index) == undefined || !val) {

    // starter node
    if(val && val.length) {
      attr(el).set(index, 0);
      this.show(el);

      // render it again now that it has an index
      this._render(el, raw.ctx, raw.scope);

    }

    this.hide(el);

    // don't render children
    return false;
  }

  // existing node, get index
  var i = parseInt(attr(el).get(index), 10);

  if(i >= val.length) {
    // this node needs to go away
    if(i > 0) {
      el.parentNode.removeChild(el);
    } else {
      // don't remove the zero element - it will be our new starter
      attr(el).set(index, '');
      this.hide(el);
    }

  } else if(i < (val.length - 1) && siblings(el, '[' + index + '="' + (i+1) + '"]').length === 0) {
    // we need more nodes
    // only let the last node perform this operation
    // render the newly created nodes - they'll be skipped otherwise
    this._render(addNode(el, i+1, this.show), raw.ctx, raw.scope);
  }

  // scope down the children
  return this.scope(scope, i);
}

function addNode(el, n, show) {
  var newEl = el.cloneNode(true);
  show(newEl);

  attr(newEl).set(index, n);

  el.parentNode.insertBefore(newEl, el.nextSibling);

  return newEl;
}

