(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/CssGrid/GridContainer.js":
/*!**************************************!*\
  !*** ./src/CssGrid/GridContainer.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ \"prop-types\");\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\n\n\nvar GridContainer =\n/*#__PURE__*/\nfunction (_Component) {\n  _inherits(GridContainer, _Component);\n\n  function GridContainer() {\n    _classCallCheck(this, GridContainer);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(GridContainer).apply(this, arguments));\n  }\n\n  _createClass(GridContainer, [{\n    key: \"render\",\n    value: function render() {\n      var _style = {};\n\n      if (this.props.style) {\n        _style = this.props.style;\n      }\n\n      _style.display = \"grid\";\n\n      if (!_style.width) {//_style.width = \"100%\";\n      }\n\n      if (!_style.height) {//_style.height = \"100%\";\n      }\n\n      if (!_style.gridGap) {\n        _style.gridGap = this.props.gap;\n      }\n\n      if (!_style.gridTemplateRows) {\n        _style.gridTemplateRows = this.props.rowTemplate;\n      }\n\n      if (!_style.gridTemplateColumns) {\n        _style.gridTemplateColumns = this.props.columnTemplate;\n      }\n\n      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", _extends({\n        style: _style\n      }, this.props), this.props.children);\n    }\n  }]);\n\n  return GridContainer;\n}(react__WEBPACK_IMPORTED_MODULE_0__[\"Component\"]);\n\nGridContainer.propTypes = {\n  gap: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,\n  rowTemplate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,\n  columnTemplate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (GridContainer);\n\n//# sourceURL=webpack:///./src/CssGrid/GridContainer.js?");

/***/ }),

/***/ "./src/CssGrid/GridItem.js":
/*!*********************************!*\
  !*** ./src/CssGrid/GridItem.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ \"prop-types\");\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\n\n\nvar GridItem =\n/*#__PURE__*/\nfunction (_Component) {\n  _inherits(GridItem, _Component);\n\n  function GridItem() {\n    _classCallCheck(this, GridItem);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(GridItem).apply(this, arguments));\n  }\n\n  _createClass(GridItem, [{\n    key: \"render\",\n    value: function render() {\n      var _style = {};\n\n      if (this.props.style) {\n        _style = this.props.style;\n      }\n\n      if (!_style.gridGap) {\n        _style.gridGap = this.props.gap;\n      }\n\n      if (!_style.gridTemplateRows) {\n        _style.gridRow = this.props.rows;\n      }\n\n      if (!_style.gridTemplateColumns) {\n        _style.gridColumn = this.props.columns;\n      }\n\n      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        style: _style\n      }, this.props.children);\n    }\n  }]);\n\n  return GridItem;\n}(react__WEBPACK_IMPORTED_MODULE_0__[\"Component\"]);\n\nGridItem.propTypes = {\n  gap: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,\n  rows: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,\n  columns: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (GridItem);\n\n//# sourceURL=webpack:///./src/CssGrid/GridItem.js?");

/***/ }),

/***/ "./src/actions/AppActions.js":
/*!***********************************!*\
  !*** ./src/actions/AppActions.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ \"rxjs\");\n/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(rxjs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _processors_LoadClientAppsService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./processors/LoadClientAppsService */ \"./src/actions/processors/LoadClientAppsService.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\n\nvar AppActions = function AppActions() {\n  _classCallCheck(this, AppActions);\n\n  _defineProperty(this, \"logout\", {\n    'source': new rxjs__WEBPACK_IMPORTED_MODULE_0__[\"Subject\"](),\n    'sink': new rxjs__WEBPACK_IMPORTED_MODULE_0__[\"Subject\"]()\n  });\n\n  _defineProperty(this, \"navigateTo\", new rxjs__WEBPACK_IMPORTED_MODULE_0__[\"Subject\"]());\n\n  _defineProperty(this, \"loadClientApps\", {\n    source: new rxjs__WEBPACK_IMPORTED_MODULE_0__[\"BehaviorSubject\"](),\n    sink: new rxjs__WEBPACK_IMPORTED_MODULE_0__[\"BehaviorSubject\"]()\n  });\n\n  this.loadClientAppsService = new _processors_LoadClientAppsService__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this.loadClientApps.source, this.loadClientApps.sink);\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (new AppActions());\n\n//# sourceURL=webpack:///./src/actions/AppActions.js?");

/***/ }),

/***/ "./src/actions/AppSettings.js":
/*!************************************!*\
  !*** ./src/actions/AppSettings.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ \"rxjs\");\n/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(rxjs__WEBPACK_IMPORTED_MODULE_0__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\nvar AppSettings = function AppSettings() {\n  _classCallCheck(this, AppSettings);\n\n  _defineProperty(this, \"baseHost\", new rxjs__WEBPACK_IMPORTED_MODULE_0__[\"BehaviorSubject\"](\"\"));\n\n  _defineProperty(this, \"basicUser\", new rxjs__WEBPACK_IMPORTED_MODULE_0__[\"BehaviorSubject\"](window.localStorage.getItem(\"u\")));\n\n  _defineProperty(this, \"basicPwd\", new rxjs__WEBPACK_IMPORTED_MODULE_0__[\"BehaviorSubject\"](window.localStorage.getItem(\"p\")));\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (new AppSettings());\n\n//# sourceURL=webpack:///./src/actions/AppSettings.js?");

/***/ }),

