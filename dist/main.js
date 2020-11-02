/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/pubsub-js/src/pubsub.js":
/*!**********************************************!*\
  !*** ./node_modules/pubsub-js/src/pubsub.js ***!
  \**********************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module.loaded, module.id, module, __webpack_require__.nmd, __webpack_exports__, top-level-this-exports, __webpack_require__.* */
/***/ (function(module, exports, __webpack_require__) {

eval("/* module decorator */ module = __webpack_require__.nmd(module);\n/**\n * Copyright (c) 2010,2011,2012,2013,2014 Morgan Roderick http://roderick.dk\n * License: MIT - http://mrgnrdrck.mit-license.org\n *\n * https://github.com/mroderick/PubSubJS\n */\n\n(function (root, factory){\n    'use strict';\n\n    var PubSub = {};\n    root.PubSub = PubSub;\n\n    var define = root.define;\n\n    factory(PubSub);\n\n    // AMD support\n    if (typeof define === 'function' && define.amd){\n        define(function() { return PubSub; });\n\n        // CommonJS and Node.js module support\n    } else if (true){\n        if (module !== undefined && module.exports) {\n            exports = module.exports = PubSub; // Node.js specific `module.exports`\n        }\n        exports.PubSub = PubSub; // CommonJS module 1.1.1 spec\n        module.exports = exports = PubSub; // CommonJS\n    }\n\n}(( typeof window === 'object' && window ) || this, function (PubSub){\n    'use strict';\n\n    var messages = {},\n        lastUid = -1,\n        ALL_SUBSCRIBING_MSG = '*';\n\n    function hasKeys(obj){\n        var key;\n\n        for (key in obj){\n            if ( obj.hasOwnProperty(key) ){\n                return true;\n            }\n        }\n        return false;\n    }\n\n    /**\n     * Returns a function that throws the passed exception, for use as argument for setTimeout\n     * @alias throwException\n     * @function\n     * @param { Object } ex An Error object\n     */\n    function throwException( ex ){\n        return function reThrowException(){\n            throw ex;\n        };\n    }\n\n    function callSubscriberWithDelayedExceptions( subscriber, message, data ){\n        try {\n            subscriber( message, data );\n        } catch( ex ){\n            setTimeout( throwException( ex ), 0);\n        }\n    }\n\n    function callSubscriberWithImmediateExceptions( subscriber, message, data ){\n        subscriber( message, data );\n    }\n\n    function deliverMessage( originalMessage, matchedMessage, data, immediateExceptions ){\n        var subscribers = messages[matchedMessage],\n            callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,\n            s;\n\n        if ( !messages.hasOwnProperty( matchedMessage ) ) {\n            return;\n        }\n\n        for (s in subscribers){\n            if ( subscribers.hasOwnProperty(s)){\n                callSubscriber( subscribers[s], originalMessage, data );\n            }\n        }\n    }\n\n    function createDeliveryFunction( message, data, immediateExceptions ){\n        return function deliverNamespaced(){\n            var topic = String( message ),\n                position = topic.lastIndexOf( '.' );\n\n            // deliver the message as it is now\n            deliverMessage(message, message, data, immediateExceptions);\n\n            // trim the hierarchy and deliver message to each level\n            while( position !== -1 ){\n                topic = topic.substr( 0, position );\n                position = topic.lastIndexOf('.');\n                deliverMessage( message, topic, data, immediateExceptions );\n            }\n\n            deliverMessage(message, ALL_SUBSCRIBING_MSG, data, immediateExceptions);\n        };\n    }\n\n    function hasDirectSubscribersFor( message ) {\n        var topic = String( message ),\n            found = Boolean(messages.hasOwnProperty( topic ) && hasKeys(messages[topic]));\n\n        return found;\n    }\n\n    function messageHasSubscribers( message ){\n        var topic = String( message ),\n            found = hasDirectSubscribersFor(topic) || hasDirectSubscribersFor(ALL_SUBSCRIBING_MSG),\n            position = topic.lastIndexOf( '.' );\n\n        while ( !found && position !== -1 ){\n            topic = topic.substr( 0, position );\n            position = topic.lastIndexOf( '.' );\n            found = hasDirectSubscribersFor(topic);\n        }\n\n        return found;\n    }\n\n    function publish( message, data, sync, immediateExceptions ){\n        message = (typeof message === 'symbol') ? message.toString() : message;\n\n        var deliver = createDeliveryFunction( message, data, immediateExceptions ),\n            hasSubscribers = messageHasSubscribers( message );\n\n        if ( !hasSubscribers ){\n            return false;\n        }\n\n        if ( sync === true ){\n            deliver();\n        } else {\n            setTimeout( deliver, 0 );\n        }\n        return true;\n    }\n\n    /**\n     * Publishes the message, passing the data to it's subscribers\n     * @function\n     * @alias publish\n     * @param { String } message The message to publish\n     * @param {} data The data to pass to subscribers\n     * @return { Boolean }\n     */\n    PubSub.publish = function( message, data ){\n        return publish( message, data, false, PubSub.immediateExceptions );\n    };\n\n    /**\n     * Publishes the message synchronously, passing the data to it's subscribers\n     * @function\n     * @alias publishSync\n     * @param { String } message The message to publish\n     * @param {} data The data to pass to subscribers\n     * @return { Boolean }\n     */\n    PubSub.publishSync = function( message, data ){\n        return publish( message, data, true, PubSub.immediateExceptions );\n    };\n\n    /**\n     * Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe\n     * @function\n     * @alias subscribe\n     * @param { String } message The message to subscribe to\n     * @param { Function } func The function to call when a new message is published\n     * @return { String }\n     */\n    PubSub.subscribe = function( message, func ){\n        if ( typeof func !== 'function'){\n            return false;\n        }\n\n        message = (typeof message === 'symbol') ? message.toString() : message;\n\n        // message is not registered yet\n        if ( !messages.hasOwnProperty( message ) ){\n            messages[message] = {};\n        }\n\n        // forcing token as String, to allow for future expansions without breaking usage\n        // and allow for easy use as key names for the 'messages' object\n        var token = 'uid_' + String(++lastUid);\n        messages[message][token] = func;\n        \n        // return token for unsubscribing\n        return token;\n    };\n\n    PubSub.subscribeAll = function( func ){\n        return PubSub.subscribe(ALL_SUBSCRIBING_MSG, func);\n    };\n\n    /**\n     * Subscribes the passed function to the passed message once\n     * @function\n     * @alias subscribeOnce\n     * @param { String } message The message to subscribe to\n     * @param { Function } func The function to call when a new message is published\n     * @return { PubSub }\n     */\n    PubSub.subscribeOnce = function( message, func ){\n        var token = PubSub.subscribe( message, function(){\n            // before func apply, unsubscribe message\n            PubSub.unsubscribe( token );\n            func.apply( this, arguments );\n        });\n        return PubSub;\n    };\n\n    /**\n     * Clears all subscriptions\n     * @function\n     * @public\n     * @alias clearAllSubscriptions\n     */\n    PubSub.clearAllSubscriptions = function clearAllSubscriptions(){\n        messages = {};\n    };\n\n    /**\n     * Clear subscriptions by the topic\n     * @function\n     * @public\n     * @alias clearAllSubscriptions\n     * @return { int }\n     */\n    PubSub.clearSubscriptions = function clearSubscriptions(topic){\n        var m;\n        for (m in messages){\n            if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0){\n                delete messages[m];\n            }\n        }\n    };\n\n    /** \n       Count subscriptions by the topic\n     * @function\n     * @public\n     * @alias countSubscriptions\n     * @return { Array }\n    */\n    PubSub.countSubscriptions = function countSubscriptions(topic){\n        var m;\n        var count = 0;\n        for (m in messages){\n            if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0){\n                count++;\n            }\n        }\n        return count;\n    };\n\n    \n    /** \n       Gets subscriptions by the topic\n     * @function\n     * @public\n     * @alias getSubscriptions\n    */\n    PubSub.getSubscriptions = function getSubscriptions(topic){\n        var m;\n        var list = [];\n        for (m in messages){\n            if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0){\n                list.push(m);\n            }\n        }\n        return list;\n    };\n\n    /**\n     * Removes subscriptions\n     *\n     * - When passed a token, removes a specific subscription.\n     *\n\t * - When passed a function, removes all subscriptions for that function\n     *\n\t * - When passed a topic, removes all subscriptions for that topic (hierarchy)\n     * @function\n     * @public\n     * @alias subscribeOnce\n     * @param { String | Function } value A token, function or topic to unsubscribe from\n     * @example // Unsubscribing with a token\n     * var token = PubSub.subscribe('mytopic', myFunc);\n     * PubSub.unsubscribe(token);\n     * @example // Unsubscribing with a function\n     * PubSub.unsubscribe(myFunc);\n     * @example // Unsubscribing from a topic\n     * PubSub.unsubscribe('mytopic');\n     */\n    PubSub.unsubscribe = function(value){\n        var descendantTopicExists = function(topic) {\n                var m;\n                for ( m in messages ){\n                    if ( messages.hasOwnProperty(m) && m.indexOf(topic) === 0 ){\n                        // a descendant of the topic exists:\n                        return true;\n                    }\n                }\n\n                return false;\n            },\n            isTopic    = typeof value === 'string' && ( messages.hasOwnProperty(value) || descendantTopicExists(value) ),\n            isToken    = !isTopic && typeof value === 'string',\n            isFunction = typeof value === 'function',\n            result = false,\n            m, message, t;\n\n        if (isTopic){\n            PubSub.clearSubscriptions(value);\n            return;\n        }\n\n        for ( m in messages ){\n            if ( messages.hasOwnProperty( m ) ){\n                message = messages[m];\n\n                if ( isToken && message[value] ){\n                    delete message[value];\n                    result = value;\n                    // tokens are unique, so we can just stop here\n                    break;\n                }\n\n                if (isFunction) {\n                    for ( t in message ){\n                        if (message.hasOwnProperty(t) && message[t] === value){\n                            delete message[t];\n                            result = true;\n                        }\n                    }\n                }\n            }\n        }\n\n        return result;\n    };\n}));\n\n\n//# sourceURL=webpack://todo-list/./node_modules/pubsub-js/src/pubsub.js?");

/***/ }),

