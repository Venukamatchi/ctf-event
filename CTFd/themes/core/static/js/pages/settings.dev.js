/*! For license information please see settings.dev.js.LICENSE.txt */
!function(e){function n(n){for(var r,o,u=n[0],i=n[1],l=n[2],c=0,d=[];c<u.length;c++)o=u[c],Object.prototype.hasOwnProperty.call(s,o)&&s[o]&&d.push(s[o][0]),s[o]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);for(p&&p(n);d.length;)d.shift()();return a.push.apply(a,l||[]),t()}function t(){for(var e,n=0;n<a.length;n++){for(var t=a[n],r=!0,u=1;u<t.length;u++){var i=t[u];0!==s[i]&&(r=!1)}r&&(a.splice(n--,1),e=o(o.s=t[0]))}return e}var r={},s={"pages/settings":0},a=[];function o(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.m=e,o.c=r,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)o.d(t,r,function(n){return e[n]}.bind(null,r));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="/themes/core/static/js";var u=window.webpackJsonp=window.webpackJsonp||[],i=u.push.bind(u);u.push=n,u=u.slice();for(var l=0;l<u.length;l++)n(u[l]);var p=i;a.push(["./CTFd/themes/core/assets/js/pages/settings.js","helpers","vendor","default~pages/challenges~pages/main~pages/notifications~pages/scoreboard~pages/settings~pages/setup~~6822bf1f"]),t()}({"./CTFd/themes/core/assets/js/pages/settings.js":function(module,exports,__webpack_require__){eval('\n\n__webpack_require__(/*! ./main */ "./CTFd/themes/core/assets/js/pages/main.js");\n\nvar _utils = __webpack_require__(/*! ../utils */ "./CTFd/themes/core/assets/js/utils.js");\n\nvar _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"));\n\nvar _CTFd = _interopRequireDefault(__webpack_require__(/*! ../CTFd */ "./CTFd/themes/core/assets/js/CTFd.js"));\n\nvar _ezq = __webpack_require__(/*! ../ezq */ "./CTFd/themes/core/assets/js/ezq.js");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar error_template = \'<div class="alert alert-danger alert-dismissable" role="alert">\\n\' + \'  <span class="sr-only">Error:</span>\\n\' + "  {0}\\n" + \'  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>\\n\' + "</div>";\nvar success_template = \'<div class="alert alert-success alert-dismissable submit-row" role="alert">\\n\' + "  <strong>Success!</strong>\\n" + "   Your profile has been updated\\n" + \'  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>\\n\' + "</div>";\n\nfunction profileUpdate(event) {\n  event.preventDefault();\n  (0, _jquery.default)("#results").empty();\n  var $form = (0, _jquery.default)(this);\n  var params = $form.serializeJSON(true);\n\n  _CTFd.default.api.patch_user_private({}, params).then(function (response) {\n    if (response.success) {\n      (0, _jquery.default)("#results").html(success_template);\n    } else if ("errors" in response) {\n      Object.keys(response.errors).map(function (error) {\n        var i = $form.find("input[name={0}]".format(error));\n        var input = (0, _jquery.default)(i);\n        input.addClass("input-filled-invalid");\n        input.removeClass("input-filled-valid");\n        var error_msg = response.errors[error];\n        (0, _jquery.default)("#results").append(error_template.format(error_msg));\n      });\n    }\n  });\n}\n\nfunction tokenGenerate(event) {\n  event.preventDefault();\n  var $form = (0, _jquery.default)(this);\n  var params = $form.serializeJSON(true);\n\n  _CTFd.default.fetch("/api/v1/tokens", {\n    method: "POST",\n    body: JSON.stringify(params)\n  }).then(function (response) {\n    return response.json();\n  }).then(function (response) {\n    if (response.success) {\n      var body = (0, _jquery.default)("\\n        <p>Please copy your API Key, it won\'t be shown again!</p>\\n        <div class=\\"input-group mb-3\\">\\n          <input type=\\"text\\" id=\\"user-token-result\\" class=\\"form-control\\" value=\\"".concat(response.data.value, "\\" readonly>\\n          <div class=\\"input-group-append\\">\\n            <button class=\\"btn btn-outline-secondary\\" type=\\"button\\">\\n              <i class=\\"fas fa-clipboard\\"></i>\\n            </button>\\n          </div>\\n        </div>\\n        "));\n      body.find("button").click(function (event) {\n        (0, _utils.copyToClipboard)(event, "#user-token-result");\n      });\n      (0, _ezq.ezAlert)({\n        title: "API Key Generated",\n        body: body,\n        button: "Got it!",\n        large: true\n      });\n    }\n  });\n}\n\nfunction deleteToken(event) {\n  event.preventDefault();\n  var $elem = (0, _jquery.default)(this);\n  var id = $elem.data("token-id");\n  (0, _ezq.ezQuery)({\n    title: "Delete Token",\n    body: "Are you sure you want to delete this token?",\n    success: function success() {\n      _CTFd.default.fetch("/api/v1/tokens/" + id, {\n        method: "DELETE"\n      }).then(function (response) {\n        return response.json();\n      }).then(function (response) {\n        if (response.success) {\n          $elem.parent().parent().remove();\n        }\n      });\n    }\n  });\n}\n\n(0, _jquery.default)(function () {\n  (0, _jquery.default)("#user-profile-form").submit(profileUpdate);\n  (0, _jquery.default)("#user-token-form").submit(tokenGenerate);\n  (0, _jquery.default)(".delete-token").click(deleteToken);\n  (0, _jquery.default)(".nav-pills a").click(function (event) {\n    window.location.hash = this.hash;\n  }); // Load location hash\n\n  var hash = window.location.hash;\n\n  if (hash) {\n    hash = hash.replace("<>[]\'\\"", "");\n    (0, _jquery.default)(\'.nav-pills a[href="\' + hash + \'"]\').tab("show");\n  }\n});\n\n//# sourceURL=webpack:///./CTFd/themes/core/assets/js/pages/settings.js?')}});