/***/ "./src/actions/processors/LoadClientAppsService.js":
/*!*********************************************************!*\
  !*** ./src/actions/processors/LoadClientAppsService.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _AppActions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../AppActions */ \"./src/actions/AppActions.js\");\n/* harmony import */ var superagent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! superagent */ \"superagent\");\n/* harmony import */ var superagent__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(superagent__WEBPACK_IMPORTED_MODULE_1__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n/*\n * Copyright (c) 2015  Mike Nimer & 11:58 Labs\n */\n\n\n/**\n * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors\n * @type {{subscribe: Function, onNext: Function}}\n */\n\nvar LoginService =\n/*#__PURE__*/\nfunction () {\n  function LoginService(source_, sink_) {\n    _classCallCheck(this, LoginService);\n\n    _defineProperty(this, \"sink\", undefined);\n\n    //console.log(\"{GetUsers Service} subscribe\");\n    this.sink = sink_;\n    source_.subscribe(this.loadApps.bind(this));\n  }\n  /**\n   * Return all of the users\n   * @param val_\n   * @returns {*}\n   */\n\n\n  _createClass(LoginService, [{\n    key: \"loadApps\",\n    value: function loadApps(data_) {\n      var _this = this;\n\n      var u = window.localStorage.getItem(\"u\");\n      var p = window.localStorage.getItem(\"p\"); //.set('Authorization', 'user ' +u +\":\" +p)\n      //call server get list of apps\n\n      superagent__WEBPACK_IMPORTED_MODULE_1___default.a.get('http://localhost:9000/api/familydam/v1/core/clientapps').withCredentials().set('Accept', 'application/json').set('Authorization', 'user ' + u + \":\" + p).end(function (err, res) {\n        if (!err) {\n          //send results to the store\n          _this.sink.next({\n            \"primaryApps\": res.body.apps.primary,\n            \"secondaryApps\": res.body.apps.secondary\n          });\n        } else {\n          //send the error to the store (through the sink observer\n          if (err.status === 401) {\n            _AppActions__WEBPACK_IMPORTED_MODULE_0__[\"default\"].navigateTo.next(\"/\");\n          } else if (err.status === 403) {\n            var _error403 = {\n              'code': err.status,\n              'message': \"Invalid Login (todo: show toast)\"\n            };\n\n            _this.sink.error(_error403);\n          } else {\n            console.dir(err);\n            var _error = {\n              'code': err.status,\n              'status': err.statusText,\n              'message': err.responseText\n            };\n\n            _this.sink.error(_error);\n          }\n        }\n      });\n    }\n  }]);\n\n  return LoginService;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (LoginService);\n\n//# sourceURL=webpack:///./src/actions/processors/LoadClientAppsService.js?");

/***/ }),

