/**
 * Module dependencies
 */
var attr = require('attr')
  , children = require('children');

/**
 * Export plugin
 */
module.exports = function (Oz) {
  Oz.tag('oz-each', render);
};

module.exports.render = render;

/**
 * Iterate over array-like objects and namespace the resulting nodes to the value iterated over
 * template: <div oz-each="people"><p oz-text="name"></p></div>
 * context: { people: [ {name: 'Tobi'}, {name: 'Brian'} ] }
 * output: <div oz-each="people" oz-each-index="0"><p oz-text="name">Tobi</p></div>
 *         <div oz-each="people" oz-each-index="1"><p oz-text="name">Brian</p></div>
 */

function render (el, val, scope, raw) {
  if(attr(el).get('oz-each-index') == undefined) {

    // starter node
    if(val.length) {
      attr(el).set('oz-each-index', 0);
      this.show(el);

      // render it again now that it has an index
      return this._render(el, raw.ctx, raw.scope);
    }

    this.hide(el);
    
  } else {

    // existing node, get index
    var i = parseInt(scope.split('.').pop(), 10);

    if(i >= val.length) {
      // this node needs to go away
      if(i > 0) {
        el.parentNode.removeChild(el);
      } else {
        // don't remove the zero element - it will be our new starter
        attr(el).set('oz-each-index', '');
        this.hide(el);
      }

    } else if(i < val.length - 1 && !siblings(el, '[oz-each-index='+(i+1)+']').length) {
      // we need more nodes
      // only let the last node perform this operation
      // render the newly created nodes - they'll be skipped otherwise
      this._render(addNode(el, i+1, this.show.bind(this)), raw.ctx, raw.scope);
    }
  }

  // scope down the children
  return scope;
}

function addNode(el, n, show) {
  var newEl = el.cloneNode(true);
  show(newEl);

  attr(newEl).set('oz-each-index', n);

  el.parentNode.insertBefore(newEl, el.nextSibling);

  return newEl;
}