/***/ "./src/displayController.js":
/*!**********************************!*\
  !*** ./src/displayController.js ***!
  \**********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _src_eventHub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../src/eventHub.js */ \"./src/eventHub.js\");\n/* harmony import */ var _src_util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../src/util.js */ \"./src/util.js\");\n/* harmony import */ var _src_project_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../src/project.js */ \"./src/project.js\");\n\n\n\n\nconst DisplayController = (() => {\n\n    //Store references to relevant elements\n    const todoTitle = document.getElementById(\"todoTitle\");\n    const todoDescription = document.getElementById(\"todoDescription\");\n    const todoDueDate = document.getElementById(\"todoDueDate\");\n    const todoCategory = document.getElementById(\"todoCategory\");\n    const todoProject = document.getElementById(\"todoProject\");\n    const projectTitle = document.getElementById(\"projectTitle\");\n    const projectCategory = document.getElementById(\"projectCategory\");\n    const projectTodos = document.getElementById(\"projectTodos\");\n    const addTodo = document.getElementById(\"addTodo\");\n    const addProject = document.getElementById(\"addProject\");\n\n    //Initialise event listeners and elements on page load\n    const initialise = () => {\n\n        addTodo.addEventListener(\"click\", () => {\n            PubSub.publish(_src_eventHub_js__WEBPACK_IMPORTED_MODULE_0__.default.topics.CREATE_TODO, getTodoProperties());\n        });\n\n        addProject.addEventListener(\"click\", () => {\n            PubSub.publish(_src_eventHub_js__WEBPACK_IMPORTED_MODULE_0__.default.topics.CREATE_PROJECT, getProjectProperties());\n        });\n    };\n\n    //Get the properties of a todo to be created from inputs on the page\n    const getTodoProperties = () => {\n        return {\n            title: todoTitle.value,\n            description: todoDescription.value,\n            dueDate: todoDueDate.value,\n            category: todoCategory.value,\n            project: _src_project_js__WEBPACK_IMPORTED_MODULE_1__.default.getProjectByTitle(todoProject.value)\n        }\n    };\n\n    //Get the properties of a project to be created from inputs on the page\n    const getProjectProperties = () => {\n        return {\n            title: projectTitle.value,\n            category: projectCategory.value,\n            todos: projectTodos.value\n        }\n    };\n\n    //Push a project to the selection dropdown list\n    const pushToProjectList = (msg, project) => {\n        (0,_src_util_js__WEBPACK_IMPORTED_MODULE_2__.create)({\n            type: \"option\",\n            parent: todoProject,\n            textContent: project.getTitle(),\n            val: project.getTitle()\n        });\n    };\n\n    //Display a created todo on the page\n    function displayTodo(msg, todo) {\n        //For testing only. Need to get a reference to the correct element for a Todo's project.\n        const parentProject = todo.getProject().getDisplayElement();\n        const todoElement = (0,_src_util_js__WEBPACK_IMPORTED_MODULE_2__.create)({\n            type: \"div\",\n            cl: \"todo\",\n            parent: parentProject\n        });\n        const todoHeader = (0,_src_util_js__WEBPACK_IMPORTED_MODULE_2__.create)({\n            type: \"div\",\n            cl: \"todoHeader\",\n            parent: todoElement\n        });\n        const todoTitle = (0,_src_util_js__WEBPACK_IMPORTED_MODULE_2__.create)({\n            type: \"p\",\n            cl: \"todoTitle\",\n            textContent: `Title: ${todo.getTitle()}`,\n            parent: todoHeader\n        });\n        const todoDescription = (0,_src_util_js__WEBPACK_IMPORTED_MODULE_2__.create)({\n            type: \"p\",\n            cl: \"todoDescription\",\n            textContent: `Description: ${todo.getDescription()}`,\n            parent: todoHeader\n        });\n        const todoBody = (0,_src_util_js__WEBPACK_IMPORTED_MODULE_2__.create)({\n            type: \"div\",\n            cl: \"todoBody\",\n            parent: todoElement\n        });\n        const todoDueDate = (0,_src_util_js__WEBPACK_IMPORTED_MODULE_2__.create)({\n            type: \"p\",\n            cl: \"todoDueDate\",\n            textContent: `Due date: ${todo.getDueDate()}`,\n            parent: todoBody\n        });\n        const todoCategory = (0,_src_util_js__WEBPACK_IMPORTED_MODULE_2__.create)({\n            type: \"p\",\n            cl: \"todoCategory\",\n            textContent: `Category: ${todo.getCategory()}`,\n            parent: todoBody\n        });\n    }\n\n    //Display a created project on the page\n    function displayProject(msg, project) {\n        //Move this is projectContainer is to be kept permanently\n        const projectContainer = document.getElementById(\"projectContainer\");\n        const projectElement = (0,_src_util_js__WEBPACK_IMPORTED_MODULE_2__.create)({\n            type: \"div\",\n            cl: \"project\",\n            parent: projectContainer\n        });\n        const projectHeader = (0,_src_util_js__WEBPACK_IMPORTED_MODULE_2__.create)({\n            type: \"div\",\n            cl: \"projectHeader\",\n            parent: projectElement\n        });\n        const projectTitle = (0,_src_util_js__WEBPACK_IMPORTED_MODULE_2__.create)({\n            type: \"div\",\n            cl: \"projectTitle\",\n            textContent: `TITLE: ${project.getTitle()}`,\n            parent: projectHeader\n        });\n        const projectCategory = (0,_src_util_js__WEBPACK_IMPORTED_MODULE_2__.create)({\n            type: \"div\",\n            cl: \"projectCategory\",\n            textContent: `CATEGORY: ${project.getCategory()}`,\n            parent: projectHeader\n        });\n        //Link the element to its corresponding project\n        project.setDisplayElement(projectElement);\n    }\n\n    return {initialise, pushToProjectList, displayTodo, displayProject};\n})();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DisplayController);\n\n//# sourceURL=webpack://todo-list/./src/displayController.js?");