/***/ "./src/appShell/AppShell.js":
/*!**********************************!*\
  !*** ./src/appShell/AppShell.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ \"react-intl\");\n/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/styles */ \"@material-ui/core/styles\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _sidebar_Sidebar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../sidebar/Sidebar */ \"./src/sidebar/Sidebar.js\");\n/* harmony import */ var _appheader_AppHeader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../appheader/AppHeader */ \"./src/appheader/AppHeader.js\");\n/* harmony import */ var _actions_AppActions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../actions/AppActions */ \"./src/actions/AppActions.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\n\n\n\n\n\n\n\n\nvar styleSheet = function styleSheet(theme) {\n  return {\n    dashboardShellContainerOpen: {\n      display: \"grid\",\n      gridTemplateRows: \"64px auto\",\n      gridTemplateColumns: \"240px auto\"\n    },\n    dashboardShellContainerClosed: {\n      display: \"grid\",\n      gridTemplateRows: \"64px auto\",\n      gridTemplateColumns: \"72px auto\"\n    },\n    header: {\n      gridColumn: \"1/3\",\n      gridRow: \"1\",\n      position: \"inherit\",\n      height: '64px'\n    },\n    main: {\n      background: '#eee'\n    }\n  };\n};\n\nvar AppShell =\n/*#__PURE__*/\nfunction (_Component) {\n  _inherits(AppShell, _Component);\n\n  function AppShell(props, context) {\n    var _this;\n\n    _classCallCheck(this, AppShell);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(AppShell).call(this, props));\n    var isOpenCachedValue = window.localStorage.getItem(\"AppShell.isOpen\");\n    _this.state = {\n      isMounted: true,\n      isOpen: isOpenCachedValue ? isOpenCachedValue : true\n    };\n    _this.handleOpenCloseToggle = _this.handleOpenCloseToggle.bind(_assertThisInitialized(_assertThisInitialized(_this)));\n    _this.handleOpenMoreMenu = _this.handleOpenMoreMenu.bind(_assertThisInitialized(_assertThisInitialized(_this)));\n    return _this;\n  }\n\n  _createClass(AppShell, [{\n    key: \"componentWillMount\",\n    value: function componentWillMount() {\n      var _this2 = this;\n\n      this.setState({\n        \"isMounted\": true\n      });\n      _actions_AppActions__WEBPACK_IMPORTED_MODULE_5__[\"default\"].navigateTo.takeWhile(function () {\n        return _this2.state.isMounted;\n      }).subscribe(function (path) {\n        if (path.substring(0, 3) === \"://\") {\n          window.location.href = path.substring(2);\n        } else {\n          this.props.history.push(path);\n        }\n      }.bind(this));\n      _actions_AppActions__WEBPACK_IMPORTED_MODULE_5__[\"default\"].loadClientApps.sink.subscribe(function (data) {\n        if (data) {\n          _this2.setState({\n            \"primaryApps\": data.primaryApps,\n            \"secondaryApps\": data.secondaryApps\n          });\n        }\n      });\n      _actions_AppActions__WEBPACK_IMPORTED_MODULE_5__[\"default\"].loadClientApps.source.next(true);\n    }\n  }, {\n    key: \"componentWillUnmount\",\n    value: function componentWillUnmount() {\n      this.setState({\n        \"isMounted\": false\n      });\n    }\n  }, {\n    key: \"handleOpenMoreMenu\",\n    value: function handleOpenMoreMenu(event) {\n      this.setState({\n        openMoreMenu: true,\n        openMoreMenuAnchorEl: event.currentTarget\n      });\n    }\n  }, {\n    key: \"handleOpenCloseToggle\",\n    value: function handleOpenCloseToggle() {\n      var val = !this.state.isOpen;\n      this.setState({\n        'isOpen': val\n      });\n      window.localStorage.setItem(\"AppShell.isOpen\", val);\n    }\n  }, {\n    key: \"handleLogout\",\n    value: function handleLogout() {\n      window.localStorage.clear(); //UserActions.getUser.sink.next(next);\n\n      _actions_AppActions__WEBPACK_IMPORTED_MODULE_5__[\"default\"].logout.source.next(true);\n      _actions_AppActions__WEBPACK_IMPORTED_MODULE_5__[\"default\"].navigateTo.next(\"://\");\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      var classes = this.props.classes;\n\n      if (!this.props.user) {\n        this.handleLogout();\n        return;\n      }\n\n      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: this.state.isOpen ? classes.dashboardShellContainerOpen : classes.dashboardShellContainerClosed\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"header\", {\n        className: classes.header\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_appheader_AppHeader__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n        apps: this.state.secondaryApps,\n        onToggle: this.handleOpenCloseToggle,\n        onNavClick: function onNavClick(path) {\n          return _actions_AppActions__WEBPACK_IMPORTED_MODULE_5__[\"default\"].navigateTo.next(path);\n        }\n      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_sidebar_Sidebar__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n        user: this.props.user,\n        apps: this.state.primaryApps,\n        secondaryApps: this.state.secondaryApps,\n        open: this.state.isOpen,\n        onNavClick: function onNavClick(path) {\n          return _actions_AppActions__WEBPACK_IMPORTED_MODULE_5__[\"default\"].navigateTo.next(path);\n        }\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: classes.main\n      }, this.props.children));\n    }\n  }]);\n\n  return AppShell;\n}(react__WEBPACK_IMPORTED_MODULE_0__[\"Component\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"injectIntl\"])(Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__[\"withStyles\"])(styleSheet)(AppShell)));\n\n//# sourceURL=webpack:///./src/appShell/AppShell.js?");

/***/ }),

