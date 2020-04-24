# TidSearch

A JavaScript library to add search functionality to static blogs.

## Installation
### By Source Code
Clone the git repository and generate the dist directory using the following command.
```
npm install
npm run build
```

Then copy `dist/TidSeach.js` to your website directory and introduce it through the `<script>` tag.

### By CDN
You can use CDN provided by jsdelivr to introduce the project to your web pages.
```html
<script src="https://cdn.jsdelivr.net/npm/tidsearch@latest/dist/TidSearch.min.js"></script>
```

## Quick Start
### Create `search.json`
Add a `search.json` to your web site, the contents of which are an array, and each element in the array is an object containing information about a page, which needs to contain fields including `title`, `url`, `category` (optional) , `tags` (optional) , `date` (optional) , `content` (optional).

For blogs built with Jekyll, you can use the following template to quickly generate `search.json`.
```
---
layout: 
---
[
{% for post in site.posts %}
    {
        "title"    : "{{ post.title | escape }}",
        "url"      : "{{ site.baseurl }}{{ post.url }}",
        "category" : "{{ post.category }}",
        "tags"     : "{{ post.tags | join: ', ' }}",
        "date"     : "{{ post.date | date: '%Y-%m-%d' }}",
        "content"  : {{ post.content | strip_html | normalize_whitespace | jsonify }}
    } {% unless forloop.last %},{% endunless %}
{% endfor %}
]
```

Note that the content item in the above template does not contain quota marks, which are automatically added by jsonify.

If you do not need an item in the template, just delete the corresponding line.

##  Add DOM elements to the page
For TidSearch, you need to add a `<div>` or a `<ul>` or other DOM element to the page to hold the search results.

Alternatively, you can add an input to support instant search. 

### Initialize
Use the following JavaScript code to initialize TidSearch.
```javascript
const sch = new TidSearch({
    input: document.getElementById('searchInput'),
    output: document.getElementById('searchResultContainer'),
    // or like this
    // input: '#searchInput',
    // output: '#searchResultContainer',
    json: '/search.json',
});
```
The output parameter is a container for search results, which can be a DOM element or a CSS selector (string) . **Note that if you pass in a CSS selector, you need to ensure that the corresponding elements in the page have been already loaded when you run the above code.**

The json parameter is the location of `search.json`, or you can load the JSON file ahead of time and pass in the parsed result.

### Start Using
After the initialization is complete, you can initiate a search through its `search` method. The results are presented in a pre-prepared container element.

If you specify the `input` item during initialization, then when its value changes, the `search` method will be triggered automatically.

## About Browser Compatibility
**`Tidsearch` relies on `Promise`.** The default configuration uses Babel to be compatible with older browsers (Chrome59 and IE11) , but it **doesn't** include polyfill for `Promise`. If you need to be compatible with browsers that don't support `Promise`, introduce polyfill. See other articles for details.

## Configuation
See the [Wiki page](https://github.com/Wybxc/TidSearch/wiki/) for additional parameters for the TidSearch object at initialization time, as well as specific usage.

## License
This project uses the MPLv2 open source license, you need to pay attention to the following:
-  You need to publish your code for the source code changes for this project.
-  You need to provide documentation of the changes.