/***/ }),

/***/ "./src/eventHub.js":
/*!*************************!*\
  !*** ./src/eventHub.js ***!
  \*************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _displayController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./displayController */ \"./src/displayController.js\");\n/* harmony import */ var _src_project_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../src/project.js */ \"./src/project.js\");\n/* harmony import */ var _src_todo_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../src/todo.js */ \"./src/todo.js\");\n\n\n\n\n\nconst EventHub = (() => {\n    const topics = {};\n    const tokens = {};\n\n    topics.CREATE_TODO = \"Create todo\";\n    tokens.createTodo = PubSub.subscribe(topics.CREATE_TODO, _src_todo_js__WEBPACK_IMPORTED_MODULE_2__.default.createTodo);\n\n    topics.CREATE_PROJECT = \"Create project\";\n    tokens.createProject = PubSub.subscribe(topics.CREATE_PROJECT, _src_project_js__WEBPACK_IMPORTED_MODULE_1__.default.createProject);\n\n    topics.PUSH_PROJECT = \"Push project\";\n    tokens.pushToProjectList = PubSub.subscribe(topics.PUSH_PROJECT, _displayController__WEBPACK_IMPORTED_MODULE_0__.default.pushToProjectList);\n    tokens.displayProject = PubSub.subscribe(topics.PUSH_PROJECT, _displayController__WEBPACK_IMPORTED_MODULE_0__.default.displayProject);\n\n    topics.PUSH_TODO = \"Push todo\";\n    tokens.displayTodo = PubSub.subscribe(topics.PUSH_TODO, _displayController__WEBPACK_IMPORTED_MODULE_0__.default.displayTodo);\n    \n    return {topics, tokens};\n})();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EventHub);\n\n//# sourceURL=webpack://todo-list/./src/eventHub.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var pubsub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pubsub-js */ \"./node_modules/pubsub-js/src/pubsub.js\");\n/* harmony import */ var pubsub_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pubsub_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _src_eventHub_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../src/eventHub.js */ \"./src/eventHub.js\");\n/* harmony import */ var _src_displayController_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../src/displayController.js */ \"./src/displayController.js\");\n/* harmony import */ var _project__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./project */ \"./src/project.js\");\n\n\n\n\n\n//For development purposes\n(pubsub_js__WEBPACK_IMPORTED_MODULE_0___default().immediateExceptions) = true;\n\n_src_displayController_js__WEBPACK_IMPORTED_MODULE_2__.default.initialise();\n_project__WEBPACK_IMPORTED_MODULE_3__.default.initialise();\n\n\n//# sourceURL=webpack://todo-list/./src/index.js?");