/***/ "./src/appheader/AppHeader.js":
/*!************************************!*\
  !*** ./src/appheader/AppHeader.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ \"react-intl\");\n/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/styles */ \"@material-ui/core/styles\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _material_ui_core_AppBar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/core/AppBar */ \"@material-ui/core/AppBar\");\n/* harmony import */ var _material_ui_core_AppBar__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_AppBar__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _material_ui_core_Toolbar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/core/Toolbar */ \"@material-ui/core/Toolbar\");\n/* harmony import */ var _material_ui_core_Toolbar__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Toolbar__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _material_ui_core_IconButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/core/IconButton */ \"@material-ui/core/IconButton\");\n/* harmony import */ var _material_ui_core_IconButton__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_IconButton__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _material_ui_core_Divider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @material-ui/core/Divider */ \"@material-ui/core/Divider\");\n/* harmony import */ var _material_ui_core_Divider__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Divider__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _material_ui_core_Menu__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material-ui/core/Menu */ \"@material-ui/core/Menu\");\n/* harmony import */ var _material_ui_core_Menu__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Menu__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _material_ui_core_MenuItem__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @material-ui/core/MenuItem */ \"@material-ui/core/MenuItem\");\n/* harmony import */ var _material_ui_core_MenuItem__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_MenuItem__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var _material_ui_icons_MoreVert__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @material-ui/icons//MoreVert */ \"@material-ui/icons//MoreVert\");\n/* harmony import */ var _material_ui_icons_MoreVert__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_MoreVert__WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var _material_ui_icons_Menu__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @material-ui/icons//Menu */ \"@material-ui/icons//Menu\");\n/* harmony import */ var _material_ui_icons_Menu__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_Menu__WEBPACK_IMPORTED_MODULE_10__);\n/* harmony import */ var _material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @material-ui/core/Typography */ \"@material-ui/core/Typography\");\n/* harmony import */ var _material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_11__);\n/* harmony import */ var _actions_AppActions__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../actions/AppActions */ \"./src/actions/AppActions.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\n\n\n\n\n //import Button from '@material-ui/core/Button';\n\n\n\n\n\n\n\n\n\n\n\nvar styleSheet = function styleSheet(theme) {\n  return {\n    root: {\n      width: '100%',\n      height: '64px'\n    },\n    headerContainer: {\n      display: \"grid\",\n      gridTemplateRows: \"auto\",\n      gridTemplateColumns: \"48px auto 48px\"\n    },\n    hamburgerMenu: {\n      display: 'block',\n      gridRow: \"1\",\n      gridColumn: \"1\"\n    },\n    mainSection: {\n      gridRow: \"1\",\n      gridColumn: \"2\"\n    },\n    rightSection: {\n      gridRow: \"2\",\n      gridColumn: \"3\",\n      textAlign: \"right\"\n    },\n    flex: {\n      flex: 1\n    },\n    menuButton: {\n      marginLeft: -12,\n      marginRight: 20\n    },\n    moreButton: {\n      color: '#fff'\n    }\n  };\n};\n\nvar AppHeader =\n/*#__PURE__*/\nfunction (_Component) {\n  _inherits(AppHeader, _Component);\n\n  function AppHeader(props, context) {\n    var _this;\n\n    _classCallCheck(this, AppHeader);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(AppHeader).call(this, props));\n    _this.state = {\n      openMoreMenu: false\n    };\n    _this.handleToggle = _this.handleToggle.bind(_assertThisInitialized(_assertThisInitialized(_this)));\n    _this.handleOpenMoreMenu = _this.handleOpenMoreMenu.bind(_assertThisInitialized(_assertThisInitialized(_this)));\n    _this.handleLogout = _this.handleLogout.bind(_assertThisInitialized(_assertThisInitialized(_this)));\n    return _this;\n  }\n\n  _createClass(AppHeader, [{\n    key: \"handleOpenMoreMenu\",\n    value: function handleOpenMoreMenu(event) {\n      this.setState({\n        openMoreMenu: true,\n        openMoreMenuAnchorEl: event.currentTarget\n      });\n    }\n  }, {\n    key: \"handleToggle\",\n    value: function handleToggle() {\n      if (this.props.onToggle) {\n        this.props.onToggle();\n      }\n    }\n  }, {\n    key: \"handleNavClick\",\n    value: function handleNavClick(path) {\n      if (this.props.onNavClick) {\n        this.props.onNavClick(path);\n      }\n    }\n  }, {\n    key: \"handleMenuClose\",\n    value: function handleMenuClose() {\n      this.setState({\n        \"openMoreMenu\": false\n      });\n    }\n  }, {\n    key: \"handleLogout\",\n    value: function handleLogout() {\n      window.localStorage.clear(); //UserActions.getUser.sink.next(next);\n\n      _actions_AppActions__WEBPACK_IMPORTED_MODULE_12__[\"default\"].logout.source.next(true);\n      _actions_AppActions__WEBPACK_IMPORTED_MODULE_12__[\"default\"].navigateTo.next(\"://\");\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      var _this2 = this;\n\n      var classes = this.props.classes;\n      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_AppBar__WEBPACK_IMPORTED_MODULE_3___default.a, {\n        className: classes.root,\n        position: \"static\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Toolbar__WEBPACK_IMPORTED_MODULE_4___default.a, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_IconButton__WEBPACK_IMPORTED_MODULE_5___default.a, {\n        onClick: this.handleToggle,\n        className: classes.menuButton,\n        \"aria-label\": \"Menu\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_icons_Menu__WEBPACK_IMPORTED_MODULE_10___default.a, {\n        style: {\n          color: 'white'\n        }\n      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_11___default.a, {\n        type: \"title\",\n        color: \"inherit\",\n        className: classes.flex,\n        onClick: function onClick() {\n          return _this2.handleNavClick('://dashboard/index.html');\n        }\n      }, \"Family \", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"i\", null, \"D.A.M\")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_IconButton__WEBPACK_IMPORTED_MODULE_5___default.a, {\n        \"aria-label\": \"More\",\n        \"aria-owns\": this.state.open ? 'long-menu' : null,\n        \"aria-haspopup\": \"true\",\n        onClick: this.handleOpenMoreMenu,\n        className: classes.moreButton\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_icons_MoreVert__WEBPACK_IMPORTED_MODULE_9___default.a, null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Menu__WEBPACK_IMPORTED_MODULE_7___default.a, {\n        id: \"long-menu\",\n        anchorEl: this.state.openMoreMenuAnchorEl,\n        open: this.state.openMoreMenu\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_MenuItem__WEBPACK_IMPORTED_MODULE_8___default.a, {\n        color: \"contrast\",\n        onClick: function onClick() {\n          _this2.handleLogout();\n\n          _this2.handleMenuClose();\n        }\n      }, \"Logout\"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Divider__WEBPACK_IMPORTED_MODULE_6___default.a, null), this.props.apps && this.props.apps.map(function (item) {\n        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_MenuItem__WEBPACK_IMPORTED_MODULE_8___default.a, {\n          key: item.path,\n          color: \"contrast\",\n          onClick: function onClick() {\n            _this2.handleNavClick(item.path);\n\n            _this2.handleMenuClose();\n          }\n        }, item.label);\n      }))));\n    }\n  }]);\n\n  return AppHeader;\n}(react__WEBPACK_IMPORTED_MODULE_0__[\"Component\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"injectIntl\"])(Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__[\"withStyles\"])(styleSheet)(AppHeader)));\n\n//# sourceURL=webpack:///./src/appheader/AppHeader.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _actions_AppActions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions/AppActions */ \"./src/actions/AppActions.js\");\n/* harmony import */ var _actions_AppSettings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions/AppSettings */ \"./src/actions/AppSettings.js\");\n/* harmony import */ var _appheader_AppHeader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./appheader/AppHeader */ \"./src/appheader/AppHeader.js\");\n/* harmony import */ var _appShell_AppShell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./appShell/AppShell */ \"./src/appShell/AppShell.js\");\n/* harmony import */ var _CssGrid_GridContainer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CssGrid/GridContainer */ \"./src/CssGrid/GridContainer.js\");\n/* harmony import */ var _CssGrid_GridItem__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CssGrid/GridItem */ \"./src/CssGrid/GridItem.js\");\n/* harmony import */ var _loadingButton_LoadingButton__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./loadingButton/LoadingButton */ \"./src/loadingButton/LoadingButton.js\");\n/* harmony import */ var _sidebar_Sidebar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./sidebar/Sidebar */ \"./src/sidebar/Sidebar.js\");\n\n\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  AppActions: _actions_AppActions__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  AppSettings: _actions_AppSettings__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  AppHeader: _appheader_AppHeader__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n  AppShell: _appShell_AppShell__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n  GridContainer: _CssGrid_GridContainer__WEBPACK_IMPORTED_MODULE_4__[\"default\"],\n  GridItem: _CssGrid_GridItem__WEBPACK_IMPORTED_MODULE_5__[\"default\"],\n  LoadingButton: _loadingButton_LoadingButton__WEBPACK_IMPORTED_MODULE_6__[\"default\"],\n  Sidebar: _sidebar_Sidebar__WEBPACK_IMPORTED_MODULE_7__[\"default\"]\n});\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/loadingButton/LoadingButton.js":
