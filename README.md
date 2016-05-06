This is a web component to exploit i18next.

# &lt;kwc-i18next&gt;

> A web component used to manage internationalization – replaces kwc-i18n

## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install kwc-i18next --save
```

Or [download as ZIP](https://github.com/successk/kwc-i18next/archive/master.zip).

## Usage

### 1 – Import polyfill:

```html
<script src="bower_components/webcomponentsjs/webcomponents-lite.min.js"></script>
```

### 2 – Import custom element:

```html
<link rel="import" href="bower_components/kwc-i18next/kwc-i18next.html">
```

### 3 – Start using it!

```html
<kwc-i18next property="value"></kwc-i18next>
```


## Documentation

See [docs](./docs) for options, children selector, methods, events and styles.

## Development

In order to run it locally you'll need to fetch some dependencies and a basic server setup.

### 1 – Install [bower](http://bower.io/) & [gulp](http://gulpjs.com/):

```sh
$ npm install -g bower gulp
$ npm install gulp
```

### 2 – Install local dependencies:

```sh
$ bower install
$ npm install
```

### 3 – Start development server and open `http://localhost:8000/components/kwc-i18next/`.

```sh
$ gulp dev
```

### 4 - build and minify file

```sh
$ gulp build
$ gulp verify # test minified file
```

## History

For detailed changelog, check [Releases](https://github.com/successk/kwc-i18next/releases).

## License

MIT