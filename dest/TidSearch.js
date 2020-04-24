"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function (global, doc) {
  function getDOMElement(node) {
    if (typeof node === "string") {
      node = doc.querySelector(node);
      if (node === null) throw "Element not found!";
    }

    if (node instanceof global.HTMLElement) return node;else throw "Not an element!";
  }

  function ajaxGetJSON(url) {
    return new Promise(function (resolve, reject) {
      var xhr = global.XMLHttpRequest ? new global.XMLHttpRequest() : new gloabl.ActiveXObject('Microsoft.XMLHTTP');
      xhr.open('GET', url, true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200 || xhr.status == 304) {
            var jsonObj = JSON.parse(xhr.responseText);
            console.log(jsonObj);
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
    if (Array.isArray(json)) return Promise.resolve(json);
    if (typeof json === "string") return ajaxGetJSON(json);
  }

  function format(template, obj, middleware) {
    if (!template.replace) throw "Argument must be string!";
    return template.replace(/\{\w+?\}/g, function (match) {
      return middleware(obj, match.slice(1, -1));
    });
  }

  function defaultTemplateMiddleware(obj, field) {
    return obj[field];
  }

  function defaultSegmenter(str) {
    str = str.trim();
    if (str.length == 0) return Promise.resolve([]);
    if (str.length == 1) return Promise.resolve([str]);
    var url = "//bird.ioliu.cn/v1?url=http://api.pullword.com/get.php&source=".concat(encodeURI(str), "&param1=0&param2=0&json=1");
    return ajaxGetJSON(url).then(function (json) {
      return json.map(function (word) {
        return word.t;
      });
    });
  }

  function defaultMatch(keywords, page) {
    var score = 0;
    var title = ('' + page.title).toUpperCase();
    var category = ('' + page.category).toUpperCase();
    var tags = ('' + page.tags).toUpperCase();
    var content = ('' + page.content).toUpperCase();
    keywords.map(function (keyword) {
      return keyword.toUpperCase();
    }).forEach(function (keyword) {
      score += title.includes(keyword) ? 3 : 0;
      score += category.includes(keyword) ? 2 : 0;
      score += tags.includes(keyword) ? 2 : 0;
      score += content.includes(keyword) ? 1 : 0;
    });
    return score;
  }

  var TidSearch = /*#__PURE__*/function () {
    function TidSearch(config) {
      var _this = this;

      _classCallCheck(this, TidSearch);

      this.input = config.input ? getDOMElement(config.input) : null;
      this.output = getDOMElement(config.output);
      this.json = null;
      this.template = config.template || '<p><a href="{url}">{title}</a></p>';
      this.templateMiddleware = config.templateMiddleware || defaultTemplateMiddleware;
      this.noResult = config.noResult || 'No Result.';
      this.segmenter = config.segmenter || defaultSegmenter;
      this.match = config.match || defaultMatch;
      this.paginator = config.paginator;
      this.afterSearch = config.afterSearch;
      this.loaded = loadJSON(config.json).then(function (result) {
        _this.json = result;
      }, function (reason) {
        throw "Load JSON fail! " + reason;
      }).then(function () {
        var register = null;
        if (!_this.input.addEventListener) if (_this.input.attachEvent) register = function register(func) {
          return _this.input.attachEvent('onpropertychange', func);
        };else throw "Your Browser is too old!";

        register = function register(func) {
          _this.input.addEventListener('input', func);

          _this.input.addEventListener('paste', func);
        };

        register(function () {
          return _this.search(_this.input.value);
        });
      });
    }

    _createClass(TidSearch, [{
      key: "search",
      value: function search(str) {
        var _this2 = this;

        if (!this.json) {
          var errMsg = "Please wait till JSON Loaded.";
          console.warn(errMsg);
          return Promise.reject(errMsg);
        }

        return this.segmenter(str).then(function (keywords) {
          if (!keywords.length) {
            _this2.output.innerHTML = '';
            return [];
          }

          var pages = _this2.json.map(function (page) {
            return {
              score: _this2.match(keywords, page),
              page: page
            };
          }).filter(function (a) {
            return a.score > 0;
          });

          pages = pages.sort(function (a, b) {
            return b.score - a.score;
          }).map(function (a) {
            return a.page;
          });
          if (!pages.length) _this2.output.innerHTML = _this2.noResult;else {
            var pageElements = pages.map(function (page) {
              return format(_this2.template, page, _this2.templateMiddleware);
            });

            if (_this2.paginator) {
              throw "Unimplemented";

              _this2.paginator(pageElements).map(function (pages) {
                return pages.join('\n');
              });
            } else {
              _this2.output.innerHTML = pageElements.join('\n');
            }
          }
          return pages;
        }).then(function (result) {
          if (_this2.afterSearch) _this2.afterSearch(result);
          return result;
        });
      }
    }]);

    return TidSearch;
  }();

  global.TidSearch = TidSearch;
})(window, document);