/*!********************************************!*\
  !*** ./src/loadingButton/LoadingButton.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ \"react-intl\");\n/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/styles */ \"@material-ui/core/styles\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _material_ui_core_CircularProgress__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/core/CircularProgress */ \"@material-ui/core/CircularProgress\");\n/* harmony import */ var _material_ui_core_CircularProgress__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_CircularProgress__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/core/Typography */ \"@material-ui/core/Typography\");\n/* harmony import */ var _material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _material_ui_core_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/core/Button */ \"@material-ui/core/Button\");\n/* harmony import */ var _material_ui_core_Button__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_5__);\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\n\n\n\n\n\n\n\n\nvar styleSheet = function styleSheet(theme) {\n  return {\n    progress: {}\n  };\n};\n\nvar LoadingButton =\n/*#__PURE__*/\nfunction (_Component) {\n  _inherits(LoadingButton, _Component);\n\n  function LoadingButton(props, context) {\n    var _this;\n\n    _classCallCheck(this, LoadingButton);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(LoadingButton).call(this, props));\n    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));\n    return _this;\n  }\n\n  _createClass(LoadingButton, [{\n    key: \"handleClick\",\n    value: function handleClick(e) {\n      console.log(\"loading button click\");\n\n      if (this.props.onClick) {\n        this.props.onClick(e);\n      } else {\n        console.dir(this.props);\n      }\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      var classes = this.props.classes;\n      var styles = {\n        minWidth: '40px',\n        color: \"#fff\"\n      };\n\n      if (this.props.isLoading) {\n        styles['paddingLeft'] = '16px';\n      }\n\n      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_5___default.a, {\n        variant: \"contained\",\n        color: \"primary\",\n        style: {\n          \"height\": '25px',\n          \"padding\": '0px 16px'\n        },\n        onClick: this.handleClick\n      }, this.props.isLoading && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_CircularProgress__WEBPACK_IMPORTED_MODULE_3___default.a, {\n        className: classes.progress,\n        color: \"#fff\",\n        size: 25\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_4___default.a, {\n        style: styles\n      }, this.props.label));\n    }\n  }]);\n\n  return LoadingButton;\n}(react__WEBPACK_IMPORTED_MODULE_0__[\"Component\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"injectIntl\"])(Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__[\"withStyles\"])(styleSheet)(LoadingButton)));\n\n//# sourceURL=webpack:///./src/loadingButton/LoadingButton.js?");

