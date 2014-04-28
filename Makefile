
build: components index.js
				@component build --dev

dist: components
				@component build --standalone oz-each --name oz-each --out dist
				@uglifyjs dist/oz-each.js -o dist/oz-each.min.js

components: component.json
				@component install --dev

clean:
				rm -fr build components template.js dist

test: build
				component-test phantom

.PHONY: clean oz-each test
