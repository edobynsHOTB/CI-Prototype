# CA prototype Web workflow
---

## Getting Started

### Dependencies

*  Nodejs
*  npm
* bower

### LESS

Install LESS globally if you don't already have it:

```bash
npm install -g less
```

### Grunt

_If you haven't used **grunt** before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide._

From the same directory as this project's [Gruntfile](http://gruntjs.com/getting-started) and [package.json](https://nodejs.org), install npm dependencies:

```bash
npm install
```

Once that's done, install bower dependencies:

```bash
bower install
```

If the project has been installed correctly, running `grunt --help` at the command line should list the newly-installed project's tasks.

***

## Building and Running

### Build

**To build the project for the first time, use this command:**

```bash
grunt setup
```

Once the project has been built initially, you can avoid rebuilding all the dependencies over again by using:

```bash
grunt build
```

When you build the project, it will be compiled into html and css files and everything you need to deploy the website will be in the `dist` folder.

### Run

To serve to localhost and watch for new changes as you create or edit files, run:

```bash
grunt serve
```

This will open up a new tab in your default browser and run the site from the `dist` folder. You can view the project in any browser by copying the localhost path `http://localhost:8000/` into the address bar.

***

## Editing

This project is build using [Assemble](http://assemble.io/docs/), a static-site generating engine.

You can find all LESS files in the `theme` folder, all pages and templates in `template` folder, all api data in `data` folder, and all images, js, and extra css in the content folder.

**Use [handlebars templating](http://handlebarsjs.com/) and [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) (in news articles). For css styling, use [LESS](http://lesscss.org/).**

This project comes loaded with [Bootstrap](http://www.getbootstrap.com) for responsiveness and a base to build on, all customizations to that are in the `theme/components` folder. You can also change the variables (such as universal colors, margins, fonts, etc) in `theme/variables.less`. The base Bootstrap files are in the `theme/bootstrap` folder.  Lint and test your code using **grunt**.

***

## References

* [Nodejs](https://nodejs.org/en/)
* [Grunt](http://gruntjs.com/getting-started)
* [Assemble](http://assemble.io/docs/)
* [Handlebars templating](http://handlebarsjs.com/)
* [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

***

## Author

*README last edited on Feb 23, 2017*