/***/ }),

/***/ "./src/sidebar/Sidebar.js":
/*!********************************!*\
  !*** ./src/sidebar/Sidebar.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ \"react-intl\");\n/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/styles */ \"@material-ui/core/styles\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _material_ui_icons_AccountCircle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/icons//AccountCircle */ \"@material-ui/icons//AccountCircle\");\n/* harmony import */ var _material_ui_icons_AccountCircle__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_AccountCircle__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _material_ui_core_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/core/Button */ \"@material-ui/core/Button\");\n/* harmony import */ var _material_ui_core_Button__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/core/Typography */ \"@material-ui/core/Typography\");\n/* harmony import */ var _material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _material_ui_core_Paper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @material-ui/core/Paper */ \"@material-ui/core/Paper\");\n/* harmony import */ var _material_ui_core_Paper__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Paper__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _material_ui_core_Avatar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material-ui/core/Avatar */ \"@material-ui/core/Avatar\");\n/* harmony import */ var _material_ui_core_Avatar__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Avatar__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _material_ui_core_List__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @material-ui/core/List */ \"@material-ui/core/List\");\n/* harmony import */ var _material_ui_core_List__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_List__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var _material_ui_core_ListItem__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @material-ui/core/ListItem */ \"@material-ui/core/ListItem\");\n/* harmony import */ var _material_ui_core_ListItem__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_ListItem__WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var _material_ui_core_ListItemText__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @material-ui/core/ListItemText */ \"@material-ui/core/ListItemText\");\n/* harmony import */ var _material_ui_core_ListItemText__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_ListItemText__WEBPACK_IMPORTED_MODULE_10__);\n/* harmony import */ var _material_ui_icons_Folder__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @material-ui/icons//Folder */ \"@material-ui/icons//Folder\");\n/* harmony import */ var _material_ui_icons_Folder__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_Folder__WEBPACK_IMPORTED_MODULE_11__);\n/* harmony import */ var _actions_AppActions__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../actions/AppActions */ \"./src/actions/AppActions.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\n\n\n\n //import Button from '@material-ui/core/Button';\n\n\n\n\n\n\n\n\n\n //import PhotoIcon from '@material-ui/icons//Photo';\n\n\n\nvar styleSheet = function styleSheet(theme) {\n  return {\n    sidebarOpen: {\n      width: '240px',\n      height: '100vh',\n      background: '#fff'\n    },\n    sidebarClosed: {\n      width: '72px',\n      height: '100vh',\n      background: '#fff'\n    },\n    sidebarUserInfo: {\n      width: '100%',\n      padding: '8px',\n      display: 'grid',\n      gridGap: '8px',\n      gridTemplateRows: \"auto\",\n      gridTemplateColumns: \"60px auto\"\n    },\n    sidebarUserInfoClosed: {\n      display: 'none'\n    },\n    sidebarProfileIcon: {\n      gridColumn: \"1\",\n      gridRow: \"1\"\n    },\n    sidebarProfileName: {\n      gridColumn: \"2\",\n      gridRow: \"1\",\n      alignSelf: 'center'\n    },\n    sidebarButtons: {\n      gridColumn: \"1/3\",\n      gridRow: \"2\",\n      justifySelf: 'center'\n    },\n    appListsOpen: {\n      display: 'grid',\n      gridGap: '0px',\n      gridTemplateRows: \"24px auto\",\n      gridTemplateColumns: \"auto\",\n      marginTop: '16px'\n    },\n    appListsClosed: {\n      height: '90%',\n      display: 'grid',\n      gridGap: '0px',\n      gridTemplateRows: \"0px auto 72px\",\n      gridTemplateColumns: \"auto\"\n    },\n    openLabel: {\n      display: 'inline'\n    },\n    closedLabel: {\n      display: 'none'\n    }\n  };\n};\n\nvar Sidebar =\n/*#__PURE__*/\nfunction (_Component) {\n  _inherits(Sidebar, _Component);\n\n  function Sidebar(props, context) {\n    var _this;\n\n    _classCallCheck(this, Sidebar);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(Sidebar).call(this, props));\n    _this.handleNavClick = _this.handleNavClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));\n    return _this;\n  }\n\n  _createClass(Sidebar, [{\n    key: \"handleNavClick\",\n    value: function handleNavClick(path) {\n      if (this.props.onNavClick) {\n        this.props.onNavClick(path);\n      }\n    }\n  }, {\n    key: \"handleLogout\",\n    value: function handleLogout() {\n      window.localStorage.clear(); //UserActions.getUser.sink.next(next);\n\n      _actions_AppActions__WEBPACK_IMPORTED_MODULE_12__[\"default\"].logout.source.next(true);\n      _actions_AppActions__WEBPACK_IMPORTED_MODULE_12__[\"default\"].navigateTo.next(\"://\");\n    }\n  }, {\n    key: \"findApp\",\n    value: function findApp(slug, apps) {\n      if (apps) {\n        var _iteratorNormalCompletion = true;\n        var _didIteratorError = false;\n        var _iteratorError = undefined;\n\n        try {\n          for (var _iterator = apps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n            var app = _step.value;\n\n            if (app.slug === slug) {\n              return app;\n            }\n          }\n        } catch (err) {\n          _didIteratorError = true;\n          _iteratorError = err;\n        } finally {\n          try {\n            if (!_iteratorNormalCompletion && _iterator.return != null) {\n              _iterator.return();\n            }\n          } finally {\n            if (_didIteratorError) {\n              throw _iteratorError;\n            }\n          }\n        }\n      }\n\n      return null;\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      var _this2 = this;\n\n      var classes = this.props.classes; //find specific app in the installed list of apps, if it's not installed don't show link\n\n      var profileApp = this.findApp('user_manager', this.props.secondaryApps);\n      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Paper__WEBPACK_IMPORTED_MODULE_6___default.a, {\n        className: this.props.open ? classes.sidebarOpen : classes.sidebarClosed\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Paper__WEBPACK_IMPORTED_MODULE_6___default.a, {\n        className: this.props.open ? classes.sidebarUserInfo : classes.sidebarUserInfoClosed\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: classes.sidebarProfileIcon\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_icons_AccountCircle__WEBPACK_IMPORTED_MODULE_3___default.a, {\n        style: {\n          'width': 60,\n          'height': 60\n        }\n      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: classes.sidebarProfileName\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_5___default.a, {\n        component: \"div\",\n        type: \"title\"\n      }, this.props.user.firstName, \" \", this.props.user.lastName)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: classes.sidebarButtons\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_4___default.a, {\n        onClick: this.handleLogout\n      }, \"Logout\"), profileApp && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_4___default.a, {\n        onClick: function onClick() {\n          return _actions_AppActions__WEBPACK_IMPORTED_MODULE_12__[\"default\"].navigateTo.next(profileApp.path);\n        }\n      }, \"Profile\"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: this.props.open ? classes.appListsOpen : classes.appListsClosed\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        style: {\n          gridColumn: \"1\",\n          gridRow: \"1\"\n        }\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_5___default.a, {\n        type: \"title\",\n        className: this.props.open ? classes.openLabel : classes.closedLabel,\n        style: {\n          'paddingLeft': '16px',\n          paddingTop: '16px',\n          gridColumn: \"1\",\n          gridRow: \"1\"\n        }\n      }, \"Apps\")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_List__WEBPACK_IMPORTED_MODULE_8___default.a, {\n        style: {\n          gridColumn: \"1\",\n          gridRow: \"2\"\n        }\n      }, this.props.apps && this.props.apps.map(function (item) {\n        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_ListItem__WEBPACK_IMPORTED_MODULE_9___default.a, {\n          key: item.path,\n          button: true,\n          onClick: function onClick() {\n            return _this2.handleNavClick(item.path);\n          }\n        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Avatar__WEBPACK_IMPORTED_MODULE_7___default.a, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_icons_Folder__WEBPACK_IMPORTED_MODULE_11___default.a, null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_ListItemText__WEBPACK_IMPORTED_MODULE_10___default.a, {\n          primary: item.label,\n          secondary: \"\",\n          className: _this2.props.open ? classes.openLabel : classes.closedLabel\n        }));\n      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_List__WEBPACK_IMPORTED_MODULE_8___default.a, {\n        style: {\n          gridColumn: \"1\",\n          gridRow: \"3\"\n        },\n        className: !this.props.open ? classes.openLabel : classes.closedLabel\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_ListItem__WEBPACK_IMPORTED_MODULE_9___default.a, {\n        button: true,\n        onClick: function onClick() {\n          return _this2.handleNavClick('://app-usermanager/index.html');\n        }\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Avatar__WEBPACK_IMPORTED_MODULE_7___default.a, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_icons_AccountCircle__WEBPACK_IMPORTED_MODULE_3___default.a, {\n        style: {\n          'width': 48,\n          'height': 48\n        }\n      }))))));\n    }\n  }]);\n\n  return Sidebar;\n}(react__WEBPACK_IMPORTED_MODULE_0__[\"Component\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"injectIntl\"])(Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__[\"withStyles\"])(styleSheet)(Sidebar)));\n\n//# sourceURL=webpack:///./src/sidebar/Sidebar.js?");

