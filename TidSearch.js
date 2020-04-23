(function (global, doc) {
    function getDOMElement(node) {
        if (typeof node === "string") {
            node = doc.querySelector(node);
            if (node === null)
                throw "Element not found!";
        }
        if (node instanceof global.HTMLElement)
            return node;
        else
            throw "Not an element!";
    }

    function ajaxGetJSON(url) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200 || xhr.status == 304) {
                        const jsonObj = JSON.parse(xhr.responseText);
                        resolve(jsonObj);
                    } else {
                        reject('HTTP ' + xhr.status + ' error!');
                    }
                }
            };
            xhr.send();
        });
    }

    function loadJSON(json) {
        if (Array.isArray(json))
            return Promise.resolve(json);
        if (typeof json === "string")
            return ajaxGetJSON(json);
    }

    function format(template, obj) {
        if (!template.replace) throw "Argument must be string!";
        return template.replace(/\{\w+?\}/g, match => obj[match.slice(1, -1)]);
    }

    function defaultSegmenter(str) {
        return Promise.resolve(str.split(' '));
    }

    function defaultMatch(keywords, page) {
        let score = 0;

        const title = ('' + page.title).toUpperCase();
        const category = ('' + page.category).toUpperCase();
        const tags = ('' + page.tags).toUpperCase();
        const content = ('' + page.content).toUpperCase();

        keywords.map(keyword => keyword.toUpperCase()).forEach(keyword => {
            score += title.includes(keyword) ? 3 : 0;
            score += category.includes(keyword) ? 2 : 0;
            score += tags.includes(keyword) ? 2 : 0;
            score += content.includes(keyword) ? 1 : 0;
        });

        return score;
    }

    class TidSearch {
        constructor(config) {
            this.input = config.input ? getDOMElement(config.input) : null;
            this.output = getDOMElement(config.output);
            this.jsonPromise = loadJSON(config.json);
            this.json = null;
            this.template = config.template || '<p><a href="{url}">{title}</a></p>';
            this.segmenter = config.segmenter || defaultSegmenter;
            this.match = config.match || defaultMatch;
            this.paginator = config.paginator;

            this.loaded = this.jsonPromise.then(result => {
                this.json = result;
            }, reason => {
                throw "Load JSON fail! " + reason;
            });
        }

        search(str) {
            if (!this.json) {
                const errMsg = "Please wait till JSON Loaded.";
                console.warn(errMsg);
                return Promise.reject(errMsg);
            }
            return this.segmenter(str).then(keywords =>
                this.json.map(page => ({
                    score: this.match(keywords, page),
                    page: page,
                })).filter(a => a.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .map(a => a.page)
            ).then(pages => {
                const pageElements = pages.map(page => format(this.template, page));
                if (this.paginator) {
                    throw "Unimplemented";
                    this.paginator(pageElements).map(pages => pages.join('\n'));
                } else {
                    this.output.innerHTML = pageElements.join('\n');
                }
                return pages;
            });
        }
    }

    global.TidSearch = TidSearch;
})(window, document);
