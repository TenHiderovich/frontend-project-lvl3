install:
	npm install

build:
	rm -rf dist
	npm run build

test:
	npm test

test-watch:
	npm test -- --watch

test-coverage:
	npm test -- --coverage

lint:
	npx eslint .

lint-fix:
	npx eslint --fix .

publish:
	npm publish --dry-run