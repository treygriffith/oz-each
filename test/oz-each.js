
var Oz = require('oz');
var ozEach = require('oz-each');
var ozText = require('oz-text');
var assert = require('assert');
var text = require('text');
var children = require('children');

Oz
  .use(ozEach)
  .use(ozText);

describe('Rendering', function(){

  it('should set text values as array elements', function(){
    var el = children(Oz.render('<div oz-each="names"><p oz-text="@"></p></div>', { names: ['Tobi', 'Paul']}));
    assert('Tobi' == text(children(el[0])[0]));
    assert('Paul' == text(children(el[1])[0]));
  });

  it('should use object values as array elements', function(){
    var el = children(Oz.render('<div oz-each="people"><p oz-text="name"></p></div>', { people: [ {name: 'Tobi'}, {name: 'Paul'} ]}));
    assert('Tobi' == text(children(el[0])[0]));
    assert('Paul' == text(children(el[1])[0]));
  });

  it('should hide non-array-like objects that are `each`ed', function(){
    var el = children(Oz.render('<div oz-each="people"><p oz-text="name"></p></div>', {}));
    assert(el[0].style.display === 'none');
  });

  it('should pass through undefined values as contexts', function(){
    var el = children(Oz.render('<div oz-each="people"><p oz-text="@"></p></div>', {people: [undefined, true]}));
    assert(text(children(el[0])[0]) === '');
  });
});

describe("Updating", function() {

  it('should update text values as array elements', function(){

    var template = Oz('<div oz-each="names"><p oz-text="@"></p></div>');
    var el = children(template.render({ names: ['Tobi', 'Paul']}));
    assert('Tobi' == text(children(el[0])[0]));
    assert('Paul' == text(children(el[1])[0]));

    template.update({names: ['Tobi', 'Brian']});

    assert('Tobi' == text(children(el[0])[0]));
    assert('Brian' == text(children(el[1])[0]));
  });

  it('should add new array elements', function(){
    var template = Oz('<div oz-each="names"><p oz-text="@"></p></div>');
    var fragment = template.render({ names: ['Tobi', 'Paul']});

    template.update({names: ['Tobi', 'Paul', 'Brian']});

    assert('Brian' == text(children(children(fragment)[2])[0]));
  });

  it('should remove deleted array elements', function(){
    var template = Oz('<div oz-each="names"><p oz-text="@"></p></div>');
    var fragment = template.render({ names: ['Tobi', 'Paul', 'Brian']});

    template.update({names: ['Tobi', 'Paul']});

    assert(children(fragment)[3] == null);
    assert(text(children(children(fragment)[2])[0]) === '');
  });

});
