oz-each
========

Array iteration tag for [Oz](http://github.com/treygriffith/oz).


Installation
------------

Using component:

```
$ component install treygriffith/oz-each
```

Using a script tag (UMD compatible)

```
<script src="./oz-each.min.js"></script>
```

Usage
-----

The tagged node will be replicated for each element in the listed array, and child nodes will be namespaced to that array element.

Notation:

```html
<div oz-each="people"></div>
```

Example:

```javascript
var context = {
  people: [
    'Tobi',
    'Brian'
  ]
};
```

```html
<div oz-each="people" oz-each-index="0">
  <span oz-text="@">Tobi</span>
</div>
<div oz-each="people" oz-each-index="1">
  <span oz-text="@">Brian</span>
</div>
```

License
-------
MIT