/***/ }),

/***/ "./src/project.js":
/*!************************!*\
  !*** ./src/project.js ***!
  \************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _src_eventHub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../src/eventHub.js */ \"./src/eventHub.js\");\n\n\nfunction Project({title, category, todos}) {\n    title = title || nameUntitled();\n    category = category || false;\n    todos = todos || [];\n    let displayElement;\n\n    function getTitle() {\n        return title;\n    }\n    function setTitle(arg) {\n        title = arg;\n    }\n    function getCategory() {\n        return category;\n    }\n    function setCategory(arg) {\n        category = arg;\n    }\n    function getTodos() {\n        return todos;\n    }\n    function addTodo(todo) {\n        todos.push(todo);\n        return todos;\n    }\n    function setDisplayElement(element) {\n        displayElement = element;\n    }\n    function getDisplayElement(element) {\n        return displayElement;\n    }\n\n    //If project title is a duplicate, throw error and return false\n    if(checkDuplicates(title)) {\n        console.log(\"Error! That name is taken.\");\n        return false;\n    }\n\n    //Check for projects with duplicate titles\n    function checkDuplicates(inputTitle) {\n        for (const project of ProjectManager.getProjects()) {\n            if(inputTitle === project.getTitle()) {\n                return true;\n            }\n        }\n        return false;\n    }\n\n    //Consecutively number \"Untitled\" projects\n    function nameUntitled() {\n        let count = 2;\n        const baseTitle = \"Untitled\";\n        let title = baseTitle;\n        while(checkDuplicates(title)) {\n            title = `${baseTitle} ${count}`;\n            count += 1;\n        }\n        return title;\n    }\n\n    //Log the project details for debugging\n    // console.log({title, category, todos});\n    return {getTitle, setTitle, getCategory, setCategory, getTodos, addTodo, setDisplayElement, getDisplayElement};\n}\n\nconst ProjectManager = (() => {\n    //An array of all existing projects\n    const projects = [];\n\n    //Get the array of projects\n    function getProjects() {\n        return projects;\n    }\n\n    //Find a project by title (exact match, assumes titles are unique)\n    function getProjectByTitle(title) {\n        for(const project of projects) {\n            if(project.getTitle() === title) {\n                return project;\n            }\n        }\n        return false;\n    }\n\n    //Creates a new project and pushes it to the array when notified\n    function createProject(msg, data) {\n        const project = Project(data);\n        //Return false if project creation throws an error and returns false\n        if(project === false) {\n            return false;\n        }\n        projects.push(project);\n        PubSub.publish(_src_eventHub_js__WEBPACK_IMPORTED_MODULE_0__.default.topics.PUSH_PROJECT, project);\n        return project;\n    }\n\n    //Initialise a default project for uncategorised todos\n    function initialise() {\n        PubSub.publish(_src_eventHub_js__WEBPACK_IMPORTED_MODULE_0__.default.topics.CREATE_PROJECT, {title: \"Uncategorised\"});\n    }\n    \n    return {createProject, getProjects, initialise, getProjectByTitle};\n})();\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProjectManager);\n\n//# sourceURL=webpack://todo-list/./src/project.js?");