/***/ }),

/***/ "@material-ui/core/AppBar":
/*!*******************************************!*\
  !*** external "@material-ui/core/AppBar" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/AppBar\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/AppBar%22?");

/***/ }),

/***/ "@material-ui/core/Avatar":
/*!*******************************************!*\
  !*** external "@material-ui/core/Avatar" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/Avatar\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/Avatar%22?");

/***/ }),

/***/ "@material-ui/core/Button":
/*!*******************************************!*\
  !*** external "@material-ui/core/Button" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/Button\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/Button%22?");

/***/ }),

/***/ "@material-ui/core/CircularProgress":
/*!*****************************************************!*\
  !*** external "@material-ui/core/CircularProgress" ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/CircularProgress\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/CircularProgress%22?");

/***/ }),

/***/ "@material-ui/core/Divider":
/*!********************************************!*\
  !*** external "@material-ui/core/Divider" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/Divider\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/Divider%22?");

/***/ }),

/***/ "@material-ui/core/IconButton":
/*!***********************************************!*\
  !*** external "@material-ui/core/IconButton" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/IconButton\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/IconButton%22?");

/***/ }),

/***/ "@material-ui/core/List":
/*!*****************************************!*\
  !*** external "@material-ui/core/List" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/List\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/List%22?");

/***/ }),