/***/ }),

/***/ "./src/todo.js":
/*!*********************!*\
  !*** ./src/todo.js ***!
  \*********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _src_eventHub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../src/eventHub.js */ \"./src/eventHub.js\");\n\n\nfunction Todo({title, description, dueDate, category, project}) {\n    \n    title = title || \"Untitled\";\n    description = description || \"No description\"; //For testing, default should otherwise be blank\n    dueDate = dueDate || false;\n    category = category || false;\n    project = project || false; //All Todos should have a project, so need error handling for this\n\n    function getTitle() {\n        return title;\n    }\n    function setTitle(arg) {\n        title = arg;\n    }\n    function getDescription() {\n        return description;\n    }\n    function setDescription(arg) {\n        description = arg;\n    }\n    function getDueDate() {\n        return dueDate;\n    }\n    function setDueDate(arg) {\n        dueDate = arg;\n    }\n    function getCategory() {\n        return category;\n    }\n    function setCategory(arg) {\n        category = arg;\n    }\n    function getProject() {\n        return project;\n    }\n    function setProject(arg) {\n        project = arg;\n    }\n    //Log the todo details for debugging\n    // console.log({title, description, dueDate, category, project});\n    return {getTitle, setTitle, getDescription, setDescription, getDueDate, setDueDate, getCategory, setCategory, getProject, setProject};\n}\n\nconst TodoManager = (() => {\n    //An array of all existing todos\n    const todos = [];\n\n    //Get the array of todos\n    function getTodos() {\n        return todos;\n    }\n\n    //A subscriber function to create a todo when notified\n    function createTodo(msg, data) {\n        const todo = Todo(data);\n        todos.push(todo);\n        PubSub.publish(_src_eventHub_js__WEBPACK_IMPORTED_MODULE_0__.default.topics.PUSH_TODO, todo);\n        return todo;\n    }\n\n    return {createTodo, getTodos};\n})();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TodoManager);\n\n//# sourceURL=webpack://todo-list/./src/todo.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! namespace exports */