/***/ "@material-ui/core/ListItem":
/*!*********************************************!*\
  !*** external "@material-ui/core/ListItem" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/ListItem\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/ListItem%22?");

/***/ }),

/***/ "@material-ui/core/ListItemText":
/*!*************************************************!*\
  !*** external "@material-ui/core/ListItemText" ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/ListItemText\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/ListItemText%22?");

/***/ }),

/***/ "@material-ui/core/Menu":
/*!*****************************************!*\
  !*** external "@material-ui/core/Menu" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/Menu\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/Menu%22?");

/***/ }),

/***/ "@material-ui/core/MenuItem":
/*!*********************************************!*\
  !*** external "@material-ui/core/MenuItem" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/MenuItem\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/MenuItem%22?");

/***/ }),

/***/ "@material-ui/core/Paper":
/*!******************************************!*\
  !*** external "@material-ui/core/Paper" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/Paper\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/Paper%22?");

/***/ }),

/***/ "@material-ui/core/Toolbar":
/*!********************************************!*\
  !*** external "@material-ui/core/Toolbar" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/Toolbar\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/Toolbar%22?");

/***/ }),

/***/ "@material-ui/core/Typography":
/*!***********************************************!*\
  !*** external "@material-ui/core/Typography" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/Typography\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/Typography%22?");

/***/ }),

/***/ "@material-ui/core/styles":
/*!*******************************************!*\
  !*** external "@material-ui/core/styles" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/styles\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/styles%22?");

/***/ }),

/***/ "@material-ui/icons//AccountCircle":
/*!****************************************************!*\
  !*** external "@material-ui/icons//AccountCircle" ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/icons//AccountCircle\");\n\n//# sourceURL=webpack:///external_%22@material-ui/icons//AccountCircle%22?");

/***/ }),

/***/ "@material-ui/icons//Folder":
/*!*********************************************!*\
  !*** external "@material-ui/icons//Folder" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/icons//Folder\");\n\n//# sourceURL=webpack:///external_%22@material-ui/icons//Folder%22?");

/***/ }),

/***/ "@material-ui/icons//Menu":
/*!*******************************************!*\
  !*** external "@material-ui/icons//Menu" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/icons//Menu\");\n\n//# sourceURL=webpack:///external_%22@material-ui/icons//Menu%22?");

/***/ }),

/***/ "@material-ui/icons//MoreVert":
/*!***********************************************!*\
  !*** external "@material-ui/icons//MoreVert" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/icons//MoreVert\");\n\n//# sourceURL=webpack:///external_%22@material-ui/icons//MoreVert%22?");

/***/ }),

/***/ "prop-types":
/*!*****************************!*\
  !*** external "prop-types" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"prop-types\");\n\n//# sourceURL=webpack:///external_%22prop-types%22?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react\");\n\n//# sourceURL=webpack:///external_%22react%22?");

/***/ }),

/***/ "react-intl":
/*!*****************************!*\
  !*** external "react-intl" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-intl\");\n\n//# sourceURL=webpack:///external_%22react-intl%22?");

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"rxjs\");\n\n//# sourceURL=webpack:///external_%22rxjs%22?");

/***/ }),

/***/ "superagent":
/*!*****************************!*\
  !*** external "superagent" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"superagent\");\n\n//# sourceURL=webpack:///external_%22superagent%22?");

/***/ })

/******/ })));