/*! export clearChildren [provided] [no usage info] [missing usage info prevents renaming] */
/*! export create [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"clearChildren\": () => /* binding */ clearChildren,\n/* harmony export */   \"create\": () => /* binding */ create\n/* harmony export */ });\n//Create a node with given properties\nfunction create({type, id, cl, src, textContent, eventListener, val, parent}) {\n    const element = document.createElement(type);\n    setID(element, id);\n    setCl(element, cl);\n    setSrc(element, src);\n    setTextContent(element, textContent);\n    setVal(element, val),\n    addEL(element, eventListener);\n\n    parent.appendChild(element);\n    return element;\n}\n\nfunction setID(element, id) {\n    if(id !== undefined) {\n        element.setAttribute(\"id\", id);\n    }\n}\n\nfunction setCl(element, cl) {\n    if(cl !== undefined) {\n        element.setAttribute(\"class\", cl);\n    }\n}\n\nfunction setTextContent(element, textContent) {\n    if(textContent !== undefined) {\n        element.textContent = textContent;\n    }\n}\n\nfunction setSrc(element, src) {\n    if(src !== undefined) {\n        element.setAttribute(\"src\", src);\n    }\n}\n\nfunction setVal(element, val) {\n    if(val !== undefined) {\n        element.setAttribute(\"value\", val);\n    }\n}\n\nfunction addEL(element, eventListener) {\n    if(eventListener !== undefined) {\n        element.addEventListener(eventListener.type, eventListener.callback);\n    }\n}\n\n//Delete all children of a node\nfunction clearChildren(node) {\n    node.querySelectorAll(\"*\").forEach(child => {\n        child.remove();\n    });\n}\n\n\n\n//# sourceURL=webpack://todo-list/./src/util.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;