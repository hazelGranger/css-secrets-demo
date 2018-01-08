/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "ff7817e312abd05321a0"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
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
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "https://hazelgranger.github.io/css-secrets-demo/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(10)(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(27)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./img/pokemon46344874704d804bd7ee43417cb3ee23.jpg";

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/*!
 * Vue.js v2.5.8
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
!function(e,t){ true?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Vue=t()}(this,function(){"use strict";function e(e){return void 0===e||null===e}function t(e){return void 0!==e&&null!==e}function n(e){return!0===e}function r(e){return!1===e}function i(e){return"string"==typeof e||"number"==typeof e||"boolean"==typeof e}function o(e){return null!==e&&"object"==typeof e}function a(e){return"[object Object]"===Si.call(e)}function s(e){return"[object RegExp]"===Si.call(e)}function c(e){var t=parseFloat(String(e));return t>=0&&Math.floor(t)===t&&isFinite(e)}function u(e){return null==e?"":"object"==typeof e?JSON.stringify(e,null,2):String(e)}function l(e){var t=parseFloat(e);return isNaN(t)?e:t}function f(e,t){for(var n=Object.create(null),r=e.split(","),i=0;i<r.length;i++)n[r[i]]=!0;return t?function(e){return n[e.toLowerCase()]}:function(e){return n[e]}}function d(e,t){if(e.length){var n=e.indexOf(t);if(n>-1)return e.splice(n,1)}}function p(e,t){return ji.call(e,t)}function v(e){var t=Object.create(null);return function(n){return t[n]||(t[n]=e(n))}}function h(e,t){function n(n){var r=arguments.length;return r?r>1?e.apply(t,arguments):e.call(t,n):e.call(t)}return n._length=e.length,n}function m(e,t){t=t||0;for(var n=e.length-t,r=new Array(n);n--;)r[n]=e[n+t];return r}function y(e,t){for(var n in t)e[n]=t[n];return e}function g(e){for(var t={},n=0;n<e.length;n++)e[n]&&y(t,e[n]);return t}function _(e,t,n){}function b(e,t){if(e===t)return!0;var n=o(e),r=o(t);if(!n||!r)return!n&&!r&&String(e)===String(t);try{var i=Array.isArray(e),a=Array.isArray(t);if(i&&a)return e.length===t.length&&e.every(function(e,n){return b(e,t[n])});if(i||a)return!1;var s=Object.keys(e),c=Object.keys(t);return s.length===c.length&&s.every(function(n){return b(e[n],t[n])})}catch(e){return!1}}function $(e,t){for(var n=0;n<e.length;n++)if(b(e[n],t))return n;return-1}function C(e){var t=!1;return function(){t||(t=!0,e.apply(this,arguments))}}function w(e){var t=(e+"").charCodeAt(0);return 36===t||95===t}function x(e,t,n,r){Object.defineProperty(e,t,{value:n,enumerable:!!r,writable:!0,configurable:!0})}function k(e){if(!Vi.test(e)){var t=e.split(".");return function(e){for(var n=0;n<t.length;n++){if(!e)return;e=e[t[n]]}return e}}}function A(e){return"function"==typeof e&&/native code/.test(e.toString())}function O(e){lo.target&&fo.push(lo.target),lo.target=e}function S(){lo.target=fo.pop()}function T(e){return new po(void 0,void 0,void 0,String(e))}function E(e,t){var n=e.componentOptions,r=new po(e.tag,e.data,e.children,e.text,e.elm,e.context,n,e.asyncFactory);return r.ns=e.ns,r.isStatic=e.isStatic,r.key=e.key,r.isComment=e.isComment,r.isCloned=!0,t&&(e.children&&(r.children=j(e.children,!0)),n&&n.children&&(n.children=j(n.children,!0))),r}function j(e,t){for(var n=e.length,r=new Array(n),i=0;i<n;i++)r[i]=E(e[i],t);return r}function N(e,t,n){e.__proto__=t}function L(e,t,n){for(var r=0,i=n.length;r<i;r++){var o=n[r];x(e,o,t[o])}}function I(e,t){if(o(e)&&!(e instanceof po)){var n;return p(e,"__ob__")&&e.__ob__ instanceof bo?n=e.__ob__:_o.shouldConvert&&!oo()&&(Array.isArray(e)||a(e))&&Object.isExtensible(e)&&!e._isVue&&(n=new bo(e)),t&&n&&n.vmCount++,n}}function M(e,t,n,r,i){var o=new lo,a=Object.getOwnPropertyDescriptor(e,t);if(!a||!1!==a.configurable){var s=a&&a.get,c=a&&a.set,u=!i&&I(n);Object.defineProperty(e,t,{enumerable:!0,configurable:!0,get:function(){var t=s?s.call(e):n;return lo.target&&(o.depend(),u&&(u.dep.depend(),Array.isArray(t)&&F(t))),t},set:function(t){var r=s?s.call(e):n;t===r||t!==t&&r!==r||(c?c.call(e,t):n=t,u=!i&&I(t),o.notify())}})}}function D(e,t,n){if(Array.isArray(e)&&c(t))return e.length=Math.max(e.length,t),e.splice(t,1,n),n;if(t in e&&!(t in Object.prototype))return e[t]=n,n;var r=e.__ob__;return e._isVue||r&&r.vmCount?n:r?(M(r.value,t,n),r.dep.notify(),n):(e[t]=n,n)}function P(e,t){if(Array.isArray(e)&&c(t))e.splice(t,1);else{var n=e.__ob__;e._isVue||n&&n.vmCount||p(e,t)&&(delete e[t],n&&n.dep.notify())}}function F(e){for(var t=void 0,n=0,r=e.length;n<r;n++)(t=e[n])&&t.__ob__&&t.__ob__.dep.depend(),Array.isArray(t)&&F(t)}function R(e,t){if(!t)return e;for(var n,r,i,o=Object.keys(t),s=0;s<o.length;s++)r=e[n=o[s]],i=t[n],p(e,n)?a(r)&&a(i)&&R(r,i):D(e,n,i);return e}function H(e,t,n){return n?function(){var r="function"==typeof t?t.call(n):t,i="function"==typeof e?e.call(n):e;return r?R(r,i):i}:t?e?function(){return R("function"==typeof t?t.call(this):t,"function"==typeof e?e.call(this):e)}:t:e}function B(e,t){return t?e?e.concat(t):Array.isArray(t)?t:[t]:e}function U(e,t,n,r){var i=Object.create(e||null);return t?y(i,t):i}function V(e,t){var n=e.props;if(n){var r,i,o={};if(Array.isArray(n))for(r=n.length;r--;)"string"==typeof(i=n[r])&&(o[Li(i)]={type:null});else if(a(n))for(var s in n)i=n[s],o[Li(s)]=a(i)?i:{type:i};e.props=o}}function z(e,t){var n=e.inject,r=e.inject={};if(Array.isArray(n))for(var i=0;i<n.length;i++)r[n[i]]={from:n[i]};else if(a(n))for(var o in n){var s=n[o];r[o]=a(s)?y({from:o},s):{from:s}}}function K(e){var t=e.directives;if(t)for(var n in t){var r=t[n];"function"==typeof r&&(t[n]={bind:r,update:r})}}function J(e,t,n){function r(r){var i=$o[r]||xo;c[r]=i(e[r],t[r],n,r)}"function"==typeof t&&(t=t.options),V(t,n),z(t,n),K(t);var i=t.extends;if(i&&(e=J(e,i,n)),t.mixins)for(var o=0,a=t.mixins.length;o<a;o++)e=J(e,t.mixins[o],n);var s,c={};for(s in e)r(s);for(s in t)p(e,s)||r(s);return c}function q(e,t,n,r){if("string"==typeof n){var i=e[t];if(p(i,n))return i[n];var o=Li(n);if(p(i,o))return i[o];var a=Ii(o);if(p(i,a))return i[a];var s=i[n]||i[o]||i[a];return s}}function W(e,t,n,r){var i=t[e],o=!p(n,e),a=n[e];if(X(Boolean,i.type)&&(o&&!p(i,"default")?a=!1:X(String,i.type)||""!==a&&a!==Di(e)||(a=!0)),void 0===a){a=G(r,i,e);var s=_o.shouldConvert;_o.shouldConvert=!0,I(a),_o.shouldConvert=s}return a}function G(e,t,n){if(p(t,"default")){var r=t.default;return e&&e.$options.propsData&&void 0===e.$options.propsData[n]&&void 0!==e._props[n]?e._props[n]:"function"==typeof r&&"Function"!==Z(t.type)?r.call(e):r}}function Z(e){var t=e&&e.toString().match(/^\s*function (\w+)/);return t?t[1]:""}function X(e,t){if(!Array.isArray(t))return Z(t)===Z(e);for(var n=0,r=t.length;n<r;n++)if(Z(t[n])===Z(e))return!0;return!1}function Y(e,t,n){if(t)for(var r=t;r=r.$parent;){var i=r.$options.errorCaptured;if(i)for(var o=0;o<i.length;o++)try{if(!1===i[o].call(r,e,t,n))return}catch(e){Q(e,r,"errorCaptured hook")}}Q(e,t,n)}function Q(e,t,n){if(Ui.errorHandler)try{return Ui.errorHandler.call(null,e,t,n)}catch(e){ee(e,null,"config.errorHandler")}ee(e,t,n)}function ee(e,t,n){if(!Ki&&!Ji||"undefined"==typeof console)throw e;console.error(e)}function te(){Ao=!1;var e=ko.slice(0);ko.length=0;for(var t=0;t<e.length;t++)e[t]()}function ne(e){return e._withTask||(e._withTask=function(){Oo=!0;var t=e.apply(null,arguments);return Oo=!1,t})}function re(e,t){var n;if(ko.push(function(){if(e)try{e.call(t)}catch(e){Y(e,t,"nextTick")}else n&&n(t)}),Ao||(Ao=!0,Oo?wo():Co()),!e&&"undefined"!=typeof Promise)return new Promise(function(e){n=e})}function ie(e){oe(e,No),No.clear()}function oe(e,t){var n,r,i=Array.isArray(e);if((i||o(e))&&!Object.isFrozen(e)){if(e.__ob__){var a=e.__ob__.dep.id;if(t.has(a))return;t.add(a)}if(i)for(n=e.length;n--;)oe(e[n],t);else for(n=(r=Object.keys(e)).length;n--;)oe(e[r[n]],t)}}function ae(e){function t(){var e=arguments,n=t.fns;if(!Array.isArray(n))return n.apply(null,arguments);for(var r=n.slice(),i=0;i<r.length;i++)r[i].apply(null,e)}return t.fns=e,t}function se(t,n,r,i,o){var a,s,c,u;for(a in t)s=t[a],c=n[a],u=Lo(a),e(s)||(e(c)?(e(s.fns)&&(s=t[a]=ae(s)),r(u.name,s,u.once,u.capture,u.passive)):s!==c&&(c.fns=s,t[a]=c));for(a in n)e(t[a])&&i((u=Lo(a)).name,n[a],u.capture)}function ce(r,i,o){function a(){o.apply(this,arguments),d(s.fns,a)}r instanceof po&&(r=r.data.hook||(r.data.hook={}));var s,c=r[i];e(c)?s=ae([a]):t(c.fns)&&n(c.merged)?(s=c).fns.push(a):s=ae([c,a]),s.merged=!0,r[i]=s}function ue(n,r,i){var o=r.options.props;if(!e(o)){var a={},s=n.attrs,c=n.props;if(t(s)||t(c))for(var u in o){var l=Di(u);le(a,c,u,l,!0)||le(a,s,u,l,!1)}return a}}function le(e,n,r,i,o){if(t(n)){if(p(n,r))return e[r]=n[r],o||delete n[r],!0;if(p(n,i))return e[r]=n[i],o||delete n[i],!0}return!1}function fe(e){for(var t=0;t<e.length;t++)if(Array.isArray(e[t]))return Array.prototype.concat.apply([],e);return e}function de(e){return i(e)?[T(e)]:Array.isArray(e)?ve(e):void 0}function pe(e){return t(e)&&t(e.text)&&r(e.isComment)}function ve(r,o){var a,s,c,u,l=[];for(a=0;a<r.length;a++)e(s=r[a])||"boolean"==typeof s||(u=l[c=l.length-1],Array.isArray(s)?s.length>0&&(pe((s=ve(s,(o||"")+"_"+a))[0])&&pe(u)&&(l[c]=T(u.text+s[0].text),s.shift()),l.push.apply(l,s)):i(s)?pe(u)?l[c]=T(u.text+s):""!==s&&l.push(T(s)):pe(s)&&pe(u)?l[c]=T(u.text+s.text):(n(r._isVList)&&t(s.tag)&&e(s.key)&&t(o)&&(s.key="__vlist"+o+"_"+a+"__"),l.push(s)));return l}function he(e,t){return(e.__esModule||so&&"Module"===e[Symbol.toStringTag])&&(e=e.default),o(e)?t.extend(e):e}function me(e,t,n,r,i){var o=ho();return o.asyncFactory=e,o.asyncMeta={data:t,context:n,children:r,tag:i},o}function ye(r,i,a){if(n(r.error)&&t(r.errorComp))return r.errorComp;if(t(r.resolved))return r.resolved;if(n(r.loading)&&t(r.loadingComp))return r.loadingComp;if(!t(r.contexts)){var s=r.contexts=[a],c=!0,u=function(){for(var e=0,t=s.length;e<t;e++)s[e].$forceUpdate()},l=C(function(e){r.resolved=he(e,i),c||u()}),f=C(function(e){t(r.errorComp)&&(r.error=!0,u())}),d=r(l,f);return o(d)&&("function"==typeof d.then?e(r.resolved)&&d.then(l,f):t(d.component)&&"function"==typeof d.component.then&&(d.component.then(l,f),t(d.error)&&(r.errorComp=he(d.error,i)),t(d.loading)&&(r.loadingComp=he(d.loading,i),0===d.delay?r.loading=!0:setTimeout(function(){e(r.resolved)&&e(r.error)&&(r.loading=!0,u())},d.delay||200)),t(d.timeout)&&setTimeout(function(){e(r.resolved)&&f(null)},d.timeout))),c=!1,r.loading?r.loadingComp:r.resolved}r.contexts.push(a)}function ge(e){return e.isComment&&e.asyncFactory}function _e(e){if(Array.isArray(e))for(var n=0;n<e.length;n++){var r=e[n];if(t(r)&&(t(r.componentOptions)||ge(r)))return r}}function be(e){e._events=Object.create(null),e._hasHookEvent=!1;var t=e.$options._parentListeners;t&&we(e,t)}function $e(e,t,n){n?jo.$once(e,t):jo.$on(e,t)}function Ce(e,t){jo.$off(e,t)}function we(e,t,n){jo=e,se(t,n||{},$e,Ce,e),jo=void 0}function xe(e,t){var n={};if(!e)return n;for(var r=0,i=e.length;r<i;r++){var o=e[r],a=o.data;if(a&&a.attrs&&a.attrs.slot&&delete a.attrs.slot,o.context!==t&&o.functionalContext!==t||!a||null==a.slot)(n.default||(n.default=[])).push(o);else{var s=o.data.slot,c=n[s]||(n[s]=[]);"template"===o.tag?c.push.apply(c,o.children):c.push(o)}}for(var u in n)n[u].every(ke)&&delete n[u];return n}function ke(e){return e.isComment&&!e.asyncFactory||" "===e.text}function Ae(e,t){t=t||{};for(var n=0;n<e.length;n++)Array.isArray(e[n])?Ae(e[n],t):t[e[n].key]=e[n].fn;return t}function Oe(e){var t=e.$options,n=t.parent;if(n&&!t.abstract){for(;n.$options.abstract&&n.$parent;)n=n.$parent;n.$children.push(e)}e.$parent=n,e.$root=n?n.$root:e,e.$children=[],e.$refs={},e._watcher=null,e._inactive=null,e._directInactive=!1,e._isMounted=!1,e._isDestroyed=!1,e._isBeingDestroyed=!1}function Se(e,t,n){e.$el=t,e.$options.render||(e.$options.render=ho),Le(e,"beforeMount");var r;return r=function(){e._update(e._render(),n)},e._watcher=new Uo(e,r,_),n=!1,null==e.$vnode&&(e._isMounted=!0,Le(e,"mounted")),e}function Te(e,t,n,r,i){var o=!!(i||e.$options._renderChildren||r.data.scopedSlots||e.$scopedSlots!==Oi);if(e.$options._parentVnode=r,e.$vnode=r,e._vnode&&(e._vnode.parent=r),e.$options._renderChildren=i,e.$attrs=r.data&&r.data.attrs||Oi,e.$listeners=n||Oi,t&&e.$options.props){_o.shouldConvert=!1;for(var a=e._props,s=e.$options._propKeys||[],c=0;c<s.length;c++){var u=s[c];a[u]=W(u,e.$options.props,t,e)}_o.shouldConvert=!0,e.$options.propsData=t}if(n){var l=e.$options._parentListeners;e.$options._parentListeners=n,we(e,n,l)}o&&(e.$slots=xe(i,r.context),e.$forceUpdate())}function Ee(e){for(;e&&(e=e.$parent);)if(e._inactive)return!0;return!1}function je(e,t){if(t){if(e._directInactive=!1,Ee(e))return}else if(e._directInactive)return;if(e._inactive||null===e._inactive){e._inactive=!1;for(var n=0;n<e.$children.length;n++)je(e.$children[n]);Le(e,"activated")}}function Ne(e,t){if(!(t&&(e._directInactive=!0,Ee(e))||e._inactive)){e._inactive=!0;for(var n=0;n<e.$children.length;n++)Ne(e.$children[n]);Le(e,"deactivated")}}function Le(e,t){var n=e.$options[t];if(n)for(var r=0,i=n.length;r<i;r++)try{n[r].call(e)}catch(n){Y(n,e,t+" hook")}e._hasHookEvent&&e.$emit("hook:"+t)}function Ie(){Ho=Mo.length=Do.length=0,Po={},Fo=Ro=!1}function Me(){Ro=!0;var e,t;for(Mo.sort(function(e,t){return e.id-t.id}),Ho=0;Ho<Mo.length;Ho++)t=(e=Mo[Ho]).id,Po[t]=null,e.run();var n=Do.slice(),r=Mo.slice();Ie(),Fe(n),De(r),ao&&Ui.devtools&&ao.emit("flush")}function De(e){for(var t=e.length;t--;){var n=e[t],r=n.vm;r._watcher===n&&r._isMounted&&Le(r,"updated")}}function Pe(e){e._inactive=!1,Do.push(e)}function Fe(e){for(var t=0;t<e.length;t++)e[t]._inactive=!0,je(e[t],!0)}function Re(e){var t=e.id;if(null==Po[t]){if(Po[t]=!0,Ro){for(var n=Mo.length-1;n>Ho&&Mo[n].id>e.id;)n--;Mo.splice(n+1,0,e)}else Mo.push(e);Fo||(Fo=!0,re(Me))}}function He(e,t,n){Vo.get=function(){return this[t][n]},Vo.set=function(e){this[t][n]=e},Object.defineProperty(e,n,Vo)}function Be(e){e._watchers=[];var t=e.$options;t.props&&Ue(e,t.props),t.methods&&We(e,t.methods),t.data?Ve(e):I(e._data={},!0),t.computed&&Ke(e,t.computed),t.watch&&t.watch!==eo&&Ge(e,t.watch)}function Ue(e,t){var n=e.$options.propsData||{},r=e._props={},i=e.$options._propKeys=[],o=!e.$parent;_o.shouldConvert=o;for(var a in t)!function(o){i.push(o);var a=W(o,t,n,e);M(r,o,a),o in e||He(e,"_props",o)}(a);_o.shouldConvert=!0}function Ve(e){var t=e.$options.data;a(t=e._data="function"==typeof t?ze(t,e):t||{})||(t={});for(var n=Object.keys(t),r=e.$options.props,i=n.length;i--;){var o=n[i];r&&p(r,o)||w(o)||He(e,"_data",o)}I(t,!0)}function ze(e,t){try{return e.call(t,t)}catch(e){return Y(e,t,"data()"),{}}}function Ke(e,t){var n=e._computedWatchers=Object.create(null),r=oo();for(var i in t){var o=t[i],a="function"==typeof o?o:o.get;r||(n[i]=new Uo(e,a||_,_,zo)),i in e||Je(e,i,o)}}function Je(e,t,n){var r=!oo();"function"==typeof n?(Vo.get=r?qe(t):n,Vo.set=_):(Vo.get=n.get?r&&!1!==n.cache?qe(t):n.get:_,Vo.set=n.set?n.set:_),Object.defineProperty(e,t,Vo)}function qe(e){return function(){var t=this._computedWatchers&&this._computedWatchers[e];if(t)return t.dirty&&t.evaluate(),lo.target&&t.depend(),t.value}}function We(e,t){for(var n in t)e[n]=null==t[n]?_:h(t[n],e)}function Ge(e,t){for(var n in t){var r=t[n];if(Array.isArray(r))for(var i=0;i<r.length;i++)Ze(e,n,r[i]);else Ze(e,n,r)}}function Ze(e,t,n,r){return a(n)&&(r=n,n=n.handler),"string"==typeof n&&(n=e[n]),e.$watch(t,n,r)}function Xe(e){var t=e.$options.provide;t&&(e._provided="function"==typeof t?t.call(e):t)}function Ye(e){var t=Qe(e.$options.inject,e);t&&(_o.shouldConvert=!1,Object.keys(t).forEach(function(n){M(e,n,t[n])}),_o.shouldConvert=!0)}function Qe(e,t){if(e){for(var n=Object.create(null),r=so?Reflect.ownKeys(e).filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}):Object.keys(e),i=0;i<r.length;i++){for(var o=r[i],a=e[o].from,s=t;s;){if(s._provided&&a in s._provided){n[o]=s._provided[a];break}s=s.$parent}if(!s&&"default"in e[o]){var c=e[o].default;n[o]="function"==typeof c?c.call(t):c}}return n}}function et(e,n){var r,i,a,s,c;if(Array.isArray(e)||"string"==typeof e)for(r=new Array(e.length),i=0,a=e.length;i<a;i++)r[i]=n(e[i],i);else if("number"==typeof e)for(r=new Array(e),i=0;i<e;i++)r[i]=n(i+1,i);else if(o(e))for(s=Object.keys(e),r=new Array(s.length),i=0,a=s.length;i<a;i++)c=s[i],r[i]=n(e[c],c,i);return t(r)&&(r._isVList=!0),r}function tt(e,t,n,r){var i,o=this.$scopedSlots[e];if(o)n=n||{},r&&(n=y(y({},r),n)),i=o(n)||t;else{var a=this.$slots[e];a&&(a._rendered=!0),i=a||t}var s=n&&n.slot;return s?this.$createElement("template",{slot:s},i):i}function nt(e){return q(this.$options,"filters",e,!0)||Fi}function rt(e,t,n,r){var i=Ui.keyCodes[t]||n;return i?Array.isArray(i)?-1===i.indexOf(e):i!==e:r?Di(r)!==t:void 0}function it(e,t,n,r,i){if(n)if(o(n)){Array.isArray(n)&&(n=g(n));var a;for(var s in n)!function(o){if("class"===o||"style"===o||Ei(o))a=e;else{var s=e.attrs&&e.attrs.type;a=r||Ui.mustUseProp(t,s,o)?e.domProps||(e.domProps={}):e.attrs||(e.attrs={})}o in a||(a[o]=n[o],i&&((e.on||(e.on={}))["update:"+o]=function(e){n[o]=e}))}(s)}else;return e}function ot(e,t,n){var r=arguments.length<3,i=this.$options.staticRenderFns,o=r||n?this._staticTrees||(this._staticTrees=[]):i.cached||(i.cached=[]),a=o[e];return a&&!t?Array.isArray(a)?j(a):E(a):(a=o[e]=i[e].call(this._renderProxy,null,this),st(a,"__static__"+e,!1),a)}function at(e,t,n){return st(e,"__once__"+t+(n?"_"+n:""),!0),e}function st(e,t,n){if(Array.isArray(e))for(var r=0;r<e.length;r++)e[r]&&"string"!=typeof e[r]&&ct(e[r],t+"_"+r,n);else ct(e,t,n)}function ct(e,t,n){e.isStatic=!0,e.key=t,e.isOnce=n}function ut(e,t){if(t)if(a(t)){var n=e.on=e.on?y({},e.on):{};for(var r in t){var i=n[r],o=t[r];n[r]=i?[].concat(i,o):o}}else;return e}function lt(e){e._o=at,e._n=l,e._s=u,e._l=et,e._t=tt,e._q=b,e._i=$,e._m=ot,e._f=nt,e._k=rt,e._b=it,e._v=T,e._e=ho,e._u=Ae,e._g=ut}function ft(e,t,r,i,o){var a=o.options;this.data=e,this.props=t,this.children=r,this.parent=i,this.listeners=e.on||Oi,this.injections=Qe(a.inject,i),this.slots=function(){return xe(r,i)};var s=Object.create(i),c=n(a._compiled),u=!c;c&&(this.$options=a,this.$slots=this.slots(),this.$scopedSlots=e.scopedSlots||Oi),a._scopeId?this._c=function(e,t,n,r){var o=_t(s,e,t,n,r,u);return o&&(o.functionalScopeId=a._scopeId,o.functionalContext=i),o}:this._c=function(e,t,n,r){return _t(s,e,t,n,r,u)}}function dt(e,n,r,i,o){var a=e.options,s={},c=a.props;if(t(c))for(var u in c)s[u]=W(u,c,n||Oi);else t(r.attrs)&&pt(s,r.attrs),t(r.props)&&pt(s,r.props);var l=new ft(r,s,o,i,e),f=a.render.call(null,l._c,l);return f instanceof po&&(f.functionalContext=i,f.functionalOptions=a,r.slot&&((f.data||(f.data={})).slot=r.slot)),f}function pt(e,t){for(var n in t)e[Li(n)]=t[n]}function vt(r,i,a,s,c){if(!e(r)){var u=a.$options._base;if(o(r)&&(r=u.extend(r)),"function"==typeof r){var l;if(e(r.cid)&&(l=r,void 0===(r=ye(l,u,a))))return me(l,i,a,s,c);i=i||{},xt(r),t(i.model)&&gt(r.options,i);var f=ue(i,r,c);if(n(r.options.functional))return dt(r,f,i,a,s);var d=i.on;if(i.on=i.nativeOn,n(r.options.abstract)){var p=i.slot;i={},p&&(i.slot=p)}mt(i);var v=r.options.name||c;return new po("vue-component-"+r.cid+(v?"-"+v:""),i,void 0,void 0,void 0,a,{Ctor:r,propsData:f,listeners:d,tag:c,children:s},l)}}}function ht(e,n,r,i){var o=e.componentOptions,a={_isComponent:!0,parent:n,propsData:o.propsData,_componentTag:o.tag,_parentVnode:e,_parentListeners:o.listeners,_renderChildren:o.children,_parentElm:r||null,_refElm:i||null},s=e.data.inlineTemplate;return t(s)&&(a.render=s.render,a.staticRenderFns=s.staticRenderFns),new o.Ctor(a)}function mt(e){e.hook||(e.hook={});for(var t=0;t<Jo.length;t++){var n=Jo[t],r=e.hook[n],i=Ko[n];e.hook[n]=r?yt(i,r):i}}function yt(e,t){return function(n,r,i,o){e(n,r,i,o),t(n,r,i,o)}}function gt(e,n){var r=e.model&&e.model.prop||"value",i=e.model&&e.model.event||"input";(n.props||(n.props={}))[r]=n.model.value;var o=n.on||(n.on={});t(o[i])?o[i]=[n.model.callback].concat(o[i]):o[i]=n.model.callback}function _t(e,t,r,o,a,s){return(Array.isArray(r)||i(r))&&(a=o,o=r,r=void 0),n(s)&&(a=Wo),bt(e,t,r,o,a)}function bt(e,n,r,i,o){if(t(r)&&t(r.__ob__))return ho();if(t(r)&&t(r.is)&&(n=r.is),!n)return ho();Array.isArray(i)&&"function"==typeof i[0]&&((r=r||{}).scopedSlots={default:i[0]},i.length=0),o===Wo?i=de(i):o===qo&&(i=fe(i));var a,s;if("string"==typeof n){var c;s=e.$vnode&&e.$vnode.ns||Ui.getTagNamespace(n),a=Ui.isReservedTag(n)?new po(Ui.parsePlatformTagName(n),r,i,void 0,void 0,e):t(c=q(e.$options,"components",n))?vt(c,r,e,i,n):new po(n,r,i,void 0,void 0,e)}else a=vt(n,r,e,i);return t(a)?(s&&$t(a,s),a):ho()}function $t(r,i,o){if(r.ns=i,"foreignObject"===r.tag&&(i=void 0,o=!0),t(r.children))for(var a=0,s=r.children.length;a<s;a++){var c=r.children[a];t(c.tag)&&(e(c.ns)||n(o))&&$t(c,i,o)}}function Ct(e){e._vnode=null,e._staticTrees=null;var t=e.$options,n=e.$vnode=t._parentVnode,r=n&&n.context;e.$slots=xe(t._renderChildren,r),e.$scopedSlots=Oi,e._c=function(t,n,r,i){return _t(e,t,n,r,i,!1)},e.$createElement=function(t,n,r,i){return _t(e,t,n,r,i,!0)};var i=n&&n.data;M(e,"$attrs",i&&i.attrs||Oi,null,!0),M(e,"$listeners",t._parentListeners||Oi,null,!0)}function wt(e,t){var n=e.$options=Object.create(e.constructor.options);n.parent=t.parent,n.propsData=t.propsData,n._parentVnode=t._parentVnode,n._parentListeners=t._parentListeners,n._renderChildren=t._renderChildren,n._componentTag=t._componentTag,n._parentElm=t._parentElm,n._refElm=t._refElm,t.render&&(n.render=t.render,n.staticRenderFns=t.staticRenderFns)}function xt(e){var t=e.options;if(e.super){var n=xt(e.super);if(n!==e.superOptions){e.superOptions=n;var r=kt(e);r&&y(e.extendOptions,r),(t=e.options=J(n,e.extendOptions)).name&&(t.components[t.name]=e)}}return t}function kt(e){var t,n=e.options,r=e.extendOptions,i=e.sealedOptions;for(var o in n)n[o]!==i[o]&&(t||(t={}),t[o]=At(n[o],r[o],i[o]));return t}function At(e,t,n){if(Array.isArray(e)){var r=[];n=Array.isArray(n)?n:[n],t=Array.isArray(t)?t:[t];for(var i=0;i<e.length;i++)(t.indexOf(e[i])>=0||n.indexOf(e[i])<0)&&r.push(e[i]);return r}return e}function Ot(e){this._init(e)}function St(e){e.use=function(e){var t=this._installedPlugins||(this._installedPlugins=[]);if(t.indexOf(e)>-1)return this;var n=m(arguments,1);return n.unshift(this),"function"==typeof e.install?e.install.apply(e,n):"function"==typeof e&&e.apply(null,n),t.push(e),this}}function Tt(e){e.mixin=function(e){return this.options=J(this.options,e),this}}function Et(e){e.cid=0;var t=1;e.extend=function(e){e=e||{};var n=this,r=n.cid,i=e._Ctor||(e._Ctor={});if(i[r])return i[r];var o=e.name||n.options.name,a=function(e){this._init(e)};return a.prototype=Object.create(n.prototype),a.prototype.constructor=a,a.cid=t++,a.options=J(n.options,e),a.super=n,a.options.props&&jt(a),a.options.computed&&Nt(a),a.extend=n.extend,a.mixin=n.mixin,a.use=n.use,Hi.forEach(function(e){a[e]=n[e]}),o&&(a.options.components[o]=a),a.superOptions=n.options,a.extendOptions=e,a.sealedOptions=y({},a.options),i[r]=a,a}}function jt(e){var t=e.options.props;for(var n in t)He(e.prototype,"_props",n)}function Nt(e){var t=e.options.computed;for(var n in t)Je(e.prototype,n,t[n])}function Lt(e){Hi.forEach(function(t){e[t]=function(e,n){return n?("component"===t&&a(n)&&(n.name=n.name||e,n=this.options._base.extend(n)),"directive"===t&&"function"==typeof n&&(n={bind:n,update:n}),this.options[t+"s"][e]=n,n):this.options[t+"s"][e]}})}function It(e){return e&&(e.Ctor.options.name||e.tag)}function Mt(e,t){return Array.isArray(e)?e.indexOf(t)>-1:"string"==typeof e?e.split(",").indexOf(t)>-1:!!s(e)&&e.test(t)}function Dt(e,t){var n=e.cache,r=e.keys,i=e._vnode;for(var o in n){var a=n[o];if(a){var s=It(a.componentOptions);s&&!t(s)&&Pt(n,o,r,i)}}}function Pt(e,t,n,r){var i=e[t];i&&i!==r&&i.componentInstance.$destroy(),e[t]=null,d(n,t)}function Ft(e){for(var n=e.data,r=e,i=e;t(i.componentInstance);)(i=i.componentInstance._vnode).data&&(n=Rt(i.data,n));for(;t(r=r.parent);)r.data&&(n=Rt(n,r.data));return Ht(n.staticClass,n.class)}function Rt(e,n){return{staticClass:Bt(e.staticClass,n.staticClass),class:t(e.class)?[e.class,n.class]:n.class}}function Ht(e,n){return t(e)||t(n)?Bt(e,Ut(n)):""}function Bt(e,t){return e?t?e+" "+t:e:t||""}function Ut(e){return Array.isArray(e)?Vt(e):o(e)?zt(e):"string"==typeof e?e:""}function Vt(e){for(var n,r="",i=0,o=e.length;i<o;i++)t(n=Ut(e[i]))&&""!==n&&(r&&(r+=" "),r+=n);return r}function zt(e){var t="";for(var n in e)e[n]&&(t&&(t+=" "),t+=n);return t}function Kt(e){return ya(e)?"svg":"math"===e?"math":void 0}function Jt(e){if("string"==typeof e){var t=document.querySelector(e);return t||document.createElement("div")}return e}function qt(e,t){var n=e.data.ref;if(n){var r=e.context,i=e.componentInstance||e.elm,o=r.$refs;t?Array.isArray(o[n])?d(o[n],i):o[n]===i&&(o[n]=void 0):e.data.refInFor?Array.isArray(o[n])?o[n].indexOf(i)<0&&o[n].push(i):o[n]=[i]:o[n]=i}}function Wt(r,i){return r.key===i.key&&(r.tag===i.tag&&r.isComment===i.isComment&&t(r.data)===t(i.data)&&Gt(r,i)||n(r.isAsyncPlaceholder)&&r.asyncFactory===i.asyncFactory&&e(i.asyncFactory.error))}function Gt(e,n){if("input"!==e.tag)return!0;var r,i=t(r=e.data)&&t(r=r.attrs)&&r.type,o=t(r=n.data)&&t(r=r.attrs)&&r.type;return i===o||ba(i)&&ba(o)}function Zt(e,n,r){var i,o,a={};for(i=n;i<=r;++i)t(o=e[i].key)&&(a[o]=i);return a}function Xt(e,t){(e.data.directives||t.data.directives)&&Yt(e,t)}function Yt(e,t){var n,r,i,o=e===wa,a=t===wa,s=Qt(e.data.directives,e.context),c=Qt(t.data.directives,t.context),u=[],l=[];for(n in c)r=s[n],i=c[n],r?(i.oldValue=r.value,tn(i,"update",t,e),i.def&&i.def.componentUpdated&&l.push(i)):(tn(i,"bind",t,e),i.def&&i.def.inserted&&u.push(i));if(u.length){var f=function(){for(var n=0;n<u.length;n++)tn(u[n],"inserted",t,e)};o?ce(t,"insert",f):f()}if(l.length&&ce(t,"postpatch",function(){for(var n=0;n<l.length;n++)tn(l[n],"componentUpdated",t,e)}),!o)for(n in s)c[n]||tn(s[n],"unbind",e,e,a)}function Qt(e,t){var n=Object.create(null);if(!e)return n;var r,i;for(r=0;r<e.length;r++)(i=e[r]).modifiers||(i.modifiers=Aa),n[en(i)]=i,i.def=q(t.$options,"directives",i.name,!0);return n}function en(e){return e.rawName||e.name+"."+Object.keys(e.modifiers||{}).join(".")}function tn(e,t,n,r,i){var o=e.def&&e.def[t];if(o)try{o(n.elm,e,n,r,i)}catch(r){Y(r,n.context,"directive "+e.name+" "+t+" hook")}}function nn(n,r){var i=r.componentOptions;if(!(t(i)&&!1===i.Ctor.options.inheritAttrs||e(n.data.attrs)&&e(r.data.attrs))){var o,a,s=r.elm,c=n.data.attrs||{},u=r.data.attrs||{};t(u.__ob__)&&(u=r.data.attrs=y({},u));for(o in u)a=u[o],c[o]!==a&&rn(s,o,a);(Zi||Xi)&&u.value!==c.value&&rn(s,"value",u.value);for(o in c)e(u[o])&&(da(o)?s.removeAttributeNS(fa,pa(o)):ua(o)||s.removeAttribute(o))}}function rn(e,t,n){la(t)?va(n)?e.removeAttribute(t):(n="allowfullscreen"===t&&"EMBED"===e.tagName?"true":t,e.setAttribute(t,n)):ua(t)?e.setAttribute(t,va(n)||"false"===n?"false":"true"):da(t)?va(n)?e.removeAttributeNS(fa,pa(t)):e.setAttributeNS(fa,t,n):va(n)?e.removeAttribute(t):e.setAttribute(t,n)}function on(n,r){var i=r.elm,o=r.data,a=n.data;if(!(e(o.staticClass)&&e(o.class)&&(e(a)||e(a.staticClass)&&e(a.class)))){var s=Ft(r),c=i._transitionClasses;t(c)&&(s=Bt(s,Ut(c))),s!==i._prevClass&&(i.setAttribute("class",s),i._prevClass=s)}}function an(e){function t(){(a||(a=[])).push(e.slice(v,i).trim()),v=i+1}var n,r,i,o,a,s=!1,c=!1,u=!1,l=!1,f=0,d=0,p=0,v=0;for(i=0;i<e.length;i++)if(r=n,n=e.charCodeAt(i),s)39===n&&92!==r&&(s=!1);else if(c)34===n&&92!==r&&(c=!1);else if(u)96===n&&92!==r&&(u=!1);else if(l)47===n&&92!==r&&(l=!1);else if(124!==n||124===e.charCodeAt(i+1)||124===e.charCodeAt(i-1)||f||d||p){switch(n){case 34:c=!0;break;case 39:s=!0;break;case 96:u=!0;break;case 40:p++;break;case 41:p--;break;case 91:d++;break;case 93:d--;break;case 123:f++;break;case 125:f--}if(47===n){for(var h=i-1,m=void 0;h>=0&&" "===(m=e.charAt(h));h--);m&&Ea.test(m)||(l=!0)}}else void 0===o?(v=i+1,o=e.slice(0,i).trim()):t();if(void 0===o?o=e.slice(0,i).trim():0!==v&&t(),a)for(i=0;i<a.length;i++)o=sn(o,a[i]);return o}function sn(e,t){var n=t.indexOf("(");return n<0?'_f("'+t+'")('+e+")":'_f("'+t.slice(0,n)+'")('+e+","+t.slice(n+1)}function cn(e){console.error("[Vue compiler]: "+e)}function un(e,t){return e?e.map(function(e){return e[t]}).filter(function(e){return e}):[]}function ln(e,t,n){(e.props||(e.props=[])).push({name:t,value:n})}function fn(e,t,n){(e.attrs||(e.attrs=[])).push({name:t,value:n})}function dn(e,t,n,r,i,o){(e.directives||(e.directives=[])).push({name:t,rawName:n,value:r,arg:i,modifiers:o})}function pn(e,t,n,r,i,o){(r=r||Oi).capture&&(delete r.capture,t="!"+t),r.once&&(delete r.once,t="~"+t),r.passive&&(delete r.passive,t="&"+t),"click"===t&&(r.right?(t="contextmenu",delete r.right):r.middle&&(t="mouseup"));var a;r.native?(delete r.native,a=e.nativeEvents||(e.nativeEvents={})):a=e.events||(e.events={});var s={value:n};r!==Oi&&(s.modifiers=r);var c=a[t];Array.isArray(c)?i?c.unshift(s):c.push(s):a[t]=c?i?[s,c]:[c,s]:s}function vn(e,t,n){var r=hn(e,":"+t)||hn(e,"v-bind:"+t);if(null!=r)return an(r);if(!1!==n){var i=hn(e,t);if(null!=i)return JSON.stringify(i)}}function hn(e,t,n){var r;if(null!=(r=e.attrsMap[t]))for(var i=e.attrsList,o=0,a=i.length;o<a;o++)if(i[o].name===t){i.splice(o,1);break}return n&&delete e.attrsMap[t],r}function mn(e,t,n){var r=n||{},i=r.number,o="$$v";r.trim&&(o="(typeof $$v === 'string'? $$v.trim(): $$v)"),i&&(o="_n("+o+")");var a=yn(t,o);e.model={value:"("+t+")",expression:'"'+t+'"',callback:"function ($$v) {"+a+"}"}}function yn(e,t){var n=gn(e);return null===n.key?e+"="+t:"$set("+n.exp+", "+n.key+", "+t+")"}function gn(e){if(Yo=e.length,e.indexOf("[")<0||e.lastIndexOf("]")<Yo-1)return(ta=e.lastIndexOf("."))>-1?{exp:e.slice(0,ta),key:'"'+e.slice(ta+1)+'"'}:{exp:e,key:null};for(Qo=e,ta=na=ra=0;!bn();)$n(ea=_n())?wn(ea):91===ea&&Cn(ea);return{exp:e.slice(0,na),key:e.slice(na+1,ra)}}function _n(){return Qo.charCodeAt(++ta)}function bn(){return ta>=Yo}function $n(e){return 34===e||39===e}function Cn(e){var t=1;for(na=ta;!bn();)if(e=_n(),$n(e))wn(e);else if(91===e&&t++,93===e&&t--,0===t){ra=ta;break}}function wn(e){for(var t=e;!bn()&&(e=_n())!==t;);}function xn(e,t,n){var r=n&&n.number,i=vn(e,"value")||"null",o=vn(e,"true-value")||"true",a=vn(e,"false-value")||"false";ln(e,"checked","Array.isArray("+t+")?_i("+t+","+i+")>-1"+("true"===o?":("+t+")":":_q("+t+","+o+")")),pn(e,"change","var $$a="+t+",$$el=$event.target,$$c=$$el.checked?("+o+"):("+a+");if(Array.isArray($$a)){var $$v="+(r?"_n("+i+")":i)+",$$i=_i($$a,$$v);if($$el.checked){$$i<0&&("+t+"=$$a.concat([$$v]))}else{$$i>-1&&("+t+"=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{"+yn(t,"$$c")+"}",null,!0)}function kn(e,t,n){var r=n&&n.number,i=vn(e,"value")||"null";ln(e,"checked","_q("+t+","+(i=r?"_n("+i+")":i)+")"),pn(e,"change",yn(t,i),null,!0)}function An(e,t,n){var r="var $$selectedVal = "+('Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return '+(n&&n.number?"_n(val)":"val")+"})")+";";pn(e,"change",r=r+" "+yn(t,"$event.target.multiple ? $$selectedVal : $$selectedVal[0]"),null,!0)}function On(e,t,n){var r=e.attrsMap.type,i=n||{},o=i.lazy,a=i.number,s=i.trim,c=!o&&"range"!==r,u=o?"change":"range"===r?ja:"input",l="$event.target.value";s&&(l="$event.target.value.trim()"),a&&(l="_n("+l+")");var f=yn(t,l);c&&(f="if($event.target.composing)return;"+f),ln(e,"value","("+t+")"),pn(e,u,f,null,!0),(s||a)&&pn(e,"blur","$forceUpdate()")}function Sn(e){if(t(e[ja])){var n=Gi?"change":"input";e[n]=[].concat(e[ja],e[n]||[]),delete e[ja]}t(e[Na])&&(e.change=[].concat(e[Na],e.change||[]),delete e[Na])}function Tn(e,t,n){var r=ia;return function i(){null!==e.apply(null,arguments)&&jn(t,i,n,r)}}function En(e,t,n,r,i){t=ne(t),n&&(t=Tn(t,e,r)),ia.addEventListener(e,t,to?{capture:r,passive:i}:r)}function jn(e,t,n,r){(r||ia).removeEventListener(e,t._withTask||t,n)}function Nn(t,n){if(!e(t.data.on)||!e(n.data.on)){var r=n.data.on||{},i=t.data.on||{};ia=n.elm,Sn(r),se(r,i,En,jn,n.context),ia=void 0}}function Ln(n,r){if(!e(n.data.domProps)||!e(r.data.domProps)){var i,o,a=r.elm,s=n.data.domProps||{},c=r.data.domProps||{};t(c.__ob__)&&(c=r.data.domProps=y({},c));for(i in s)e(c[i])&&(a[i]="");for(i in c){if(o=c[i],"textContent"===i||"innerHTML"===i){if(r.children&&(r.children.length=0),o===s[i])continue;1===a.childNodes.length&&a.removeChild(a.childNodes[0])}if("value"===i){a._value=o;var u=e(o)?"":String(o);In(a,u)&&(a.value=u)}else a[i]=o}}}function In(e,t){return!e.composing&&("OPTION"===e.tagName||Mn(e,t)||Dn(e,t))}function Mn(e,t){var n=!0;try{n=document.activeElement!==e}catch(e){}return n&&e.value!==t}function Dn(e,n){var r=e.value,i=e._vModifiers;return t(i)&&i.number?l(r)!==l(n):t(i)&&i.trim?r.trim()!==n.trim():r!==n}function Pn(e){var t=Fn(e.style);return e.staticStyle?y(e.staticStyle,t):t}function Fn(e){return Array.isArray(e)?g(e):"string"==typeof e?Ma(e):e}function Rn(e,t){var n,r={};if(t)for(var i=e;i.componentInstance;)(i=i.componentInstance._vnode).data&&(n=Pn(i.data))&&y(r,n);(n=Pn(e.data))&&y(r,n);for(var o=e;o=o.parent;)o.data&&(n=Pn(o.data))&&y(r,n);return r}function Hn(n,r){var i=r.data,o=n.data;if(!(e(i.staticStyle)&&e(i.style)&&e(o.staticStyle)&&e(o.style))){var a,s,c=r.elm,u=o.staticStyle,l=o.normalizedStyle||o.style||{},f=u||l,d=Fn(r.data.style)||{};r.data.normalizedStyle=t(d.__ob__)?y({},d):d;var p=Rn(r,!0);for(s in f)e(p[s])&&Fa(c,s,"");for(s in p)(a=p[s])!==f[s]&&Fa(c,s,null==a?"":a)}}function Bn(e,t){if(t&&(t=t.trim()))if(e.classList)t.indexOf(" ")>-1?t.split(/\s+/).forEach(function(t){return e.classList.add(t)}):e.classList.add(t);else{var n=" "+(e.getAttribute("class")||"")+" ";n.indexOf(" "+t+" ")<0&&e.setAttribute("class",(n+t).trim())}}function Un(e,t){if(t&&(t=t.trim()))if(e.classList)t.indexOf(" ")>-1?t.split(/\s+/).forEach(function(t){return e.classList.remove(t)}):e.classList.remove(t),e.classList.length||e.removeAttribute("class");else{for(var n=" "+(e.getAttribute("class")||"")+" ",r=" "+t+" ";n.indexOf(r)>=0;)n=n.replace(r," ");(n=n.trim())?e.setAttribute("class",n):e.removeAttribute("class")}}function Vn(e){if(e){if("object"==typeof e){var t={};return!1!==e.css&&y(t,Ua(e.name||"v")),y(t,e),t}return"string"==typeof e?Ua(e):void 0}}function zn(e){Za(function(){Za(e)})}function Kn(e,t){var n=e._transitionClasses||(e._transitionClasses=[]);n.indexOf(t)<0&&(n.push(t),Bn(e,t))}function Jn(e,t){e._transitionClasses&&d(e._transitionClasses,t),Un(e,t)}function qn(e,t,n){var r=Wn(e,t),i=r.type,o=r.timeout,a=r.propCount;if(!i)return n();var s=i===za?qa:Ga,c=0,u=function(){e.removeEventListener(s,l),n()},l=function(t){t.target===e&&++c>=a&&u()};setTimeout(function(){c<a&&u()},o+1),e.addEventListener(s,l)}function Wn(e,t){var n,r=window.getComputedStyle(e),i=r[Ja+"Delay"].split(", "),o=r[Ja+"Duration"].split(", "),a=Gn(i,o),s=r[Wa+"Delay"].split(", "),c=r[Wa+"Duration"].split(", "),u=Gn(s,c),l=0,f=0;return t===za?a>0&&(n=za,l=a,f=o.length):t===Ka?u>0&&(n=Ka,l=u,f=c.length):f=(n=(l=Math.max(a,u))>0?a>u?za:Ka:null)?n===za?o.length:c.length:0,{type:n,timeout:l,propCount:f,hasTransform:n===za&&Xa.test(r[Ja+"Property"])}}function Gn(e,t){for(;e.length<t.length;)e=e.concat(e);return Math.max.apply(null,t.map(function(t,n){return Zn(t)+Zn(e[n])}))}function Zn(e){return 1e3*Number(e.slice(0,-1))}function Xn(n,r){var i=n.elm;t(i._leaveCb)&&(i._leaveCb.cancelled=!0,i._leaveCb());var a=Vn(n.data.transition);if(!e(a)&&!t(i._enterCb)&&1===i.nodeType){for(var s=a.css,c=a.type,u=a.enterClass,f=a.enterToClass,d=a.enterActiveClass,p=a.appearClass,v=a.appearToClass,h=a.appearActiveClass,m=a.beforeEnter,y=a.enter,g=a.afterEnter,_=a.enterCancelled,b=a.beforeAppear,$=a.appear,w=a.afterAppear,x=a.appearCancelled,k=a.duration,A=Io,O=Io.$vnode;O&&O.parent;)A=(O=O.parent).context;var S=!A._isMounted||!n.isRootInsert;if(!S||$||""===$){var T=S&&p?p:u,E=S&&h?h:d,j=S&&v?v:f,N=S?b||m:m,L=S&&"function"==typeof $?$:y,I=S?w||g:g,M=S?x||_:_,D=l(o(k)?k.enter:k),P=!1!==s&&!Zi,F=er(L),R=i._enterCb=C(function(){P&&(Jn(i,j),Jn(i,E)),R.cancelled?(P&&Jn(i,T),M&&M(i)):I&&I(i),i._enterCb=null});n.data.show||ce(n,"insert",function(){var e=i.parentNode,t=e&&e._pending&&e._pending[n.key];t&&t.tag===n.tag&&t.elm._leaveCb&&t.elm._leaveCb(),L&&L(i,R)}),N&&N(i),P&&(Kn(i,T),Kn(i,E),zn(function(){Kn(i,j),Jn(i,T),R.cancelled||F||(Qn(D)?setTimeout(R,D):qn(i,c,R))})),n.data.show&&(r&&r(),L&&L(i,R)),P||F||R()}}}function Yn(n,r){function i(){x.cancelled||(n.data.show||((a.parentNode._pending||(a.parentNode._pending={}))[n.key]=n),v&&v(a),b&&(Kn(a,f),Kn(a,p),zn(function(){Kn(a,d),Jn(a,f),x.cancelled||$||(Qn(w)?setTimeout(x,w):qn(a,u,x))})),h&&h(a,x),b||$||x())}var a=n.elm;t(a._enterCb)&&(a._enterCb.cancelled=!0,a._enterCb());var s=Vn(n.data.transition);if(e(s)||1!==a.nodeType)return r();if(!t(a._leaveCb)){var c=s.css,u=s.type,f=s.leaveClass,d=s.leaveToClass,p=s.leaveActiveClass,v=s.beforeLeave,h=s.leave,m=s.afterLeave,y=s.leaveCancelled,g=s.delayLeave,_=s.duration,b=!1!==c&&!Zi,$=er(h),w=l(o(_)?_.leave:_),x=a._leaveCb=C(function(){a.parentNode&&a.parentNode._pending&&(a.parentNode._pending[n.key]=null),b&&(Jn(a,d),Jn(a,p)),x.cancelled?(b&&Jn(a,f),y&&y(a)):(r(),m&&m(a)),a._leaveCb=null});g?g(i):i()}}function Qn(e){return"number"==typeof e&&!isNaN(e)}function er(n){if(e(n))return!1;var r=n.fns;return t(r)?er(Array.isArray(r)?r[0]:r):(n._length||n.length)>1}function tr(e,t){!0!==t.data.show&&Xn(t)}function nr(e,t,n){rr(e,t,n),(Gi||Xi)&&setTimeout(function(){rr(e,t,n)},0)}function rr(e,t,n){var r=t.value,i=e.multiple;if(!i||Array.isArray(r)){for(var o,a,s=0,c=e.options.length;s<c;s++)if(a=e.options[s],i)o=$(r,or(a))>-1,a.selected!==o&&(a.selected=o);else if(b(or(a),r))return void(e.selectedIndex!==s&&(e.selectedIndex=s));i||(e.selectedIndex=-1)}}function ir(e,t){return t.every(function(t){return!b(t,e)})}function or(e){return"_value"in e?e._value:e.value}function ar(e){e.target.composing=!0}function sr(e){e.target.composing&&(e.target.composing=!1,cr(e.target,"input"))}function cr(e,t){var n=document.createEvent("HTMLEvents");n.initEvent(t,!0,!0),e.dispatchEvent(n)}function ur(e){return!e.componentInstance||e.data&&e.data.transition?e:ur(e.componentInstance._vnode)}function lr(e){var t=e&&e.componentOptions;return t&&t.Ctor.options.abstract?lr(_e(t.children)):e}function fr(e){var t={},n=e.$options;for(var r in n.propsData)t[r]=e[r];var i=n._parentListeners;for(var o in i)t[Li(o)]=i[o];return t}function dr(e,t){if(/\d-keep-alive$/.test(t.tag))return e("keep-alive",{props:t.componentOptions.propsData})}function pr(e){for(;e=e.parent;)if(e.data.transition)return!0}function vr(e,t){return t.key===e.key&&t.tag===e.tag}function hr(e){e.elm._moveCb&&e.elm._moveCb(),e.elm._enterCb&&e.elm._enterCb()}function mr(e){e.data.newPos=e.elm.getBoundingClientRect()}function yr(e){var t=e.data.pos,n=e.data.newPos,r=t.left-n.left,i=t.top-n.top;if(r||i){e.data.moved=!0;var o=e.elm.style;o.transform=o.WebkitTransform="translate("+r+"px,"+i+"px)",o.transitionDuration="0s"}}function gr(e,t){var n=t?cs(t):as;if(n.test(e)){for(var r,i,o=[],a=n.lastIndex=0;r=n.exec(e);){(i=r.index)>a&&o.push(JSON.stringify(e.slice(a,i)));var s=an(r[1].trim());o.push("_s("+s+")"),a=i+r[0].length}return a<e.length&&o.push(JSON.stringify(e.slice(a))),o.join("+")}}function _r(e,t){var n=t?Hs:Rs;return e.replace(n,function(e){return Fs[e]})}function br(e,t){function n(t){l+=t,e=e.substring(t)}function r(e,n,r){var i,s;if(null==n&&(n=l),null==r&&(r=l),e&&(s=e.toLowerCase()),e)for(i=a.length-1;i>=0&&a[i].lowerCasedTag!==s;i--);else i=0;if(i>=0){for(var c=a.length-1;c>=i;c--)t.end&&t.end(a[c].tag,n,r);a.length=i,o=i&&a[i-1].tag}else"br"===s?t.start&&t.start(e,[],!0,n,r):"p"===s&&(t.start&&t.start(e,[],!1,n,r),t.end&&t.end(e,n,r))}for(var i,o,a=[],s=t.expectHTML,c=t.isUnaryTag||Pi,u=t.canBeLeftOpenTag||Pi,l=0;e;){if(i=e,o&&Ds(o)){var f=0,d=o.toLowerCase(),p=Ps[d]||(Ps[d]=new RegExp("([\\s\\S]*?)(</"+d+"[^>]*>)","i")),v=e.replace(p,function(e,n,r){return f=r.length,Ds(d)||"noscript"===d||(n=n.replace(/<!--([\s\S]*?)-->/g,"$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g,"$1")),Us(d,n)&&(n=n.slice(1)),t.chars&&t.chars(n),""});l+=e.length-v.length,e=v,r(d,l-f,l)}else{var h=e.indexOf("<");if(0===h){if(Cs.test(e)){var m=e.indexOf("--\x3e");if(m>=0){t.shouldKeepComment&&t.comment(e.substring(4,m)),n(m+3);continue}}if(ws.test(e)){var y=e.indexOf("]>");if(y>=0){n(y+2);continue}}var g=e.match($s);if(g){n(g[0].length);continue}var _=e.match(bs);if(_){var b=l;n(_[0].length),r(_[1],b,l);continue}var $=function(){var t=e.match(gs);if(t){var r={tagName:t[1],attrs:[],start:l};n(t[0].length);for(var i,o;!(i=e.match(_s))&&(o=e.match(hs));)n(o[0].length),r.attrs.push(o);if(i)return r.unarySlash=i[1],n(i[0].length),r.end=l,r}}();if($){!function(e){var n=e.tagName,i=e.unarySlash;s&&("p"===o&&vs(n)&&r(o),u(n)&&o===n&&r(n));for(var l=c(n)||!!i,f=e.attrs.length,d=new Array(f),p=0;p<f;p++){var v=e.attrs[p];xs&&-1===v[0].indexOf('""')&&(""===v[3]&&delete v[3],""===v[4]&&delete v[4],""===v[5]&&delete v[5]);var h=v[3]||v[4]||v[5]||"",m="a"===n&&"href"===v[1]?t.shouldDecodeNewlinesForHref:t.shouldDecodeNewlines;d[p]={name:v[1],value:_r(h,m)}}l||(a.push({tag:n,lowerCasedTag:n.toLowerCase(),attrs:d}),o=n),t.start&&t.start(n,d,l,e.start,e.end)}($),Us(o,e)&&n(1);continue}}var C=void 0,w=void 0,x=void 0;if(h>=0){for(w=e.slice(h);!(bs.test(w)||gs.test(w)||Cs.test(w)||ws.test(w)||(x=w.indexOf("<",1))<0);)h+=x,w=e.slice(h);C=e.substring(0,h),n(h)}h<0&&(C=e,e=""),t.chars&&C&&t.chars(C)}if(e===i){t.chars&&t.chars(e);break}}r()}function $r(e,t,n){return{type:1,tag:e,attrsList:t,attrsMap:Rr(t),parent:n,children:[]}}function Cr(e,t){function n(e){e.pre&&(s=!1),Es(e.tag)&&(c=!1)}ks=t.warn||cn,Es=t.isPreTag||Pi,js=t.mustUseProp||Pi,Ns=t.getTagNamespace||Pi,Os=un(t.modules,"transformNode"),Ss=un(t.modules,"preTransformNode"),Ts=un(t.modules,"postTransformNode"),As=t.delimiters;var r,i,o=[],a=!1!==t.preserveWhitespace,s=!1,c=!1;return br(e,{warn:ks,expectHTML:t.expectHTML,isUnaryTag:t.isUnaryTag,canBeLeftOpenTag:t.canBeLeftOpenTag,shouldDecodeNewlines:t.shouldDecodeNewlines,shouldDecodeNewlinesForHref:t.shouldDecodeNewlinesForHref,shouldKeepComment:t.comments,start:function(e,a,u){var l=i&&i.ns||Ns(e);Gi&&"svg"===l&&(a=Ur(a));var f=$r(e,a,i);l&&(f.ns=l),Br(f)&&!oo()&&(f.forbidden=!0);for(var d=0;d<Ss.length;d++)f=Ss[d](f,t)||f;if(s||(wr(f),f.pre&&(s=!0)),Es(f.tag)&&(c=!0),s?xr(f):f.processed||(Sr(f),Tr(f),Lr(f),kr(f,t)),r?o.length||r.if&&(f.elseif||f.else)&&Nr(r,{exp:f.elseif,block:f}):r=f,i&&!f.forbidden)if(f.elseif||f.else)Er(f,i);else if(f.slotScope){i.plain=!1;var p=f.slotTarget||'"default"';(i.scopedSlots||(i.scopedSlots={}))[p]=f}else i.children.push(f),f.parent=i;u?n(f):(i=f,o.push(f));for(var v=0;v<Ts.length;v++)Ts[v](f,t)},end:function(){var e=o[o.length-1],t=e.children[e.children.length-1];t&&3===t.type&&" "===t.text&&!c&&e.children.pop(),o.length-=1,i=o[o.length-1],n(e)},chars:function(e){if(i&&(!Gi||"textarea"!==i.tag||i.attrsMap.placeholder!==e)){var t=i.children;if(e=c||e.trim()?Hr(i)?e:Zs(e):a&&t.length?" ":""){var n;!s&&" "!==e&&(n=gr(e,As))?t.push({type:2,expression:n,text:e}):" "===e&&t.length&&" "===t[t.length-1].text||t.push({type:3,text:e})}}},comment:function(e){i.children.push({type:3,text:e,isComment:!0})}}),r}function wr(e){null!=hn(e,"v-pre")&&(e.pre=!0)}function xr(e){var t=e.attrsList.length;if(t)for(var n=e.attrs=new Array(t),r=0;r<t;r++)n[r]={name:e.attrsList[r].name,value:JSON.stringify(e.attrsList[r].value)};else e.pre||(e.plain=!0)}function kr(e,t){Ar(e),e.plain=!e.key&&!e.attrsList.length,Or(e),Ir(e),Mr(e);for(var n=0;n<Os.length;n++)e=Os[n](e,t)||e;Dr(e)}function Ar(e){var t=vn(e,"key");t&&(e.key=t)}function Or(e){var t=vn(e,"ref");t&&(e.ref=t,e.refInFor=Pr(e))}function Sr(e){var t;if(t=hn(e,"v-for")){var n=t.match(Ks);if(!n)return;e.for=n[2].trim();var r=n[1].trim(),i=r.match(Js);i?(e.alias=i[1].trim(),e.iterator1=i[2].trim(),i[3]&&(e.iterator2=i[3].trim())):e.alias=r}}function Tr(e){var t=hn(e,"v-if");if(t)e.if=t,Nr(e,{exp:t,block:e});else{null!=hn(e,"v-else")&&(e.else=!0);var n=hn(e,"v-else-if");n&&(e.elseif=n)}}function Er(e,t){var n=jr(t.children);n&&n.if&&Nr(n,{exp:e.elseif,block:e})}function jr(e){for(var t=e.length;t--;){if(1===e[t].type)return e[t];e.pop()}}function Nr(e,t){e.ifConditions||(e.ifConditions=[]),e.ifConditions.push(t)}function Lr(e){null!=hn(e,"v-once")&&(e.once=!0)}function Ir(e){if("slot"===e.tag)e.slotName=vn(e,"name");else{var t;"template"===e.tag?(t=hn(e,"scope"),e.slotScope=t||hn(e,"slot-scope")):(t=hn(e,"slot-scope"))&&(e.slotScope=t);var n=vn(e,"slot");n&&(e.slotTarget='""'===n?'"default"':n,"template"===e.tag||e.slotScope||fn(e,"slot",n))}}function Mr(e){var t;(t=vn(e,"is"))&&(e.component=t),null!=hn(e,"inline-template")&&(e.inlineTemplate=!0)}function Dr(e){var t,n,r,i,o,a,s,c=e.attrsList;for(t=0,n=c.length;t<n;t++)if(r=i=c[t].name,o=c[t].value,zs.test(r))if(e.hasBindings=!0,(a=Fr(r))&&(r=r.replace(Gs,"")),Ws.test(r))r=r.replace(Ws,""),o=an(o),s=!1,a&&(a.prop&&(s=!0,"innerHtml"===(r=Li(r))&&(r="innerHTML")),a.camel&&(r=Li(r)),a.sync&&pn(e,"update:"+Li(r),yn(o,"$event"))),s||!e.component&&js(e.tag,e.attrsMap.type,r)?ln(e,r,o):fn(e,r,o);else if(Vs.test(r))pn(e,r=r.replace(Vs,""),o,a,!1,ks);else{var u=(r=r.replace(zs,"")).match(qs),l=u&&u[1];l&&(r=r.slice(0,-(l.length+1))),dn(e,r,i,o,l,a)}else fn(e,r,JSON.stringify(o)),!e.component&&"muted"===r&&js(e.tag,e.attrsMap.type,r)&&ln(e,r,"true")}function Pr(e){for(var t=e;t;){if(void 0!==t.for)return!0;t=t.parent}return!1}function Fr(e){var t=e.match(Gs);if(t){var n={};return t.forEach(function(e){n[e.slice(1)]=!0}),n}}function Rr(e){for(var t={},n=0,r=e.length;n<r;n++)t[e[n].name]=e[n].value;return t}function Hr(e){return"script"===e.tag||"style"===e.tag}function Br(e){return"style"===e.tag||"script"===e.tag&&(!e.attrsMap.type||"text/javascript"===e.attrsMap.type)}function Ur(e){for(var t=[],n=0;n<e.length;n++){var r=e[n];Xs.test(r.name)||(r.name=r.name.replace(Ys,""),t.push(r))}return t}function Vr(e){return $r(e.tag,e.attrsList.slice(),e.parent)}function zr(e,t,n){e.attrsMap[t]=n,e.attrsList.push({name:t,value:n})}function Kr(e,t){e&&(Ls=tc(t.staticKeys||""),Is=t.isReservedTag||Pi,Jr(e),qr(e,!1))}function Jr(e){if(e.static=Wr(e),1===e.type){if(!Is(e.tag)&&"slot"!==e.tag&&null==e.attrsMap["inline-template"])return;for(var t=0,n=e.children.length;t<n;t++){var r=e.children[t];Jr(r),r.static||(e.static=!1)}if(e.ifConditions)for(var i=1,o=e.ifConditions.length;i<o;i++){var a=e.ifConditions[i].block;Jr(a),a.static||(e.static=!1)}}}function qr(e,t){if(1===e.type){if((e.static||e.once)&&(e.staticInFor=t),e.static&&e.children.length&&(1!==e.children.length||3!==e.children[0].type))return void(e.staticRoot=!0);if(e.staticRoot=!1,e.children)for(var n=0,r=e.children.length;n<r;n++)qr(e.children[n],t||!!e.for);if(e.ifConditions)for(var i=1,o=e.ifConditions.length;i<o;i++)qr(e.ifConditions[i].block,t)}}function Wr(e){return 2!==e.type&&(3===e.type||!(!e.pre&&(e.hasBindings||e.if||e.for||Ti(e.tag)||!Is(e.tag)||Gr(e)||!Object.keys(e).every(Ls))))}function Gr(e){for(;e.parent;){if("template"!==(e=e.parent).tag)return!1;if(e.for)return!0}return!1}function Zr(e,t,n){var r=t?"nativeOn:{":"on:{";for(var i in e)r+='"'+i+'":'+Xr(i,e[i])+",";return r.slice(0,-1)+"}"}function Xr(e,t){if(!t)return"function(){}";if(Array.isArray(t))return"["+t.map(function(t){return Xr(e,t)}).join(",")+"]";var n=rc.test(t.value),r=nc.test(t.value);if(t.modifiers){var i="",o="",a=[];for(var s in t.modifiers)if(ac[s])o+=ac[s],ic[s]&&a.push(s);else if("exact"===s){var c=t.modifiers;o+=oc(["ctrl","shift","alt","meta"].filter(function(e){return!c[e]}).map(function(e){return"$event."+e+"Key"}).join("||"))}else a.push(s);return a.length&&(i+=Yr(a)),o&&(i+=o),"function($event){"+i+(n?t.value+"($event)":r?"("+t.value+")($event)":t.value)+"}"}return n||r?t.value:"function($event){"+t.value+"}"}function Yr(e){return"if(!('button' in $event)&&"+e.map(Qr).join("&&")+")return null;"}function Qr(e){var t=parseInt(e,10);if(t)return"$event.keyCode!=="+t;var n=ic[e];return"_k($event.keyCode,"+JSON.stringify(e)+","+JSON.stringify(n)+",$event.key)"}function ei(e,t){var n=new cc(t);return{render:"with(this){return "+(e?ti(e,n):'_c("div")')+"}",staticRenderFns:n.staticRenderFns}}function ti(e,t){if(e.staticRoot&&!e.staticProcessed)return ni(e,t);if(e.once&&!e.onceProcessed)return ri(e,t);if(e.for&&!e.forProcessed)return ai(e,t);if(e.if&&!e.ifProcessed)return ii(e,t);if("template"!==e.tag||e.slotTarget){if("slot"===e.tag)return _i(e,t);var n;if(e.component)n=bi(e.component,e,t);else{var r=e.plain?void 0:si(e,t),i=e.inlineTemplate?null:pi(e,t,!0);n="_c('"+e.tag+"'"+(r?","+r:"")+(i?","+i:"")+")"}for(var o=0;o<t.transforms.length;o++)n=t.transforms[o](e,n);return n}return pi(e,t)||"void 0"}function ni(e,t,n){return e.staticProcessed=!0,t.staticRenderFns.push("with(this){return "+ti(e,t)+"}"),"_m("+(t.staticRenderFns.length-1)+","+(e.staticInFor?"true":"false")+","+(n?"true":"false")+")"}function ri(e,t){if(e.onceProcessed=!0,e.if&&!e.ifProcessed)return ii(e,t);if(e.staticInFor){for(var n="",r=e.parent;r;){if(r.for){n=r.key;break}r=r.parent}return n?"_o("+ti(e,t)+","+t.onceId+++","+n+")":ti(e,t)}return ni(e,t,!0)}function ii(e,t,n,r){return e.ifProcessed=!0,oi(e.ifConditions.slice(),t,n,r)}function oi(e,t,n,r){function i(e){return n?n(e,t):e.once?ri(e,t):ti(e,t)}if(!e.length)return r||"_e()";var o=e.shift();return o.exp?"("+o.exp+")?"+i(o.block)+":"+oi(e,t,n,r):""+i(o.block)}function ai(e,t,n,r){var i=e.for,o=e.alias,a=e.iterator1?","+e.iterator1:"",s=e.iterator2?","+e.iterator2:"";return e.forProcessed=!0,(r||"_l")+"(("+i+"),function("+o+a+s+"){return "+(n||ti)(e,t)+"})"}function si(e,t){var n="{",r=ci(e,t);r&&(n+=r+","),e.key&&(n+="key:"+e.key+","),e.ref&&(n+="ref:"+e.ref+","),e.refInFor&&(n+="refInFor:true,"),e.pre&&(n+="pre:true,"),e.component&&(n+='tag:"'+e.tag+'",');for(var i=0;i<t.dataGenFns.length;i++)n+=t.dataGenFns[i](e);if(e.attrs&&(n+="attrs:{"+$i(e.attrs)+"},"),e.props&&(n+="domProps:{"+$i(e.props)+"},"),e.events&&(n+=Zr(e.events,!1,t.warn)+","),e.nativeEvents&&(n+=Zr(e.nativeEvents,!0,t.warn)+","),e.slotTarget&&!e.slotScope&&(n+="slot:"+e.slotTarget+","),e.scopedSlots&&(n+=li(e.scopedSlots,t)+","),e.model&&(n+="model:{value:"+e.model.value+",callback:"+e.model.callback+",expression:"+e.model.expression+"},"),e.inlineTemplate){var o=ui(e,t);o&&(n+=o+",")}return n=n.replace(/,$/,"")+"}",e.wrapData&&(n=e.wrapData(n)),e.wrapListeners&&(n=e.wrapListeners(n)),n}function ci(e,t){var n=e.directives;if(n){var r,i,o,a,s="directives:[",c=!1;for(r=0,i=n.length;r<i;r++){o=n[r],a=!0;var u=t.directives[o.name];u&&(a=!!u(e,o,t.warn)),a&&(c=!0,s+='{name:"'+o.name+'",rawName:"'+o.rawName+'"'+(o.value?",value:("+o.value+"),expression:"+JSON.stringify(o.value):"")+(o.arg?',arg:"'+o.arg+'"':"")+(o.modifiers?",modifiers:"+JSON.stringify(o.modifiers):"")+"},")}return c?s.slice(0,-1)+"]":void 0}}function ui(e,t){var n=e.children[0];if(1===n.type){var r=ei(n,t.options);return"inlineTemplate:{render:function(){"+r.render+"},staticRenderFns:["+r.staticRenderFns.map(function(e){return"function(){"+e+"}"}).join(",")+"]}"}}function li(e,t){return"scopedSlots:_u(["+Object.keys(e).map(function(n){return fi(n,e[n],t)}).join(",")+"])"}function fi(e,t,n){return t.for&&!t.forProcessed?di(e,t,n):"{key:"+e+",fn:"+("function("+String(t.slotScope)+"){return "+("template"===t.tag?t.if?t.if+"?"+(pi(t,n)||"undefined")+":undefined":pi(t,n)||"undefined":ti(t,n))+"}")+"}"}function di(e,t,n){var r=t.for,i=t.alias,o=t.iterator1?","+t.iterator1:"",a=t.iterator2?","+t.iterator2:"";return t.forProcessed=!0,"_l(("+r+"),function("+i+o+a+"){return "+fi(e,t,n)+"})"}function pi(e,t,n,r,i){var o=e.children;if(o.length){var a=o[0];if(1===o.length&&a.for&&"template"!==a.tag&&"slot"!==a.tag)return(r||ti)(a,t);var s=n?vi(o,t.maybeComponent):0,c=i||mi;return"["+o.map(function(e){return c(e,t)}).join(",")+"]"+(s?","+s:"")}}function vi(e,t){for(var n=0,r=0;r<e.length;r++){var i=e[r];if(1===i.type){if(hi(i)||i.ifConditions&&i.ifConditions.some(function(e){return hi(e.block)})){n=2;break}(t(i)||i.ifConditions&&i.ifConditions.some(function(e){return t(e.block)}))&&(n=1)}}return n}function hi(e){return void 0!==e.for||"template"===e.tag||"slot"===e.tag}function mi(e,t){return 1===e.type?ti(e,t):3===e.type&&e.isComment?gi(e):yi(e)}function yi(e){return"_v("+(2===e.type?e.expression:Ci(JSON.stringify(e.text)))+")"}function gi(e){return"_e("+JSON.stringify(e.text)+")"}function _i(e,t){var n=e.slotName||'"default"',r=pi(e,t),i="_t("+n+(r?","+r:""),o=e.attrs&&"{"+e.attrs.map(function(e){return Li(e.name)+":"+e.value}).join(",")+"}",a=e.attrsMap["v-bind"];return!o&&!a||r||(i+=",null"),o&&(i+=","+o),a&&(i+=(o?"":",null")+","+a),i+")"}function bi(e,t,n){var r=t.inlineTemplate?null:pi(t,n,!0);return"_c("+e+","+si(t,n)+(r?","+r:"")+")"}function $i(e){for(var t="",n=0;n<e.length;n++){var r=e[n];t+='"'+r.name+'":'+Ci(r.value)+","}return t.slice(0,-1)}function Ci(e){return e.replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function wi(e,t){try{return new Function(e)}catch(n){return t.push({err:n,code:e}),_}}function xi(e){var t=Object.create(null);return function(n,r,i){delete(r=y({},r)).warn;var o=r.delimiters?String(r.delimiters)+n:n;if(t[o])return t[o];var a=e(n,r),s={},c=[];return s.render=wi(a.render,c),s.staticRenderFns=a.staticRenderFns.map(function(e){return wi(e,c)}),t[o]=s}}function ki(e){return Ms=Ms||document.createElement("div"),Ms.innerHTML=e?'<a href="\n"/>':'<div a="\n"/>',Ms.innerHTML.indexOf("&#10;")>0}function Ai(e){if(e.outerHTML)return e.outerHTML;var t=document.createElement("div");return t.appendChild(e.cloneNode(!0)),t.innerHTML}var Oi=Object.freeze({}),Si=Object.prototype.toString,Ti=f("slot,component",!0),Ei=f("key,ref,slot,slot-scope,is"),ji=Object.prototype.hasOwnProperty,Ni=/-(\w)/g,Li=v(function(e){return e.replace(Ni,function(e,t){return t?t.toUpperCase():""})}),Ii=v(function(e){return e.charAt(0).toUpperCase()+e.slice(1)}),Mi=/\B([A-Z])/g,Di=v(function(e){return e.replace(Mi,"-$1").toLowerCase()}),Pi=function(e,t,n){return!1},Fi=function(e){return e},Ri="data-server-rendered",Hi=["component","directive","filter"],Bi=["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated","errorCaptured"],Ui={optionMergeStrategies:Object.create(null),silent:!1,productionTip:!1,devtools:!1,performance:!1,errorHandler:null,warnHandler:null,ignoredElements:[],keyCodes:Object.create(null),isReservedTag:Pi,isReservedAttr:Pi,isUnknownElement:Pi,getTagNamespace:_,parsePlatformTagName:Fi,mustUseProp:Pi,_lifecycleHooks:Bi},Vi=/[^\w.$]/,zi="__proto__"in{},Ki="undefined"!=typeof window,Ji="undefined"!=typeof WXEnvironment&&!!WXEnvironment.platform,qi=Ji&&WXEnvironment.platform.toLowerCase(),Wi=Ki&&window.navigator.userAgent.toLowerCase(),Gi=Wi&&/msie|trident/.test(Wi),Zi=Wi&&Wi.indexOf("msie 9.0")>0,Xi=Wi&&Wi.indexOf("edge/")>0,Yi=Wi&&Wi.indexOf("android")>0||"android"===qi,Qi=Wi&&/iphone|ipad|ipod|ios/.test(Wi)||"ios"===qi,eo=(Wi&&/chrome\/\d+/.test(Wi),{}.watch),to=!1;if(Ki)try{var no={};Object.defineProperty(no,"passive",{get:function(){to=!0}}),window.addEventListener("test-passive",null,no)}catch(e){}var ro,io,oo=function(){return void 0===ro&&(ro=!Ki&&"undefined"!=typeof global&&"server"===global.process.env.VUE_ENV),ro},ao=Ki&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__,so="undefined"!=typeof Symbol&&A(Symbol)&&"undefined"!=typeof Reflect&&A(Reflect.ownKeys);io="undefined"!=typeof Set&&A(Set)?Set:function(){function e(){this.set=Object.create(null)}return e.prototype.has=function(e){return!0===this.set[e]},e.prototype.add=function(e){this.set[e]=!0},e.prototype.clear=function(){this.set=Object.create(null)},e}();var co=_,uo=0,lo=function(){this.id=uo++,this.subs=[]};lo.prototype.addSub=function(e){this.subs.push(e)},lo.prototype.removeSub=function(e){d(this.subs,e)},lo.prototype.depend=function(){lo.target&&lo.target.addDep(this)},lo.prototype.notify=function(){for(var e=this.subs.slice(),t=0,n=e.length;t<n;t++)e[t].update()},lo.target=null;var fo=[],po=function(e,t,n,r,i,o,a,s){this.tag=e,this.data=t,this.children=n,this.text=r,this.elm=i,this.ns=void 0,this.context=o,this.functionalContext=void 0,this.functionalOptions=void 0,this.functionalScopeId=void 0,this.key=t&&t.key,this.componentOptions=a,this.componentInstance=void 0,this.parent=void 0,this.raw=!1,this.isStatic=!1,this.isRootInsert=!0,this.isComment=!1,this.isCloned=!1,this.isOnce=!1,this.asyncFactory=s,this.asyncMeta=void 0,this.isAsyncPlaceholder=!1},vo={child:{configurable:!0}};vo.child.get=function(){return this.componentInstance},Object.defineProperties(po.prototype,vo);var ho=function(e){void 0===e&&(e="");var t=new po;return t.text=e,t.isComment=!0,t},mo=Array.prototype,yo=Object.create(mo);["push","pop","shift","unshift","splice","sort","reverse"].forEach(function(e){var t=mo[e];x(yo,e,function(){for(var n=[],r=arguments.length;r--;)n[r]=arguments[r];var i,o=t.apply(this,n),a=this.__ob__;switch(e){case"push":case"unshift":i=n;break;case"splice":i=n.slice(2)}return i&&a.observeArray(i),a.dep.notify(),o})});var go=Object.getOwnPropertyNames(yo),_o={shouldConvert:!0},bo=function(e){this.value=e,this.dep=new lo,this.vmCount=0,x(e,"__ob__",this),Array.isArray(e)?((zi?N:L)(e,yo,go),this.observeArray(e)):this.walk(e)};bo.prototype.walk=function(e){for(var t=Object.keys(e),n=0;n<t.length;n++)M(e,t[n],e[t[n]])},bo.prototype.observeArray=function(e){for(var t=0,n=e.length;t<n;t++)I(e[t])};var $o=Ui.optionMergeStrategies;$o.data=function(e,t,n){return n?H(e,t,n):t&&"function"!=typeof t?e:H(e,t)},Bi.forEach(function(e){$o[e]=B}),Hi.forEach(function(e){$o[e+"s"]=U}),$o.watch=function(e,t,n,r){if(e===eo&&(e=void 0),t===eo&&(t=void 0),!t)return Object.create(e||null);if(!e)return t;var i={};y(i,e);for(var o in t){var a=i[o],s=t[o];a&&!Array.isArray(a)&&(a=[a]),i[o]=a?a.concat(s):Array.isArray(s)?s:[s]}return i},$o.props=$o.methods=$o.inject=$o.computed=function(e,t,n,r){if(!e)return t;var i=Object.create(null);return y(i,e),t&&y(i,t),i},$o.provide=H;var Co,wo,xo=function(e,t){return void 0===t?e:t},ko=[],Ao=!1,Oo=!1;if("undefined"!=typeof setImmediate&&A(setImmediate))wo=function(){setImmediate(te)};else if("undefined"==typeof MessageChannel||!A(MessageChannel)&&"[object MessageChannelConstructor]"!==MessageChannel.toString())wo=function(){setTimeout(te,0)};else{var So=new MessageChannel,To=So.port2;So.port1.onmessage=te,wo=function(){To.postMessage(1)}}if("undefined"!=typeof Promise&&A(Promise)){var Eo=Promise.resolve();Co=function(){Eo.then(te),Qi&&setTimeout(_)}}else Co=wo;var jo,No=new io,Lo=v(function(e){var t="&"===e.charAt(0),n="~"===(e=t?e.slice(1):e).charAt(0),r="!"===(e=n?e.slice(1):e).charAt(0);return e=r?e.slice(1):e,{name:e,once:n,capture:r,passive:t}}),Io=null,Mo=[],Do=[],Po={},Fo=!1,Ro=!1,Ho=0,Bo=0,Uo=function(e,t,n,r){this.vm=e,e._watchers.push(this),r?(this.deep=!!r.deep,this.user=!!r.user,this.lazy=!!r.lazy,this.sync=!!r.sync):this.deep=this.user=this.lazy=this.sync=!1,this.cb=n,this.id=++Bo,this.active=!0,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new io,this.newDepIds=new io,this.expression="","function"==typeof t?this.getter=t:(this.getter=k(t),this.getter||(this.getter=function(){})),this.value=this.lazy?void 0:this.get()};Uo.prototype.get=function(){O(this);var e,t=this.vm;try{e=this.getter.call(t,t)}catch(e){if(!this.user)throw e;Y(e,t,'getter for watcher "'+this.expression+'"')}finally{this.deep&&ie(e),S(),this.cleanupDeps()}return e},Uo.prototype.addDep=function(e){var t=e.id;this.newDepIds.has(t)||(this.newDepIds.add(t),this.newDeps.push(e),this.depIds.has(t)||e.addSub(this))},Uo.prototype.cleanupDeps=function(){for(var e=this,t=this.deps.length;t--;){var n=e.deps[t];e.newDepIds.has(n.id)||n.removeSub(e)}var r=this.depIds;this.depIds=this.newDepIds,this.newDepIds=r,this.newDepIds.clear(),r=this.deps,this.deps=this.newDeps,this.newDeps=r,this.newDeps.length=0},Uo.prototype.update=function(){this.lazy?this.dirty=!0:this.sync?this.run():Re(this)},Uo.prototype.run=function(){if(this.active){var e=this.get();if(e!==this.value||o(e)||this.deep){var t=this.value;if(this.value=e,this.user)try{this.cb.call(this.vm,e,t)}catch(e){Y(e,this.vm,'callback for watcher "'+this.expression+'"')}else this.cb.call(this.vm,e,t)}}},Uo.prototype.evaluate=function(){this.value=this.get(),this.dirty=!1},Uo.prototype.depend=function(){for(var e=this,t=this.deps.length;t--;)e.deps[t].depend()},Uo.prototype.teardown=function(){var e=this;if(this.active){this.vm._isBeingDestroyed||d(this.vm._watchers,this);for(var t=this.deps.length;t--;)e.deps[t].removeSub(e);this.active=!1}};var Vo={enumerable:!0,configurable:!0,get:_,set:_},zo={lazy:!0};lt(ft.prototype);var Ko={init:function(e,t,n,r){if(!e.componentInstance||e.componentInstance._isDestroyed)(e.componentInstance=ht(e,Io,n,r)).$mount(t?e.elm:void 0,t);else if(e.data.keepAlive){var i=e;Ko.prepatch(i,i)}},prepatch:function(e,t){var n=t.componentOptions;Te(t.componentInstance=e.componentInstance,n.propsData,n.listeners,t,n.children)},insert:function(e){var t=e.context,n=e.componentInstance;n._isMounted||(n._isMounted=!0,Le(n,"mounted")),e.data.keepAlive&&(t._isMounted?Pe(n):je(n,!0))},destroy:function(e){var t=e.componentInstance;t._isDestroyed||(e.data.keepAlive?Ne(t,!0):t.$destroy())}},Jo=Object.keys(Ko),qo=1,Wo=2,Go=0;!function(e){e.prototype._init=function(e){var t=this;t._uid=Go++,t._isVue=!0,e&&e._isComponent?wt(t,e):t.$options=J(xt(t.constructor),e||{},t),t._renderProxy=t,t._self=t,Oe(t),be(t),Ct(t),Le(t,"beforeCreate"),Ye(t),Be(t),Xe(t),Le(t,"created"),t.$options.el&&t.$mount(t.$options.el)}}(Ot),function(e){var t={};t.get=function(){return this._data};var n={};n.get=function(){return this._props},Object.defineProperty(e.prototype,"$data",t),Object.defineProperty(e.prototype,"$props",n),e.prototype.$set=D,e.prototype.$delete=P,e.prototype.$watch=function(e,t,n){var r=this;if(a(t))return Ze(r,e,t,n);(n=n||{}).user=!0;var i=new Uo(r,e,t,n);return n.immediate&&t.call(r,i.value),function(){i.teardown()}}}(Ot),function(e){var t=/^hook:/;e.prototype.$on=function(e,n){var r=this,i=this;if(Array.isArray(e))for(var o=0,a=e.length;o<a;o++)r.$on(e[o],n);else(i._events[e]||(i._events[e]=[])).push(n),t.test(e)&&(i._hasHookEvent=!0);return i},e.prototype.$once=function(e,t){function n(){r.$off(e,n),t.apply(r,arguments)}var r=this;return n.fn=t,r.$on(e,n),r},e.prototype.$off=function(e,t){var n=this,r=this;if(!arguments.length)return r._events=Object.create(null),r;if(Array.isArray(e)){for(var i=0,o=e.length;i<o;i++)n.$off(e[i],t);return r}var a=r._events[e];if(!a)return r;if(!t)return r._events[e]=null,r;if(t)for(var s,c=a.length;c--;)if((s=a[c])===t||s.fn===t){a.splice(c,1);break}return r},e.prototype.$emit=function(e){var t=this,n=t._events[e];if(n){n=n.length>1?m(n):n;for(var r=m(arguments,1),i=0,o=n.length;i<o;i++)try{n[i].apply(t,r)}catch(n){Y(n,t,'event handler for "'+e+'"')}}return t}}(Ot),function(e){e.prototype._update=function(e,t){var n=this;n._isMounted&&Le(n,"beforeUpdate");var r=n.$el,i=n._vnode,o=Io;Io=n,n._vnode=e,i?n.$el=n.__patch__(i,e):(n.$el=n.__patch__(n.$el,e,t,!1,n.$options._parentElm,n.$options._refElm),n.$options._parentElm=n.$options._refElm=null),Io=o,r&&(r.__vue__=null),n.$el&&(n.$el.__vue__=n),n.$vnode&&n.$parent&&n.$vnode===n.$parent._vnode&&(n.$parent.$el=n.$el)},e.prototype.$forceUpdate=function(){var e=this;e._watcher&&e._watcher.update()},e.prototype.$destroy=function(){var e=this;if(!e._isBeingDestroyed){Le(e,"beforeDestroy"),e._isBeingDestroyed=!0;var t=e.$parent;!t||t._isBeingDestroyed||e.$options.abstract||d(t.$children,e),e._watcher&&e._watcher.teardown();for(var n=e._watchers.length;n--;)e._watchers[n].teardown();e._data.__ob__&&e._data.__ob__.vmCount--,e._isDestroyed=!0,e.__patch__(e._vnode,null),Le(e,"destroyed"),e.$off(),e.$el&&(e.$el.__vue__=null),e.$vnode&&(e.$vnode.parent=null)}}}(Ot),function(e){lt(e.prototype),e.prototype.$nextTick=function(e){return re(e,this)},e.prototype._render=function(){var e=this,t=e.$options,n=t.render,r=t._parentVnode;if(e._isMounted)for(var i in e.$slots){var o=e.$slots[i];(o._rendered||o[0]&&o[0].elm)&&(e.$slots[i]=j(o,!0))}e.$scopedSlots=r&&r.data.scopedSlots||Oi,e.$vnode=r;var a;try{a=n.call(e._renderProxy,e.$createElement)}catch(t){Y(t,e,"render"),a=e._vnode}return a instanceof po||(a=ho()),a.parent=r,a}}(Ot);var Zo=[String,RegExp,Array],Xo={KeepAlive:{name:"keep-alive",abstract:!0,props:{include:Zo,exclude:Zo,max:[String,Number]},created:function(){this.cache=Object.create(null),this.keys=[]},destroyed:function(){var e=this;for(var t in e.cache)Pt(e.cache,t,e.keys)},watch:{include:function(e){Dt(this,function(t){return Mt(e,t)})},exclude:function(e){Dt(this,function(t){return!Mt(e,t)})}},render:function(){var e=this.$slots.default,t=_e(e),n=t&&t.componentOptions;if(n){var r=It(n),i=this,o=i.include,a=i.exclude;if(o&&(!r||!Mt(o,r))||a&&r&&Mt(a,r))return t;var s=this,c=s.cache,u=s.keys,l=null==t.key?n.Ctor.cid+(n.tag?"::"+n.tag:""):t.key;c[l]?(t.componentInstance=c[l].componentInstance,d(u,l),u.push(l)):(c[l]=t,u.push(l),this.max&&u.length>parseInt(this.max)&&Pt(c,u[0],u,this._vnode)),t.data.keepAlive=!0}return t||e&&e[0]}}};!function(e){var t={};t.get=function(){return Ui},Object.defineProperty(e,"config",t),e.util={warn:co,extend:y,mergeOptions:J,defineReactive:M},e.set=D,e.delete=P,e.nextTick=re,e.options=Object.create(null),Hi.forEach(function(t){e.options[t+"s"]=Object.create(null)}),e.options._base=e,y(e.options.components,Xo),St(e),Tt(e),Et(e),Lt(e)}(Ot),Object.defineProperty(Ot.prototype,"$isServer",{get:oo}),Object.defineProperty(Ot.prototype,"$ssrContext",{get:function(){return this.$vnode&&this.$vnode.ssrContext}}),Ot.version="2.5.8";var Yo,Qo,ea,ta,na,ra,ia,oa,aa=f("style,class"),sa=f("input,textarea,option,select,progress"),ca=function(e,t,n){return"value"===n&&sa(e)&&"button"!==t||"selected"===n&&"option"===e||"checked"===n&&"input"===e||"muted"===n&&"video"===e},ua=f("contenteditable,draggable,spellcheck"),la=f("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),fa="http://www.w3.org/1999/xlink",da=function(e){return":"===e.charAt(5)&&"xlink"===e.slice(0,5)},pa=function(e){return da(e)?e.slice(6,e.length):""},va=function(e){return null==e||!1===e},ha={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},ma=f("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),ya=f("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),ga=function(e){return ma(e)||ya(e)},_a=Object.create(null),ba=f("text,number,password,search,email,tel,url"),$a=Object.freeze({createElement:function(e,t){var n=document.createElement(e);return"select"!==e?n:(t.data&&t.data.attrs&&void 0!==t.data.attrs.multiple&&n.setAttribute("multiple","multiple"),n)},createElementNS:function(e,t){return document.createElementNS(ha[e],t)},createTextNode:function(e){return document.createTextNode(e)},createComment:function(e){return document.createComment(e)},insertBefore:function(e,t,n){e.insertBefore(t,n)},removeChild:function(e,t){e.removeChild(t)},appendChild:function(e,t){e.appendChild(t)},parentNode:function(e){return e.parentNode},nextSibling:function(e){return e.nextSibling},tagName:function(e){return e.tagName},setTextContent:function(e,t){e.textContent=t},setAttribute:function(e,t,n){e.setAttribute(t,n)}}),Ca={create:function(e,t){qt(t)},update:function(e,t){e.data.ref!==t.data.ref&&(qt(e,!0),qt(t))},destroy:function(e){qt(e,!0)}},wa=new po("",{},[]),xa=["create","activate","update","remove","destroy"],ka={create:Xt,update:Xt,destroy:function(e){Xt(e,wa)}},Aa=Object.create(null),Oa=[Ca,ka],Sa={create:nn,update:nn},Ta={create:on,update:on},Ea=/[\w).+\-_$\]]/,ja="__r",Na="__c",La={create:Nn,update:Nn},Ia={create:Ln,update:Ln},Ma=v(function(e){var t={},n=/;(?![^(]*\))/g,r=/:(.+)/;return e.split(n).forEach(function(e){if(e){var n=e.split(r);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}),Da=/^--/,Pa=/\s*!important$/,Fa=function(e,t,n){if(Da.test(t))e.style.setProperty(t,n);else if(Pa.test(n))e.style.setProperty(t,n.replace(Pa,""),"important");else{var r=Ha(t);if(Array.isArray(n))for(var i=0,o=n.length;i<o;i++)e.style[r]=n[i];else e.style[r]=n}},Ra=["Webkit","Moz","ms"],Ha=v(function(e){if(oa=oa||document.createElement("div").style,"filter"!==(e=Li(e))&&e in oa)return e;for(var t=e.charAt(0).toUpperCase()+e.slice(1),n=0;n<Ra.length;n++){var r=Ra[n]+t;if(r in oa)return r}}),Ba={create:Hn,update:Hn},Ua=v(function(e){return{enterClass:e+"-enter",enterToClass:e+"-enter-to",enterActiveClass:e+"-enter-active",leaveClass:e+"-leave",leaveToClass:e+"-leave-to",leaveActiveClass:e+"-leave-active"}}),Va=Ki&&!Zi,za="transition",Ka="animation",Ja="transition",qa="transitionend",Wa="animation",Ga="animationend";Va&&(void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend&&(Ja="WebkitTransition",qa="webkitTransitionEnd"),void 0===window.onanimationend&&void 0!==window.onwebkitanimationend&&(Wa="WebkitAnimation",Ga="webkitAnimationEnd"));var Za=Ki?window.requestAnimationFrame?window.requestAnimationFrame.bind(window):setTimeout:function(e){return e()},Xa=/\b(transform|all)(,|$)/,Ya=function(r){function o(e){return new po(j.tagName(e).toLowerCase(),{},[],void 0,e)}function a(e,t){function n(){0==--n.listeners&&s(e)}return n.listeners=t,n}function s(e){var n=j.parentNode(e);t(n)&&j.removeChild(n,e)}function c(e,r,i,o,a){if(e.isRootInsert=!a,!u(e,r,i,o)){var s=e.data,c=e.children,l=e.tag;t(l)?(e.elm=e.ns?j.createElementNS(e.ns,l):j.createElement(l,e),y(e),v(e,c,r),t(s)&&m(e,r),p(i,e.elm,o)):n(e.isComment)?(e.elm=j.createComment(e.text),p(i,e.elm,o)):(e.elm=j.createTextNode(e.text),p(i,e.elm,o))}}function u(e,r,i,o){var a=e.data;if(t(a)){var s=t(e.componentInstance)&&a.keepAlive;if(t(a=a.hook)&&t(a=a.init)&&a(e,!1,i,o),t(e.componentInstance))return l(e,r),n(s)&&d(e,r,i,o),!0}}function l(e,n){t(e.data.pendingInsert)&&(n.push.apply(n,e.data.pendingInsert),e.data.pendingInsert=null),e.elm=e.componentInstance.$el,h(e)?(m(e,n),y(e)):(qt(e),n.push(e))}function d(e,n,r,i){for(var o,a=e;a.componentInstance;)if(a=a.componentInstance._vnode,t(o=a.data)&&t(o=o.transition)){for(o=0;o<T.activate.length;++o)T.activate[o](wa,a);n.push(a);break}p(r,e.elm,i)}function p(e,n,r){t(e)&&(t(r)?r.parentNode===e&&j.insertBefore(e,n,r):j.appendChild(e,n))}function v(e,t,n){if(Array.isArray(t))for(var r=0;r<t.length;++r)c(t[r],n,e.elm,null,!0);else i(e.text)&&j.appendChild(e.elm,j.createTextNode(e.text))}function h(e){for(;e.componentInstance;)e=e.componentInstance._vnode;return t(e.tag)}function m(e,n){for(var r=0;r<T.create.length;++r)T.create[r](wa,e);t(O=e.data.hook)&&(t(O.create)&&O.create(wa,e),t(O.insert)&&n.push(e))}function y(e){var n;if(t(n=e.functionalScopeId))j.setAttribute(e.elm,n,"");else for(var r=e;r;)t(n=r.context)&&t(n=n.$options._scopeId)&&j.setAttribute(e.elm,n,""),r=r.parent;t(n=Io)&&n!==e.context&&n!==e.functionalContext&&t(n=n.$options._scopeId)&&j.setAttribute(e.elm,n,"")}function g(e,t,n,r,i,o){for(;r<=i;++r)c(n[r],o,e,t)}function _(e){var n,r,i=e.data;if(t(i))for(t(n=i.hook)&&t(n=n.destroy)&&n(e),n=0;n<T.destroy.length;++n)T.destroy[n](e);if(t(n=e.children))for(r=0;r<e.children.length;++r)_(e.children[r])}function b(e,n,r,i){for(;r<=i;++r){var o=n[r];t(o)&&(t(o.tag)?($(o),_(o)):s(o.elm))}}function $(e,n){if(t(n)||t(e.data)){var r,i=T.remove.length+1;for(t(n)?n.listeners+=i:n=a(e.elm,i),t(r=e.componentInstance)&&t(r=r._vnode)&&t(r.data)&&$(r,n),r=0;r<T.remove.length;++r)T.remove[r](e,n);t(r=e.data.hook)&&t(r=r.remove)?r(e,n):n()}else s(e.elm)}function C(n,r,i,o,a){for(var s,u,l,f=0,d=0,p=r.length-1,v=r[0],h=r[p],m=i.length-1,y=i[0],_=i[m],$=!a;f<=p&&d<=m;)e(v)?v=r[++f]:e(h)?h=r[--p]:Wt(v,y)?(x(v,y,o),v=r[++f],y=i[++d]):Wt(h,_)?(x(h,_,o),h=r[--p],_=i[--m]):Wt(v,_)?(x(v,_,o),$&&j.insertBefore(n,v.elm,j.nextSibling(h.elm)),v=r[++f],_=i[--m]):Wt(h,y)?(x(h,y,o),$&&j.insertBefore(n,h.elm,v.elm),h=r[--p],y=i[++d]):(e(s)&&(s=Zt(r,f,p)),e(u=t(y.key)?s[y.key]:w(y,r,f,p))?c(y,o,n,v.elm):Wt(l=r[u],y)?(x(l,y,o),r[u]=void 0,$&&j.insertBefore(n,l.elm,v.elm)):c(y,o,n,v.elm),y=i[++d]);f>p?g(n,e(i[m+1])?null:i[m+1].elm,i,d,m,o):d>m&&b(n,r,f,p)}function w(e,n,r,i){for(var o=r;o<i;o++){var a=n[o];if(t(a)&&Wt(e,a))return o}}function x(r,i,o,a){if(r!==i){var s=i.elm=r.elm;if(n(r.isAsyncPlaceholder))t(i.asyncFactory.resolved)?A(r.elm,i,o):i.isAsyncPlaceholder=!0;else if(n(i.isStatic)&&n(r.isStatic)&&i.key===r.key&&(n(i.isCloned)||n(i.isOnce)))i.componentInstance=r.componentInstance;else{var c,u=i.data;t(u)&&t(c=u.hook)&&t(c=c.prepatch)&&c(r,i);var l=r.children,f=i.children;if(t(u)&&h(i)){for(c=0;c<T.update.length;++c)T.update[c](r,i);t(c=u.hook)&&t(c=c.update)&&c(r,i)}e(i.text)?t(l)&&t(f)?l!==f&&C(s,l,f,o,a):t(f)?(t(r.text)&&j.setTextContent(s,""),g(s,null,f,0,f.length-1,o)):t(l)?b(s,l,0,l.length-1):t(r.text)&&j.setTextContent(s,""):r.text!==i.text&&j.setTextContent(s,i.text),t(u)&&t(c=u.hook)&&t(c=c.postpatch)&&c(r,i)}}}function k(e,r,i){if(n(i)&&t(e.parent))e.parent.data.pendingInsert=r;else for(var o=0;o<r.length;++o)r[o].data.hook.insert(r[o])}function A(e,r,i,o){var a,s=r.tag,c=r.data,u=r.children;if(o=o||c&&c.pre,r.elm=e,n(r.isComment)&&t(r.asyncFactory))return r.isAsyncPlaceholder=!0,!0;if(t(c)&&(t(a=c.hook)&&t(a=a.init)&&a(r,!0),t(a=r.componentInstance)))return l(r,i),!0;if(t(s)){if(t(u))if(e.hasChildNodes())if(t(a=c)&&t(a=a.domProps)&&t(a=a.innerHTML)){if(a!==e.innerHTML)return!1}else{for(var f=!0,d=e.firstChild,p=0;p<u.length;p++){if(!d||!A(d,u[p],i,o)){f=!1;break}d=d.nextSibling}if(!f||d)return!1}else v(r,u,i);if(t(c)){var h=!1;for(var y in c)if(!N(y)){h=!0,m(r,i);break}!h&&c.class&&ie(c.class)}}else e.data!==r.text&&(e.data=r.text);return!0}var O,S,T={},E=r.modules,j=r.nodeOps;for(O=0;O<xa.length;++O)for(T[xa[O]]=[],S=0;S<E.length;++S)t(E[S][xa[O]])&&T[xa[O]].push(E[S][xa[O]]);var N=f("attrs,class,staticClass,staticStyle,key");return function(r,i,a,s,u,l){if(!e(i)){var f=!1,d=[];if(e(r))f=!0,c(i,d,u,l);else{var p=t(r.nodeType);if(!p&&Wt(r,i))x(r,i,d,s);else{if(p){if(1===r.nodeType&&r.hasAttribute(Ri)&&(r.removeAttribute(Ri),a=!0),n(a)&&A(r,i,d))return k(i,d,!0),r;r=o(r)}var v=r.elm,m=j.parentNode(v);if(c(i,d,v._leaveCb?null:m,j.nextSibling(v)),t(i.parent))for(var y=i.parent,g=h(i);y;){for(var $=0;$<T.destroy.length;++$)T.destroy[$](y);if(y.elm=i.elm,g){for(var C=0;C<T.create.length;++C)T.create[C](wa,y);var w=y.data.hook.insert;if(w.merged)for(var O=1;O<w.fns.length;O++)w.fns[O]()}else qt(y);y=y.parent}t(m)?b(m,[r],0,0):t(r.tag)&&_(r)}}return k(i,d,f),i.elm}t(r)&&_(r)}}({nodeOps:$a,modules:[Sa,Ta,La,Ia,Ba,Ki?{create:tr,activate:tr,remove:function(e,t){!0!==e.data.show?Yn(e,t):t()}}:{}].concat(Oa)});Zi&&document.addEventListener("selectionchange",function(){var e=document.activeElement;e&&e.vmodel&&cr(e,"input")});var Qa={inserted:function(e,t,n,r){"select"===n.tag?(r.elm&&!r.elm._vOptions?ce(n,"postpatch",function(){Qa.componentUpdated(e,t,n)}):nr(e,t,n.context),e._vOptions=[].map.call(e.options,or)):("textarea"===n.tag||ba(e.type))&&(e._vModifiers=t.modifiers,t.modifiers.lazy||(e.addEventListener("change",sr),Yi||(e.addEventListener("compositionstart",ar),e.addEventListener("compositionend",sr)),Zi&&(e.vmodel=!0)))},componentUpdated:function(e,t,n){if("select"===n.tag){nr(e,t,n.context);var r=e._vOptions,i=e._vOptions=[].map.call(e.options,or);i.some(function(e,t){return!b(e,r[t])})&&(e.multiple?t.value.some(function(e){return ir(e,i)}):t.value!==t.oldValue&&ir(t.value,i))&&cr(e,"change")}}},es={model:Qa,show:{bind:function(e,t,n){var r=t.value,i=(n=ur(n)).data&&n.data.transition,o=e.__vOriginalDisplay="none"===e.style.display?"":e.style.display;r&&i?(n.data.show=!0,Xn(n,function(){e.style.display=o})):e.style.display=r?o:"none"},update:function(e,t,n){var r=t.value;r!==t.oldValue&&((n=ur(n)).data&&n.data.transition?(n.data.show=!0,r?Xn(n,function(){e.style.display=e.__vOriginalDisplay}):Yn(n,function(){e.style.display="none"})):e.style.display=r?e.__vOriginalDisplay:"none")},unbind:function(e,t,n,r,i){i||(e.style.display=e.__vOriginalDisplay)}}},ts={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterToClass:String,leaveToClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String,appearToClass:String,duration:[Number,String,Object]},ns={name:"transition",props:ts,abstract:!0,render:function(e){var t=this,n=this.$slots.default;if(n&&(n=n.filter(function(e){return e.tag||ge(e)})).length){var r=this.mode,o=n[0];if(pr(this.$vnode))return o;var a=lr(o);if(!a)return o;if(this._leaving)return dr(e,o);var s="__transition-"+this._uid+"-";a.key=null==a.key?a.isComment?s+"comment":s+a.tag:i(a.key)?0===String(a.key).indexOf(s)?a.key:s+a.key:a.key;var c=(a.data||(a.data={})).transition=fr(this),u=this._vnode,l=lr(u);if(a.data.directives&&a.data.directives.some(function(e){return"show"===e.name})&&(a.data.show=!0),l&&l.data&&!vr(a,l)&&!ge(l)&&(!l.componentInstance||!l.componentInstance._vnode.isComment)){var f=l.data.transition=y({},c);if("out-in"===r)return this._leaving=!0,ce(f,"afterLeave",function(){t._leaving=!1,t.$forceUpdate()}),dr(e,o);if("in-out"===r){if(ge(a))return u;var d,p=function(){d()};ce(c,"afterEnter",p),ce(c,"enterCancelled",p),ce(f,"delayLeave",function(e){d=e})}}return o}}},rs=y({tag:String,moveClass:String},ts);delete rs.mode;var is={Transition:ns,TransitionGroup:{props:rs,render:function(e){for(var t=this.tag||this.$vnode.data.tag||"span",n=Object.create(null),r=this.prevChildren=this.children,i=this.$slots.default||[],o=this.children=[],a=fr(this),s=0;s<i.length;s++){var c=i[s];c.tag&&null!=c.key&&0!==String(c.key).indexOf("__vlist")&&(o.push(c),n[c.key]=c,(c.data||(c.data={})).transition=a)}if(r){for(var u=[],l=[],f=0;f<r.length;f++){var d=r[f];d.data.transition=a,d.data.pos=d.elm.getBoundingClientRect(),n[d.key]?u.push(d):l.push(d)}this.kept=e(t,null,u),this.removed=l}return e(t,null,o)},beforeUpdate:function(){this.__patch__(this._vnode,this.kept,!1,!0),this._vnode=this.kept},updated:function(){var e=this.prevChildren,t=this.moveClass||(this.name||"v")+"-move";e.length&&this.hasMove(e[0].elm,t)&&(e.forEach(hr),e.forEach(mr),e.forEach(yr),this._reflow=document.body.offsetHeight,e.forEach(function(e){if(e.data.moved){var n=e.elm,r=n.style;Kn(n,t),r.transform=r.WebkitTransform=r.transitionDuration="",n.addEventListener(qa,n._moveCb=function e(r){r&&!/transform$/.test(r.propertyName)||(n.removeEventListener(qa,e),n._moveCb=null,Jn(n,t))})}}))},methods:{hasMove:function(e,t){if(!Va)return!1;if(this._hasMove)return this._hasMove;var n=e.cloneNode();e._transitionClasses&&e._transitionClasses.forEach(function(e){Un(n,e)}),Bn(n,t),n.style.display="none",this.$el.appendChild(n);var r=Wn(n);return this.$el.removeChild(n),this._hasMove=r.hasTransform}}}};Ot.config.mustUseProp=ca,Ot.config.isReservedTag=ga,Ot.config.isReservedAttr=aa,Ot.config.getTagNamespace=Kt,Ot.config.isUnknownElement=function(e){if(!Ki)return!0;if(ga(e))return!1;if(e=e.toLowerCase(),null!=_a[e])return _a[e];var t=document.createElement(e);return e.indexOf("-")>-1?_a[e]=t.constructor===window.HTMLUnknownElement||t.constructor===window.HTMLElement:_a[e]=/HTMLUnknownElement/.test(t.toString())},y(Ot.options.directives,es),y(Ot.options.components,is),Ot.prototype.__patch__=Ki?Ya:_,Ot.prototype.$mount=function(e,t){return e=e&&Ki?Jt(e):void 0,Se(this,e,t)},Ot.nextTick(function(){Ui.devtools&&ao&&ao.emit("init",Ot)},0);var os,as=/\{\{((?:.|\n)+?)\}\}/g,ss=/[-.*+?^${}()|[\]\/\\]/g,cs=v(function(e){var t=e[0].replace(ss,"\\$&"),n=e[1].replace(ss,"\\$&");return new RegExp(t+"((?:.|\\n)+?)"+n,"g")}),us={staticKeys:["staticClass"],transformNode:function(e,t){t.warn;var n=hn(e,"class");n&&(e.staticClass=JSON.stringify(n));var r=vn(e,"class",!1);r&&(e.classBinding=r)},genData:function(e){var t="";return e.staticClass&&(t+="staticClass:"+e.staticClass+","),e.classBinding&&(t+="class:"+e.classBinding+","),t}},ls={staticKeys:["staticStyle"],transformNode:function(e,t){var n=hn(e,"style");n&&(e.staticStyle=JSON.stringify(Ma(n)));var r=vn(e,"style",!1);r&&(e.styleBinding=r)},genData:function(e){var t="";return e.staticStyle&&(t+="staticStyle:"+e.staticStyle+","),e.styleBinding&&(t+="style:("+e.styleBinding+"),"),t}},fs={decode:function(e){return os=os||document.createElement("div"),os.innerHTML=e,os.textContent}},ds=f("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"),ps=f("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),vs=f("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"),hs=/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,ms="[a-zA-Z_][\\w\\-\\.]*",ys="((?:"+ms+"\\:)?"+ms+")",gs=new RegExp("^<"+ys),_s=/^\s*(\/?)>/,bs=new RegExp("^<\\/"+ys+"[^>]*>"),$s=/^<!DOCTYPE [^>]+>/i,Cs=/^<!--/,ws=/^<!\[/,xs=!1;"x".replace(/x(.)?/g,function(e,t){xs=""===t});var ks,As,Os,Ss,Ts,Es,js,Ns,Ls,Is,Ms,Ds=f("script,style,textarea",!0),Ps={},Fs={"&lt;":"<","&gt;":">","&quot;":'"',"&amp;":"&","&#10;":"\n","&#9;":"\t"},Rs=/&(?:lt|gt|quot|amp);/g,Hs=/&(?:lt|gt|quot|amp|#10|#9);/g,Bs=f("pre,textarea",!0),Us=function(e,t){return e&&Bs(e)&&"\n"===t[0]},Vs=/^@|^v-on:/,zs=/^v-|^@|^:/,Ks=/(.*?)\s+(?:in|of)\s+(.*)/,Js=/\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/,qs=/:(.*)$/,Ws=/^:|^v-bind:/,Gs=/\.[^.]+/g,Zs=v(fs.decode),Xs=/^xmlns:NS\d+/,Ys=/^NS\d+:/,Qs=[us,ls,{preTransformNode:function(e,t){if("input"===e.tag){var n=e.attrsMap;if(n["v-model"]&&(n["v-bind:type"]||n[":type"])){var r=vn(e,"type"),i=hn(e,"v-if",!0),o=i?"&&("+i+")":"",a=null!=hn(e,"v-else",!0),s=hn(e,"v-else-if",!0),c=Vr(e);Sr(c),zr(c,"type","checkbox"),kr(c,t),c.processed=!0,c.if="("+r+")==='checkbox'"+o,Nr(c,{exp:c.if,block:c});var u=Vr(e);hn(u,"v-for",!0),zr(u,"type","radio"),kr(u,t),Nr(c,{exp:"("+r+")==='radio'"+o,block:u});var l=Vr(e);return hn(l,"v-for",!0),zr(l,":type",r),kr(l,t),Nr(c,{exp:i,block:l}),a?c.else=!0:s&&(c.elseif=s),c}}}}],ec={expectHTML:!0,modules:Qs,directives:{model:function(e,t,n){var r=t.value,i=t.modifiers,o=e.tag,a=e.attrsMap.type;if(e.component)return mn(e,r,i),!1;if("select"===o)An(e,r,i);else if("input"===o&&"checkbox"===a)xn(e,r,i);else if("input"===o&&"radio"===a)kn(e,r,i);else if("input"===o||"textarea"===o)On(e,r,i);else if(!Ui.isReservedTag(o))return mn(e,r,i),!1;return!0},text:function(e,t){t.value&&ln(e,"textContent","_s("+t.value+")")},html:function(e,t){t.value&&ln(e,"innerHTML","_s("+t.value+")")}},isPreTag:function(e){return"pre"===e},isUnaryTag:ds,mustUseProp:ca,canBeLeftOpenTag:ps,isReservedTag:ga,getTagNamespace:Kt,staticKeys:function(e){return e.reduce(function(e,t){return e.concat(t.staticKeys||[])},[]).join(",")}(Qs)},tc=v(function(e){return f("type,tag,attrsList,attrsMap,plain,parent,children,attrs"+(e?","+e:""))}),nc=/^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/,rc=/^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/,ic={esc:27,tab:9,enter:13,space:32,up:38,left:37,right:39,down:40,delete:[8,46]},oc=function(e){return"if("+e+")return null;"},ac={stop:"$event.stopPropagation();",prevent:"$event.preventDefault();",self:oc("$event.target !== $event.currentTarget"),ctrl:oc("!$event.ctrlKey"),shift:oc("!$event.shiftKey"),alt:oc("!$event.altKey"),meta:oc("!$event.metaKey"),left:oc("'button' in $event && $event.button !== 0"),middle:oc("'button' in $event && $event.button !== 1"),right:oc("'button' in $event && $event.button !== 2")},sc={on:function(e,t){e.wrapListeners=function(e){return"_g("+e+","+t.value+")"}},bind:function(e,t){e.wrapData=function(n){return"_b("+n+",'"+e.tag+"',"+t.value+","+(t.modifiers&&t.modifiers.prop?"true":"false")+(t.modifiers&&t.modifiers.sync?",true":"")+")"}},cloak:_},cc=function(e){this.options=e,this.warn=e.warn||cn,this.transforms=un(e.modules,"transformCode"),this.dataGenFns=un(e.modules,"genData"),this.directives=y(y({},sc),e.directives);var t=e.isReservedTag||Pi;this.maybeComponent=function(e){return!t(e.tag)},this.onceId=0,this.staticRenderFns=[]},uc=(new RegExp("\\b"+"do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(",").join("\\b|\\b")+"\\b"),new RegExp("\\b"+"delete,typeof,void".split(",").join("\\s*\\([^\\)]*\\)|\\b")+"\\s*\\([^\\)]*\\)"),function(e){return function(t){function n(n,r){var i=Object.create(t),o=[],a=[];if(i.warn=function(e,t){(t?a:o).push(e)},r){r.modules&&(i.modules=(t.modules||[]).concat(r.modules)),r.directives&&(i.directives=y(Object.create(t.directives),r.directives));for(var s in r)"modules"!==s&&"directives"!==s&&(i[s]=r[s])}var c=e(n,i);return c.errors=o,c.tips=a,c}return{compile:n,compileToFunctions:xi(n)}}}(function(e,t){var n=Cr(e.trim(),t);Kr(n,t);var r=ei(n,t);return{ast:n,render:r.render,staticRenderFns:r.staticRenderFns}})(ec).compileToFunctions),lc=!!Ki&&ki(!1),fc=!!Ki&&ki(!0),dc=v(function(e){var t=Jt(e);return t&&t.innerHTML}),pc=Ot.prototype.$mount;return Ot.prototype.$mount=function(e,t){if((e=e&&Jt(e))===document.body||e===document.documentElement)return this;var n=this.$options;if(!n.render){var r=n.template;if(r)if("string"==typeof r)"#"===r.charAt(0)&&(r=dc(r));else{if(!r.nodeType)return this;r=r.innerHTML}else e&&(r=Ai(e));if(r){var i=uc(r,{shouldDecodeNewlines:lc,shouldDecodeNewlinesForHref:fc,delimiters:n.delimiters,comments:n.comments},this),o=i.render,a=i.staticRenderFns;n.render=o,n.staticRenderFns=a}}return pc.call(this,e,t)},Ot.compile=uc,Ot});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(11).setImmediate))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
  * vue-router v2.8.1
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

function extend (to, from) {
  for (var key in from) {
    to[key] = from[key];
  }
  return to
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    parsedQuery[key] = extraQuery[key];
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    var res = {};
    for (var key in value) {
      res[key] = clone(value[key]);
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  // handle null value #1566
  if (!a || !b) { return a === b }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*  */

// $flow-disable-line
var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = pathToRegexp_1.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  if (process.env.NODE_ENV !== 'production') {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent, strict) {
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  // Fix for #1585 for Firefox
  window.history.replaceState({ key: getStateKey() }, '');
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(function (shouldScroll) {
        scrollToPosition((shouldScroll), position);
      }).catch(function (err) {
        if (process.env.NODE_ENV !== 'production') {
          assert(false, err.toString());
        }
      });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';
  if (isObject && typeof shouldScroll.selector === 'string') {
    var el = document.querySelector(shouldScroll.selector);
    if (el) {
      var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

var hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol';

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    var initLocation = getLocation(this.base);
    window.addEventListener('popstate', function (e) {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === initLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (expectScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', function () {
      var current = this$1.current;
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        if (supportsScroll) {
          handleScroll(this$1.router, route, current, true);
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath);
        }
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function getUrl (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return (base + "#" + path)
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: { configurable: true } };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '2.8.1';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["a"] = (VueRouter);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/*!
 * vue-i18n v7.3.3 
 * (c) 2017 kazuya kawaguchi
 * Released under the MIT License.
 */
/*  */

/**
 * utilites
 */

function warn (msg, err) {
  if (typeof console !== 'undefined') {
    console.warn('[vue-i18n] ' + msg);
    /* istanbul ignore if */
    if (err) {
      console.warn(err.stack);
    }
  }
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

function isNull (val) {
  return val === null || val === undefined
}

function parseArgs () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  var locale = null;
  var params = null;
  if (args.length === 1) {
    if (isObject(args[0]) || Array.isArray(args[0])) {
      params = args[0];
    } else if (typeof args[0] === 'string') {
      locale = args[0];
    }
  } else if (args.length === 2) {
    if (typeof args[0] === 'string') {
      locale = args[0];
    }
    /* istanbul ignore if */
    if (isObject(args[1]) || Array.isArray(args[1])) {
      params = args[1];
    }
  }

  return { locale: locale, params: params }
}

function getOldChoiceIndexFixed (choice) {
  return choice
    ? choice > 1
      ? 1
      : 0
    : 1
}

function getChoiceIndex (choice, choicesLength) {
  choice = Math.abs(choice);

  if (choicesLength === 2) { return getOldChoiceIndexFixed(choice) }

  return choice ? Math.min(choice, 2) : 0
}

function fetchChoice (message, choice) {
  /* istanbul ignore if */
  if (!message && typeof message !== 'string') { return null }
  var choices = message.split('|');

  choice = getChoiceIndex(choice, choices.length);
  if (!choices[choice]) { return message }
  return choices[choice].trim()
}

function looseClone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

function merge (target) {
  var arguments$1 = arguments;

  var output = Object(target);
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments$1[i];
    if (source !== undefined && source !== null) {
      var key = (void 0);
      for (key in source) {
        if (hasOwn(source, key)) {
          if (isObject(source[key])) {
            output[key] = merge(output[key], source[key]);
          } else {
            output[key] = source[key];
          }
        }
      }
    }
  }
  return output
}

function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

var canUseDateTimeFormat =
  typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat !== 'undefined';

var canUseNumberFormat =
  typeof Intl !== 'undefined' && typeof Intl.NumberFormat !== 'undefined';

/*  */

function extend (Vue) {
  // $FlowFixMe
  Object.defineProperty(Vue.prototype, '$t', {
    get: function get () {
      var this$1 = this;

      return function (key) {
        var values = [], len = arguments.length - 1;
        while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

        var i18n = this$1.$i18n;
        return i18n._t.apply(i18n, [ key, i18n.locale, i18n._getMessages(), this$1 ].concat( values ))
      }
    }
  });
  // $FlowFixMe
  Object.defineProperty(Vue.prototype, '$tc', {
    get: function get$1 () {
      var this$1 = this;

      return function (key, choice) {
        var values = [], len = arguments.length - 2;
        while ( len-- > 0 ) values[ len ] = arguments[ len + 2 ];

        var i18n = this$1.$i18n;
        return i18n._tc.apply(i18n, [ key, i18n.locale, i18n._getMessages(), this$1, choice ].concat( values ))
      }
    }
  });
  // $FlowFixMe
  Object.defineProperty(Vue.prototype, '$te', {
    get: function get$2 () {
      var this$1 = this;

      return function (key, locale) {
        var i18n = this$1.$i18n;
        return i18n._te(key, i18n.locale, i18n._getMessages(), locale)
      }
    }
  });
  // $FlowFixMe
  Object.defineProperty(Vue.prototype, '$d', {
    get: function get$3 () {
      var this$1 = this;

      return function (value) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

        return (ref = this$1.$i18n).d.apply(ref, [ value ].concat( args ))
        var ref;
      }
    }
  });
  // $FlowFixMe
  Object.defineProperty(Vue.prototype, '$n', {
    get: function get$4 () {
      var this$1 = this;

      return function (value) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

        return (ref = this$1.$i18n).n.apply(ref, [ value ].concat( args ))
        var ref;
      }
    }
  });
}

/*  */

var mixin = {
  beforeCreate: function beforeCreate () {
    var options = this.$options;
    options.i18n = options.i18n || (options.__i18n ? {} : null);

    if (options.i18n) {
      if (options.i18n instanceof VueI18n) {
        // init locale messages via custom blocks
        if (options.__i18n) {
          try {
            var localeMessages = {};
            options.__i18n.forEach(function (resource) {
              localeMessages = merge(localeMessages, JSON.parse(resource));
            });
            Object.keys(localeMessages).forEach(function (locale) {
              options.i18n.mergeLocaleMessage(locale, localeMessages[locale]);
            });
          } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
              warn("Cannot parse locale messages via custom blocks.", e);
            }
          }
        }
        this._i18n = options.i18n;
        this._i18nWatcher = this._i18n.watchI18nData();
        this._i18n.subscribeDataChanging(this);
        this._subscribing = true;
      } else if (isPlainObject(options.i18n)) {
        // component local i18n
        if (this.$root && this.$root.$i18n && this.$root.$i18n instanceof VueI18n) {
          options.i18n.root = this.$root.$i18n;
          options.i18n.fallbackLocale = this.$root.$i18n.fallbackLocale;
          options.i18n.silentTranslationWarn = this.$root.$i18n.silentTranslationWarn;
        }

        // init locale messages via custom blocks
        if (options.__i18n) {
          try {
            var localeMessages$1 = {};
            options.__i18n.forEach(function (resource) {
              localeMessages$1 = merge(localeMessages$1, JSON.parse(resource));
            });
            options.i18n.messages = localeMessages$1;
          } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
              warn("Cannot parse locale messages via custom blocks.", e);
            }
          }
        }

        this._i18n = new VueI18n(options.i18n);
        this._i18nWatcher = this._i18n.watchI18nData();
        this._i18n.subscribeDataChanging(this);
        this._subscribing = true;

        if (options.i18n.sync === undefined || !!options.i18n.sync) {
          this._localeWatcher = this.$i18n.watchLocale();
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn("Cannot be interpreted 'i18n' option.");
        }
      }
    } else if (this.$root && this.$root.$i18n && this.$root.$i18n instanceof VueI18n) {
      // root i18n
      this._i18n = this.$root.$i18n;
      this._i18n.subscribeDataChanging(this);
      this._subscribing = true;
    } else if (options.parent && options.parent.$i18n && options.parent.$i18n instanceof VueI18n) {
      // parent i18n
      this._i18n = options.parent.$i18n;
      this._i18n.subscribeDataChanging(this);
      this._subscribing = true;
    }
  },

  beforeDestroy: function beforeDestroy () {
    if (!this._i18n) { return }

    if (this._subscribing) {
      this._i18n.unsubscribeDataChanging(this);
      delete this._subscribing;
    }

    if (this._i18nWatcher) {
      this._i18nWatcher();
      delete this._i18nWatcher;
    }

    if (this._localeWatcher) {
      this._localeWatcher();
      delete this._localeWatcher;
    }

    this._i18n = null;
  }
};

/*  */

var component = {
  name: 'i18n',
  functional: true,
  props: {
    tag: {
      type: String,
      default: 'span'
    },
    path: {
      type: String,
      required: true
    },
    locale: {
      type: String
    },
    places: {
      type: [Array, Object]
    }
  },
  render: function render (h, ref) {
    var props = ref.props;
    var data = ref.data;
    var children = ref.children;
    var parent = ref.parent;

    var i18n = parent.$i18n;

    children = (children || []).filter(function (child) {
      return child.tag || (child.text = child.text.trim())
    });

    if (!i18n) {
      if (process.env.NODE_ENV !== 'production') {
        warn('Cannot find VueI18n instance!');
      }
      return children
    }

    var path = props.path;
    var locale = props.locale;

    var params = {};
    var places = props.places || {};

    var hasPlaces = Array.isArray(places)
      ? places.length > 0
      : Object.keys(places).length > 0;

    var everyPlace = children.every(function (child) {
      if (child.data && child.data.attrs) {
        var place = child.data.attrs.place;
        return (typeof place !== 'undefined') && place !== ''
      }
    });

    if (hasPlaces && children.length > 0 && !everyPlace) {
      warn('If places prop is set, all child elements must have place prop set.');
    }

    if (Array.isArray(places)) {
      places.forEach(function (el, i) {
        params[i] = el;
      });
    } else {
      Object.keys(places).forEach(function (key) {
        params[key] = places[key];
      });
    }

    children.forEach(function (child, i) {
      var key = everyPlace
        ? ("" + (child.data.attrs.place))
        : ("" + i);
      params[key] = child;
    });

    return h(props.tag, data, i18n.i(path, locale, params))
  }
};

/*  */

function bind (el, binding, vnode) {
  if (!assert(el, vnode)) { return }

  t$1(el, binding, vnode);
}

function update (el, binding, vnode, oldVNode) {
  if (!assert(el, vnode)) { return }

  if (localeEqual(el, vnode) && looseEqual(binding.value, binding.oldValue)) { return }

  t$1(el, binding, vnode);
}

function assert (el, vnode) {
  var vm = vnode.context;
  if (!vm) {
    warn('not exist Vue instance in VNode context');
    return false
  }

  if (!vm.$i18n) {
    warn('not exist VueI18n instance in Vue instance');
    return false
  }

  return true
}

function localeEqual (el, vnode) {
  var vm = vnode.context;
  return el._locale === vm.$i18n.locale
}

function t$1 (el, binding, vnode) {
  var value = binding.value;

  var ref = parseValue(value);
  var path = ref.path;
  var locale = ref.locale;
  var args = ref.args;
  if (!path && !locale && !args) {
    warn('not support value type');
    return
  }

  if (!path) {
    warn('required `path` in v-t directive');
    return
  }

  var vm = vnode.context;
  el._vt = el.textContent = (ref$1 = vm.$i18n).t.apply(ref$1, [ path ].concat( makeParams(locale, args) ));
  el._locale = vm.$i18n.locale;
  var ref$1;
}

function parseValue (value) {
  var path;
  var locale;
  var args;

  if (typeof value === 'string') {
    path = value;
  } else if (isPlainObject(value)) {
    path = value.path;
    locale = value.locale;
    args = value.args;
  }

  return { path: path, locale: locale, args: args }
}

function makeParams (locale, args) {
  var params = [];

  locale && params.push(locale);
  if (args && (Array.isArray(args) || isPlainObject(args))) {
    params.push(args);
  }

  return params
}

var Vue;

function install (_Vue) {
  Vue = _Vue;

  var version = (Vue.version && Number(Vue.version.split('.')[0])) || -1;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && install.installed) {
    warn('already installed.');
    return
  }
  install.installed = true;

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && version < 2) {
    warn(("vue-i18n (" + (install.version) + ") need to use Vue 2.0 or later (Vue: " + (Vue.version) + ")."));
    return
  }

  Object.defineProperty(Vue.prototype, '$i18n', {
    get: function get () { return this._i18n }
  });

  extend(Vue);
  Vue.mixin(mixin);
  Vue.directive('t', { bind: bind, update: update });
  Vue.component(component.name, component);

  // use object-based merge strategy
  var strats = Vue.config.optionMergeStrategies;
  strats.i18n = strats.methods;
}

/*  */

var BaseFormatter = function BaseFormatter () {
  this._caches = Object.create(null);
};

BaseFormatter.prototype.interpolate = function interpolate (message, values) {
  var tokens = this._caches[message];
  if (!tokens) {
    tokens = parse(message);
    this._caches[message] = tokens;
  }
  return compile(tokens, values)
};

var RE_TOKEN_LIST_VALUE = /^(\d)+/;
var RE_TOKEN_NAMED_VALUE = /^(\w)+/;

function parse (format) {
  var tokens = [];
  var position = 0;

  var text = '';
  while (position < format.length) {
    var char = format[position++];
    if (char === '{') {
      if (text) {
        tokens.push({ type: 'text', value: text });
      }

      text = '';
      var sub = '';
      char = format[position++];
      while (char !== '}') {
        sub += char;
        char = format[position++];
      }

      var type = RE_TOKEN_LIST_VALUE.test(sub)
        ? 'list'
        : RE_TOKEN_NAMED_VALUE.test(sub)
          ? 'named'
          : 'unknown';
      tokens.push({ value: sub, type: type });
    } else if (char === '%') {
      // when found rails i18n syntax, skip text capture
      if (format[(position)] !== '{') {
        text += char;
      }
    } else {
      text += char;
    }
  }

  text && tokens.push({ type: 'text', value: text });

  return tokens
}

function compile (tokens, values) {
  var compiled = [];
  var index = 0;

  var mode = Array.isArray(values)
    ? 'list'
    : isObject(values)
      ? 'named'
      : 'unknown';
  if (mode === 'unknown') { return compiled }

  while (index < tokens.length) {
    var token = tokens[index];
    switch (token.type) {
      case 'text':
        compiled.push(token.value);
        break
      case 'list':
        compiled.push(values[parseInt(token.value, 10)]);
        break
      case 'named':
        if (mode === 'named') {
          compiled.push((values)[token.value]);
        } else {
          if (process.env.NODE_ENV !== 'production') {
            warn(("Type of token '" + (token.type) + "' and format of value '" + mode + "' don't match!"));
          }
        }
        break
      case 'unknown':
        if (process.env.NODE_ENV !== 'production') {
          warn("Detect 'unknown' type of token!");
        }
        break
    }
    index++;
  }

  return compiled
}

/*  */

/**
 *  Path paerser
 *  - Inspired:
 *    Vue.js Path parser
 */

// actions
var APPEND = 0;
var PUSH = 1;
var INC_SUB_PATH_DEPTH = 2;
var PUSH_SUB_PATH = 3;

// states
var BEFORE_PATH = 0;
var IN_PATH = 1;
var BEFORE_IDENT = 2;
var IN_IDENT = 3;
var IN_SUB_PATH = 4;
var IN_SINGLE_QUOTE = 5;
var IN_DOUBLE_QUOTE = 6;
var AFTER_PATH = 7;
var ERROR = 8;

var pathStateMachine = [];

pathStateMachine[BEFORE_PATH] = {
  'ws': [BEFORE_PATH],
  'ident': [IN_IDENT, APPEND],
  '[': [IN_SUB_PATH],
  'eof': [AFTER_PATH]
};

pathStateMachine[IN_PATH] = {
  'ws': [IN_PATH],
  '.': [BEFORE_IDENT],
  '[': [IN_SUB_PATH],
  'eof': [AFTER_PATH]
};

pathStateMachine[BEFORE_IDENT] = {
  'ws': [BEFORE_IDENT],
  'ident': [IN_IDENT, APPEND],
  '0': [IN_IDENT, APPEND],
  'number': [IN_IDENT, APPEND]
};

pathStateMachine[IN_IDENT] = {
  'ident': [IN_IDENT, APPEND],
  '0': [IN_IDENT, APPEND],
  'number': [IN_IDENT, APPEND],
  'ws': [IN_PATH, PUSH],
  '.': [BEFORE_IDENT, PUSH],
  '[': [IN_SUB_PATH, PUSH],
  'eof': [AFTER_PATH, PUSH]
};

pathStateMachine[IN_SUB_PATH] = {
  "'": [IN_SINGLE_QUOTE, APPEND],
  '"': [IN_DOUBLE_QUOTE, APPEND],
  '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
  ']': [IN_PATH, PUSH_SUB_PATH],
  'eof': ERROR,
  'else': [IN_SUB_PATH, APPEND]
};

pathStateMachine[IN_SINGLE_QUOTE] = {
  "'": [IN_SUB_PATH, APPEND],
  'eof': ERROR,
  'else': [IN_SINGLE_QUOTE, APPEND]
};

pathStateMachine[IN_DOUBLE_QUOTE] = {
  '"': [IN_SUB_PATH, APPEND],
  'eof': ERROR,
  'else': [IN_DOUBLE_QUOTE, APPEND]
};

/**
 * Check if an expression is a literal value.
 */

var literalValueRE = /^\s?(true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral (exp) {
  return literalValueRE.test(exp)
}

/**
 * Strip quotes from a string
 */

function stripQuotes (str) {
  var a = str.charCodeAt(0);
  var b = str.charCodeAt(str.length - 1);
  return a === b && (a === 0x22 || a === 0x27)
    ? str.slice(1, -1)
    : str
}

/**
 * Determine the type of a character in a keypath.
 */

function getPathCharType (ch) {
  if (ch === undefined || ch === null) { return 'eof' }

  var code = ch.charCodeAt(0);

  switch (code) {
    case 0x5B: // [
    case 0x5D: // ]
    case 0x2E: // .
    case 0x22: // "
    case 0x27: // '
    case 0x30: // 0
      return ch

    case 0x5F: // _
    case 0x24: // $
    case 0x2D: // -
      return 'ident'

    case 0x20: // Space
    case 0x09: // Tab
    case 0x0A: // Newline
    case 0x0D: // Return
    case 0xA0:  // No-break space
    case 0xFEFF:  // Byte Order Mark
    case 0x2028:  // Line Separator
    case 0x2029:  // Paragraph Separator
      return 'ws'
  }

  // a-z, A-Z
  if ((code >= 0x61 && code <= 0x7A) || (code >= 0x41 && code <= 0x5A)) {
    return 'ident'
  }

  // 1-9
  if (code >= 0x31 && code <= 0x39) { return 'number' }

  return 'else'
}

/**
 * Format a subPath, return its plain form if it is
 * a literal string or number. Otherwise prepend the
 * dynamic indicator (*).
 */

function formatSubPath (path) {
  var trimmed = path.trim();
  // invalid leading 0
  if (path.charAt(0) === '0' && isNaN(path)) { return false }

  return isLiteral(trimmed) ? stripQuotes(trimmed) : '*' + trimmed
}

/**
 * Parse a string path into an array of segments
 */

function parse$1 (path) {
  var keys = [];
  var index = -1;
  var mode = BEFORE_PATH;
  var subPathDepth = 0;
  var c;
  var key;
  var newChar;
  var type;
  var transition;
  var action;
  var typeMap;
  var actions = [];

  actions[PUSH] = function () {
    if (key !== undefined) {
      keys.push(key);
      key = undefined;
    }
  };

  actions[APPEND] = function () {
    if (key === undefined) {
      key = newChar;
    } else {
      key += newChar;
    }
  };

  actions[INC_SUB_PATH_DEPTH] = function () {
    actions[APPEND]();
    subPathDepth++;
  };

  actions[PUSH_SUB_PATH] = function () {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = IN_SUB_PATH;
      actions[APPEND]();
    } else {
      subPathDepth = 0;
      key = formatSubPath(key);
      if (key === false) {
        return false
      } else {
        actions[PUSH]();
      }
    }
  };

  function maybeUnescapeQuote () {
    var nextChar = path[index + 1];
    if ((mode === IN_SINGLE_QUOTE && nextChar === "'") ||
      (mode === IN_DOUBLE_QUOTE && nextChar === '"')) {
      index++;
      newChar = '\\' + nextChar;
      actions[APPEND]();
      return true
    }
  }

  while (mode !== null) {
    index++;
    c = path[index];

    if (c === '\\' && maybeUnescapeQuote()) {
      continue
    }

    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap['else'] || ERROR;

    if (transition === ERROR) {
      return // parse error
    }

    mode = transition[0];
    action = actions[transition[1]];
    if (action) {
      newChar = transition[2];
      newChar = newChar === undefined
        ? c
        : newChar;
      if (action() === false) {
        return
      }
    }

    if (mode === AFTER_PATH) {
      return keys
    }
  }
}





function empty (target) {
  /* istanbul ignore else */
  if (Array.isArray(target)) {
    return target.length === 0
  } else {
    return false
  }
}

var I18nPath = function I18nPath () {
  this._cache = Object.create(null);
};

/**
 * External parse that check for a cache hit first
 */
I18nPath.prototype.parsePath = function parsePath (path) {
  var hit = this._cache[path];
  if (!hit) {
    hit = parse$1(path);
    if (hit) {
      this._cache[path] = hit;
    }
  }
  return hit || []
};

/**
 * Get path value from path string
 */
I18nPath.prototype.getPathValue = function getPathValue (obj, path) {
  if (!isObject(obj)) { return null }

  var paths = this.parsePath(path);
  if (empty(paths)) {
    return null
  } else {
    var length = paths.length;
    var ret = null;
    var last = obj;
    var i = 0;
    while (i < length) {
      var value = last[paths[i]];
      if (value === undefined) {
        last = null;
        break
      }
      last = value;
      i++;
    }

    ret = last;
    return ret
  }
};

/*  */

var VueI18n = function VueI18n (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  var locale = options.locale || 'en-US';
  var fallbackLocale = options.fallbackLocale || 'en-US';
  var messages = options.messages || {};
  var dateTimeFormats = options.dateTimeFormats || {};
  var numberFormats = options.numberFormats || {};

  this._vm = null;
  this._formatter = options.formatter || new BaseFormatter();
  this._missing = options.missing || null;
  this._root = options.root || null;
  this._sync = options.sync === undefined ? true : !!options.sync;
  this._fallbackRoot = options.fallbackRoot === undefined
    ? true
    : !!options.fallbackRoot;
  this._silentTranslationWarn = options.silentTranslationWarn === undefined
    ? false
    : !!options.silentTranslationWarn;
  this._dateTimeFormatters = {};
  this._numberFormatters = {};
  this._path = new I18nPath();
  this._dataListeners = [];

  this._exist = function (message, key) {
    if (!message || !key) { return false }
    return !isNull(this$1._path.getPathValue(message, key))
  };

  this._initVM({
    locale: locale,
    fallbackLocale: fallbackLocale,
    messages: messages,
    dateTimeFormats: dateTimeFormats,
    numberFormats: numberFormats
  });
};

var prototypeAccessors = { vm: {},messages: {},dateTimeFormats: {},numberFormats: {},locale: {},fallbackLocale: {},missing: {},formatter: {},silentTranslationWarn: {} };

VueI18n.prototype._initVM = function _initVM (data) {
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  this._vm = new Vue({ data: data });
  Vue.config.silent = silent;
};

VueI18n.prototype.subscribeDataChanging = function subscribeDataChanging (vm) {
  this._dataListeners.push(vm);
};

VueI18n.prototype.unsubscribeDataChanging = function unsubscribeDataChanging (vm) {
  remove(this._dataListeners, vm);
};

VueI18n.prototype.watchI18nData = function watchI18nData () {
  var self = this;
  return this._vm.$watch('$data', function () {
    var i = self._dataListeners.length;
    while (i--) {
      Vue.nextTick(function () {
        self._dataListeners[i] && self._dataListeners[i].$forceUpdate();
      });
    }
  }, { deep: true })
};

VueI18n.prototype.watchLocale = function watchLocale () {
  /* istanbul ignore if */
  if (!this._sync || !this._root) { return null }
  var target = this._vm;
  return this._root.vm.$watch('locale', function (val) {
    target.$set(target, 'locale', val);
    target.$forceUpdate();
  }, { immediate: true })
};

prototypeAccessors.vm.get = function () { return this._vm };

prototypeAccessors.messages.get = function () { return looseClone(this._getMessages()) };
prototypeAccessors.dateTimeFormats.get = function () { return looseClone(this._getDateTimeFormats()) };
prototypeAccessors.numberFormats.get = function () { return looseClone(this._getNumberFormats()) };

prototypeAccessors.locale.get = function () { return this._vm.locale };
prototypeAccessors.locale.set = function (locale) {
  this._vm.$set(this._vm, 'locale', locale);
};

prototypeAccessors.fallbackLocale.get = function () { return this._vm.fallbackLocale };
prototypeAccessors.fallbackLocale.set = function (locale) {
  this._vm.$set(this._vm, 'fallbackLocale', locale);
};

prototypeAccessors.missing.get = function () { return this._missing };
prototypeAccessors.missing.set = function (handler) { this._missing = handler; };

prototypeAccessors.formatter.get = function () { return this._formatter };
prototypeAccessors.formatter.set = function (formatter) { this._formatter = formatter; };

prototypeAccessors.silentTranslationWarn.get = function () { return this._silentTranslationWarn };
prototypeAccessors.silentTranslationWarn.set = function (silent) { this._silentTranslationWarn = silent; };

VueI18n.prototype._getMessages = function _getMessages () { return this._vm.messages };
VueI18n.prototype._getDateTimeFormats = function _getDateTimeFormats () { return this._vm.dateTimeFormats };
VueI18n.prototype._getNumberFormats = function _getNumberFormats () { return this._vm.numberFormats };

VueI18n.prototype._warnDefault = function _warnDefault (locale, key, result, vm) {
  if (!isNull(result)) { return result }
  if (this.missing) {
    this.missing.apply(null, [locale, key, vm]);
  } else {
    if (process.env.NODE_ENV !== 'production' && !this._silentTranslationWarn) {
      warn(
        "Cannot translate the value of keypath '" + key + "'. " +
        'Use the value of keypath as default.'
      );
    }
  }
  return key
};

VueI18n.prototype._isFallbackRoot = function _isFallbackRoot (val) {
  return !val && !isNull(this._root) && this._fallbackRoot
};

VueI18n.prototype._interpolate = function _interpolate (
  locale,
  message,
  key,
  host,
  interpolateMode,
  values
) {
  if (!message) { return null }

  var pathRet = this._path.getPathValue(message, key);
  if (Array.isArray(pathRet)) { return pathRet }

  var ret;
  if (isNull(pathRet)) {
    /* istanbul ignore else */
    if (isPlainObject(message)) {
      ret = message[key];
      if (typeof ret !== 'string') {
        if (process.env.NODE_ENV !== 'production' && !this._silentTranslationWarn) {
          warn(("Value of key '" + key + "' is not a string!"));
        }
        return null
      }
    } else {
      return null
    }
  } else {
    /* istanbul ignore else */
    if (typeof pathRet === 'string') {
      ret = pathRet;
    } else {
      if (process.env.NODE_ENV !== 'production' && !this._silentTranslationWarn) {
        warn(("Value of key '" + key + "' is not a string!"));
      }
      return null
    }
  }

  // Check for the existance of links within the translated string
  if (ret.indexOf('@:') >= 0) {
    ret = this._link(locale, message, ret, host, interpolateMode, values);
  }

  return !values ? ret : this._render(ret, interpolateMode, values)
};

VueI18n.prototype._link = function _link (
  locale,
  message,
  str,
  host,
  interpolateMode,
  values
) {
    var this$1 = this;

  var ret = str;

  // Match all the links within the local
  // We are going to replace each of
  // them with its translation
  var matches = ret.match(/(@:[\w\-_|.]+)/g);
  for (var idx in matches) {
    // ie compatible: filter custom array
    // prototype method
    if (!matches.hasOwnProperty(idx)) {
      continue
    }
    var link = matches[idx];
    // Remove the leading @:
    var linkPlaceholder = link.substr(2);
    // Translate the link
    var translated = this$1._interpolate(
      locale, message, linkPlaceholder, host,
      interpolateMode === 'raw' ? 'string' : interpolateMode,
      interpolateMode === 'raw' ? undefined : values
    );

    if (this$1._isFallbackRoot(translated)) {
      if (process.env.NODE_ENV !== 'production' && !this$1._silentTranslationWarn) {
        warn(("Fall back to translate the link placeholder '" + linkPlaceholder + "' with root locale."));
      }
      /* istanbul ignore if */
      if (!this$1._root) { throw Error('unexpected error') }
      var root = this$1._root;
      translated = root._translate(
        root._getMessages(), root.locale, root.fallbackLocale,
        linkPlaceholder, host, interpolateMode, values
      );
    }
    translated = this$1._warnDefault(locale, linkPlaceholder, translated, host);

    // Replace the link with the translated
    ret = !translated ? ret : ret.replace(link, translated);
  }

  return ret
};

VueI18n.prototype._render = function _render (message, interpolateMode, values) {
  var ret = this._formatter.interpolate(message, values);
  // if interpolateMode is **not** 'string' ('row'),
  // return the compiled data (e.g. ['foo', VNode, 'bar']) with formatter
  return interpolateMode === 'string' ? ret.join('') : ret
};

VueI18n.prototype._translate = function _translate (
  messages,
  locale,
  fallback,
  key,
  host,
  interpolateMode,
  args
) {
  var res =
    this._interpolate(locale, messages[locale], key, host, interpolateMode, args);
  if (!isNull(res)) { return res }

  res = this._interpolate(fallback, messages[fallback], key, host, interpolateMode, args);
  if (!isNull(res)) {
    if (process.env.NODE_ENV !== 'production' && !this._silentTranslationWarn) {
      warn(("Fall back to translate the keypath '" + key + "' with '" + fallback + "' locale."));
    }
    return res
  } else {
    return null
  }
};

VueI18n.prototype._t = function _t (key, _locale, messages, host) {
    var values = [], len = arguments.length - 4;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 4 ];

  if (!key) { return '' }

  var parsedArgs = parseArgs.apply(void 0, values);
    var locale = parsedArgs.locale || _locale;

  var ret = this._translate(
    messages, locale, this.fallbackLocale, key,
    host, 'string', parsedArgs.params
  );
  if (this._isFallbackRoot(ret)) {
    if (process.env.NODE_ENV !== 'production' && !this._silentTranslationWarn) {
      warn(("Fall back to translate the keypath '" + key + "' with root locale."));
    }
    /* istanbul ignore if */
    if (!this._root) { throw Error('unexpected error') }
    return (ref = this._root).t.apply(ref, [ key ].concat( values ))
  } else {
    return this._warnDefault(locale, key, ret, host)
  }
    var ref;
};

VueI18n.prototype.t = function t (key) {
    var values = [], len = arguments.length - 1;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

  return (ref = this)._t.apply(ref, [ key, this.locale, this._getMessages(), null ].concat( values ))
    var ref;
};

VueI18n.prototype._i = function _i (key, locale, messages, host, values) {
  var ret =
    this._translate(messages, locale, this.fallbackLocale, key, host, 'raw', values);
  if (this._isFallbackRoot(ret)) {
    if (process.env.NODE_ENV !== 'production' && !this._silentTranslationWarn) {
      warn(("Fall back to interpolate the keypath '" + key + "' with root locale."));
    }
    if (!this._root) { throw Error('unexpected error') }
    return this._root.i(key, locale, values)
  } else {
    return this._warnDefault(locale, key, ret, host)
  }
};

VueI18n.prototype.i = function i (key, locale, values) {
  /* istanbul ignore if */
  if (!key) { return '' }

  if (typeof locale !== 'string') {
    locale = this.locale;
  }

  return this._i(key, locale, this._getMessages(), null, values)
};

VueI18n.prototype._tc = function _tc (
  key,
  _locale,
  messages,
    host,
    choice
) {
    var values = [], len = arguments.length - 5;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 5 ];

    if (!key) { return '' }
  if (choice === undefined) {
    choice = 1;
  }
  return fetchChoice((ref = this)._t.apply(ref, [ key, _locale, messages, host ].concat( values )), choice)
    var ref;
};

VueI18n.prototype.tc = function tc (key, choice) {
    var values = [], len = arguments.length - 2;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 2 ];

  return (ref = this)._tc.apply(ref, [ key, this.locale, this._getMessages(), null, choice ].concat( values ))
    var ref;
};

VueI18n.prototype._te = function _te (key, locale, messages) {
    var args = [], len = arguments.length - 3;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 3 ];

  var _locale = parseArgs.apply(void 0, args).locale || locale;
  return this._exist(messages[_locale], key)
};

VueI18n.prototype.te = function te (key, locale) {
  return this._te(key, this.locale, this._getMessages(), locale)
};

VueI18n.prototype.getLocaleMessage = function getLocaleMessage (locale) {
  return looseClone(this._vm.messages[locale] || {})
};

VueI18n.prototype.setLocaleMessage = function setLocaleMessage (locale, message) {
  this._vm.messages[locale] = message;
};

  VueI18n.prototype.mergeLocaleMessage = function mergeLocaleMessage (locale, message) {
  this._vm.messages[locale] = Vue.util.extend(this._vm.messages[locale] || {}, message);
};

VueI18n.prototype.getDateTimeFormat = function getDateTimeFormat (locale) {
  return looseClone(this._vm.dateTimeFormats[locale] || {})
};

VueI18n.prototype.setDateTimeFormat = function setDateTimeFormat (locale, format) {
  this._vm.dateTimeFormats[locale] = format;
};

VueI18n.prototype.mergeDateTimeFormat = function mergeDateTimeFormat (locale, format) {
  this._vm.dateTimeFormats[locale] = Vue.util.extend(this._vm.dateTimeFormats[locale] || {}, format);
};

VueI18n.prototype._localizeDateTime = function _localizeDateTime (
  value,
  locale,
  fallback,
  dateTimeFormats,
  key
) {
  var _locale = locale;
  var formats = dateTimeFormats[_locale];

  // fallback locale
  if (isNull(formats) || isNull(formats[key])) {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Fall back to '" + fallback + "' datetime formats from '" + locale + " datetime formats."));
    }
    _locale = fallback;
    formats = dateTimeFormats[_locale];
  }

  if (isNull(formats) || isNull(formats[key])) {
    return null
  } else {
    var format = formats[key];
    var id = _locale + "__" + key;
    var formatter = this._dateTimeFormatters[id];
    if (!formatter) {
      formatter = this._dateTimeFormatters[id] = new Intl.DateTimeFormat(_locale, format);
    }
    return formatter.format(value)
  }
};

VueI18n.prototype._d = function _d (value, locale, key) {
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && !VueI18n.availabilities.dateTimeFormat) {
    warn('Cannot format a Date value due to not support Intl.DateTimeFormat.');
    return ''
  }

  if (!key) {
    return new Intl.DateTimeFormat(locale).format(value)
  }

  var ret =
    this._localizeDateTime(value, locale, this.fallbackLocale, this._getDateTimeFormats(), key);
  if (this._isFallbackRoot(ret)) {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Fall back to datetime localization of root: key '" + key + "' ."));
    }
    /* istanbul ignore if */
    if (!this._root) { throw Error('unexpected error') }
    return this._root.d(value, key, locale)
  } else {
    return ret || ''
  }
};

VueI18n.prototype.d = function d (value) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var locale = this.locale;
  var key = null;

  if (args.length === 1) {
    if (typeof args[0] === 'string') {
      key = args[0];
    } else if (isObject(args[0])) {
      if (args[0].locale) {
        locale = args[0].locale;
      }
      if (args[0].key) {
        key = args[0].key;
      }
    }
  } else if (args.length === 2) {
    if (typeof args[0] === 'string') {
        key = args[0];
      }
      if (typeof args[1] === 'string') {
      locale = args[1];
    }
  }

  return this._d(value, locale, key)
};

VueI18n.prototype.getNumberFormat = function getNumberFormat (locale) {
  return looseClone(this._vm.numberFormats[locale] || {})
};

VueI18n.prototype.setNumberFormat = function setNumberFormat (locale, format) {
  this._vm.numberFormats[locale] = format;
};

VueI18n.prototype.mergeNumberFormat = function mergeNumberFormat (locale, format) {
  this._vm.numberFormats[locale] = Vue.util.extend(this._vm.numberFormats[locale] || {}, format);
};

VueI18n.prototype._localizeNumber = function _localizeNumber (
  value,
  locale,
  fallback,
  numberFormats,
  key
) {
  var _locale = locale;
  var formats = numberFormats[_locale];

  // fallback locale
  if (isNull(formats) || isNull(formats[key])) {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Fall back to '" + fallback + "' number formats from '" + locale + " number formats."));
    }
    _locale = fallback;
    formats = numberFormats[_locale];
  }

  if (isNull(formats) || isNull(formats[key])) {
    return null
  } else {
    var format = formats[key];
    var id = _locale + "__" + key;
    var formatter = this._numberFormatters[id];
    if (!formatter) {
      formatter = this._numberFormatters[id] = new Intl.NumberFormat(_locale, format);
    }
    return formatter.format(value)
  }
};

VueI18n.prototype._n = function _n (value, locale, key) {
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && !VueI18n.availabilities.numberFormat) {
    warn('Cannot format a Date value due to not support Intl.NumberFormat.');
    return ''
  }

  if (!key) {
    return new Intl.NumberFormat(locale).format(value)
  }

  var ret =
    this._localizeNumber(value, locale, this.fallbackLocale, this._getNumberFormats(), key);
  if (this._isFallbackRoot(ret)) {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Fall back to number localization of root: key '" + key + "' ."));
    }
    /* istanbul ignore if */
    if (!this._root) { throw Error('unexpected error') }
    return this._root.n(value, key, locale)
  } else {
    return ret || ''
  }
};

VueI18n.prototype.n = function n (value) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var locale = this.locale;
  var key = null;

  if (args.length === 1) {
    if (typeof args[0] === 'string') {
      key = args[0];
    } else if (isObject(args[0])) {
      if (args[0].locale) {
        locale = args[0].locale;
      }
      if (args[0].key) {
        key = args[0].key;
      }
    }
  } else if (args.length === 2) {
    if (typeof args[0] === 'string') {
      key = args[0];
    }
    if (typeof args[1] === 'string') {
      locale = args[1];
    }
  }

  return this._n(value, locale, key)
};

Object.defineProperties( VueI18n.prototype, prototypeAccessors );

VueI18n.availabilities = {
  dateTimeFormat: canUseDateTimeFormat,
  numberFormat: canUseNumberFormat
};
VueI18n.install = install;
VueI18n.version = '7.3.3';

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueI18n);
}

/* harmony default export */ __webpack_exports__["a"] = (VueI18n);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__v_index__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__v_bgAndBorders__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__v_shapes__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__v_visualEffects__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__v_typography__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__v_userExperience__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__v_blurDialog__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__v_structureAndLayout__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__v_fluidBg__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__v_verticalCenter__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__v_stickyFooter__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__v_transitionsAndAnimations__ = __webpack_require__(74);













const routermaps = [{
  path: '/',
  component: __WEBPACK_IMPORTED_MODULE_0__v_index__["a" /* default */]
}, {
  path: '/index',
  component: __WEBPACK_IMPORTED_MODULE_0__v_index__["a" /* default */]
}, {
  path: '/bgAndBorders',
  component: __WEBPACK_IMPORTED_MODULE_1__v_bgAndBorders__["a" /* default */],
  meta: { scrollToTop: true }
}, {
  path: '/shapes',
  component: __WEBPACK_IMPORTED_MODULE_2__v_shapes__["a" /* default */],
  meta: { scrollToTop: true }
}, {
  path: '/visualEffects',
  component: __WEBPACK_IMPORTED_MODULE_3__v_visualEffects__["a" /* default */],
  meta: { scrollToTop: true }
}, {
  path: '/typography',
  component: __WEBPACK_IMPORTED_MODULE_4__v_typography__["a" /* default */],
  meta: { scrollToTop: true }
}, {
  path: '/userExperience',
  component: __WEBPACK_IMPORTED_MODULE_5__v_userExperience__["a" /* default */],
  meta: { scrollToTop: true }
}, {
  path: '/blurDialog',
  component: __WEBPACK_IMPORTED_MODULE_6__v_blurDialog__["a" /* default */]
}, {
  path: '/structureAndLayout',
  component: __WEBPACK_IMPORTED_MODULE_7__v_structureAndLayout__["a" /* default */],
  meta: { scrollToTop: true }
}, {
  path: '/fluidBg',
  component: __WEBPACK_IMPORTED_MODULE_8__v_fluidBg__["a" /* default */]
}, {
  path: '/verticalCenter/:id',
  component: __WEBPACK_IMPORTED_MODULE_9__v_verticalCenter__["a" /* default */]
}, {
  path: '/stickyFooter',
  component: __WEBPACK_IMPORTED_MODULE_10__v_stickyFooter__["a" /* default */]
}, {
  path: '/transitionsAndAnimations',
  component: __WEBPACK_IMPORTED_MODULE_11__v_transitionsAndAnimations__["a" /* default */]
}];

/* harmony default export */ __webpack_exports__["a"] = (routermaps);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_i18n__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_analytics__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_analytics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_vue_analytics__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__router___ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__i18n___ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ga___ = __webpack_require__(80);










// import style files
__webpack_require__(81);

__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]);
__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_2_vue_i18n__["a" /* default */]);
__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_3_vue_analytics___default.a, __WEBPACK_IMPORTED_MODULE_7__ga___["a" /* default */]);

new __WEBPACK_IMPORTED_MODULE_0_vue___default.a({
  el: '#css-secrets-demo',
  router: __WEBPACK_IMPORTED_MODULE_5__router___["a" /* default */],
  i18n: __WEBPACK_IMPORTED_MODULE_6__i18n___["a" /* default */],
  template: '<App/>',
  components: { App: __WEBPACK_IMPORTED_MODULE_4__app__["a" /* default */] }
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(12);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(3)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

!function(e,n){if(true)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var t=n();for(var r in t)("object"==typeof exports?exports:e)[r]=t[r]}}(this,function(){return function(e){function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var t={};return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=0)}([function(e,n,t){"use strict";function r(e){u(_,e)}function o(){return _.id?[].concat(_.id):[]}function i(){}function a(e){return new Promise(function(n,t){var r=document.head||document.getElementsByTagName("head")[0],o=document.createElement("script");o.async=!0,o.src=e,o.charset="utf8",r.appendChild(o),o.onload=n,o.onerror=t})}function c(e,n){var t=n.split("/"),r=e.split("/");return""===t[0]&&"/"===e[e.length-1]&&t.shift(),r.join("/")+t.join("/")}function u(e,n){return Object.keys(n).forEach(function(t){if(e[t]&&"object"==typeof e[t])return void u(e[t],n[t]);e[t]=n[t]}),e}function f(){return Array.prototype.slice.call(document.getElementsByTagName("script")).filter(function(e){return-1!==e.src.indexOf("analytics")}).length>0}function l(e){return e.replace(/-/gi,"")}function s(){return new Promise(function(e,n){var t=setInterval(function(){"undefined"!=typeof window&&window.ga&&(e(),clearInterval(t))},10)})}function d(e,n){if(o().length>1){return l(n)+"."+e}return e}function p(e){var n=Object.keys(e).reduce(function(n,t,r,o){var i=r===o.length-1;return n+=t+"="+e[t]+(i?"":"&")},"");return""!==n?"?"+n:""}function v(e){return-1!==B.ignoreRoutes.indexOf(e)}function g(e){return e.query&&e.params}function h(e){return e.currentRoute}function y(e){for(var n=arguments.length,t=Array(n>1?n-1:0),r=1;r<n;r++)t[r-1]=arguments[r];o().forEach(function(n){var r;if(void 0===window.ga||"string"!=typeof n)return void B.untracked.push({method:d(e,n),arguments:[].concat(t)});(r=window).ga.apply(r,[d(e,n)].concat(t))})}function m(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];if("object"==typeof n[0]&&n[0].constructor===Object)return void y("set",n[0]);y("set",n[0],n[1])}function b(){var e=o();B.debug.enabled&&(window.ga_debug={trace:B.debug.trace}),e.forEach(function(n){var t=l(n),r=e.length>1?D({},B.fields,{name:t}):B.fields;window.ga("create",n,"auto",r)}),B.beforeFirstHit();var n=B.ecommerce;if(n.enabled){var t=n.enhanced?"ec":"ecommerce";n.options?y("require",t,n.options):y("require",t)}B.linkers.length>0&&(y("require","linker"),y("linker:autoLink",B.linkers)),B.debug.sendHitTask||m("sendHitTask",null)}function w(e){if(Array.isArray(e)){for(var n=0,t=Array(e.length);n<e.length;n++)t[n]=e[n];return t}return Array.from(e)}function k(){var e=B.untracked,n=B.autoTracking,t=e.length;if(t&&n.untracked)for(;t--;){var r=e[t];y.apply(void 0,[r.method].concat(w(r.arguments))),e.splice(t,1)}}function O(){for(var e=void 0,n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];if(h(t[0])&&(e=t[0].currentRoute),g(t[0])&&(e=t[0]),e){var o=B.router,i=B.autoTracking,a=i.transformQueryString,u=i.prependBase,f=p(e.query),l=o&&o.options.base,s=u&&l,d=e.path+(a?f:"");return d=s?c(l,d):d,m("page",d),void y("send","pageview",M({page:d,title:e.name,location:window.location.href},"function"==typeof t[1]&&{hitCallback:t[1]}))}y.apply(void 0,["send","pageview"].concat(t))}function j(e){if(!v(e)){var n=B.autoTracking,t=e.meta.analytics,r=void 0===t?{}:t,o=r.pageviewTemplate||n.pageviewTemplate;O(o?o(e):e)}}function x(){var e=B.router,n=B.autoTracking;n.page&&e&&(n.pageviewOnLoad&&j(e.currentRoute),B.router.afterEach(function(t,r){var o=n.skipSamePath,i=n.shouldRouterUpdate;o&&t.path===r.path||("function"!=typeof i||i(t,r))&&setTimeout(function(){j(e.currentRoute)},0)}))}function T(){if("undefined"!=typeof document){var e=B.id,n=B.debug,t=B.checkDuplicatedScript,r=B.disableScriptLoader,o=n.enabled?"analytics_debug":"analytics",i="https://www.google-analytics.com/"+o+".js";if(!e)throw new Error("[vue-analytics] Please enter a Google Analytics tracking ID");return new Promise(function(e,n){return t&&f(i)||r?e():a(i).then(function(){e()}).catch(function(){n("[vue-analytics] It's not possible to load Google Analytics script")})}).then(function(){return s()}).then(function(){return"function"==typeof e?e():e}).then(function(e){B.id=e,b(),G(),B.ready(),x(),k()}).catch(function(e){console.error(e)})}}function A(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];y.apply(void 0,["send","event"].concat(n))}function P(e){y("send","exception",{exDescription:e,exFatal:arguments.length>1&&void 0!==arguments[1]&&arguments[1]})}function E(e,n){var t=B.autoTracking.exception,r=e.message||e;t&&n.$ga.exception(r,!0)}function q(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];y.apply(void 0,["send","social"].concat(n))}function R(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];y.apply(void 0,["send","timing"].concat(n))}function S(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function H(e){r(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}),e.directive("ga",J),e.prototype.$ga=e.$ga=z,e.config.errorHandler||(e.config.errorHandler=E),T()}Object.defineProperty(n,"__esModule",{value:!0});var I=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},L={id:null,router:null,fields:{},ignoreRoutes:[],linkers:[],commands:{},set:[],require:[],ecommerce:{enabled:!1,options:null,enhanced:!1},autoTracking:{shouldRouterUpdate:null,skipSamePath:!1,exception:!1,page:!0,transformQueryString:!0,pageviewOnLoad:!0,pageviewTemplate:null,untracked:!0,prependBase:!0},debug:{enabled:!1,trace:!1,sendHitTask:!0},checkDuplicatedScript:!1,disableScriptLoader:!1,beforeFirstHit:i,ready:i,untracked:[]},_=I({},L),B=_,D=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},F=function(){if(2==arguments.length)return void y("require",arguments.length<=0?void 0:arguments[0],arguments.length<=1?void 0:arguments[1]);y("require",arguments.length<=0?void 0:arguments[0])},$=function(){B.set.forEach(function(e){var n=e.field,t=e.value;if(void 0===n||void 0===t)throw new Error('[vue-analytics] Wrong configuration in the plugin options.\nThe "set" array requires each item to have a "field" and a "value" property.');m(n,t)})},C=function(){var e=["ec","ecommerce"];B.require.forEach(function(n){if(-1!==e.indexOf(n)||-1!==e.indexOf(n.name))throw new Error("[vue-analytics] The ecommerce features are built-in in the plugin. \nFollow the ecommerce instructions available in the documentation.");if("string"!=typeof n&&"object"!=typeof n)throw new Error('[vue-analytics] Wrong configuration in the plugin options. \nThe "require" array requires each item to be a string or to have a "name" and an "options" property.');var t=n.name||n;if(n.options)return void F(t,n.options);F(t)})},G=function(){$(),C()},M=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},N=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},Q=function(e){return(B.ecommerce.enhanced?"ec":"ecommerce")+":"+e},U=["addItem","addTransaction","addProduct","addImpression","setAction","addPromo","send"],W=U.reduce(function(e,n){return N({},e,S({},n,function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];y.apply(void 0,[Q(n)].concat(t))}))},{}),z={event:A,exception:P,page:O,query:y,require:F,set:m,social:q,time:R,untracked:k,ecommerce:W,commands:B.commands},J={inserted:function(e,n,t){var r=n.value;e.addEventListener("click",function(){var e="string"==typeof r?B.commands[r]:r;if(!e)throw new Error("[vue-analytics] The value passed to v-ga is not defined in the commands list.");e.apply(t.context)})}};n.default=H,t.d(n,"onAnalyticsReady",function(){return s})}])});

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f9f20b1c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_app_vue__ = __webpack_require__(22);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f9f20b1c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_app_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Navigator_vue__ = __webpack_require__(16);
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      title: "css-secret-demo",
      scroll: false,
      navActiveChapter: "",
      navActiveSection: "",
      gap: 10
    };
  },
  components: {
    navigator: __WEBPACK_IMPORTED_MODULE_0__components_Navigator_vue__["a" /* default */]
  },
  methods: {
    handleScroll() {
      this.scroll = window.scrollY;
      let AllSections = document.querySelectorAll('.c-section');
      let curChapter = document.querySelector('.c-chapter');
      let AllSectionsOffsetY = [];

      for (var i = 0; i < AllSections.length; i++) {
        AllSectionsOffsetY.push(AllSections[i].offsetTop);
      }

      if (curChapter) {
        this.navActiveChapter = curChapter.id;
      } else {
        return;
      }

      for (var j = 0; j < AllSectionsOffsetY.length; j++) {
        if (this.scroll + this.gap < AllSectionsOffsetY[j]) {
          this.navActiveSection = j;
          break;
        } else if (this.scroll > AllSectionsOffsetY[AllSectionsOffsetY.length - 1]) {
          this.navActiveSection = AllSectionsOffsetY.length;
        }
      }
    }
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  updated() {
    this.handleScroll();
  },
  distroyed() {
    window.removeListener('scroll', this.handleScroll);
  }
});

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Navigator_vue__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_31c15c71_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Navigator_vue__ = __webpack_require__(21);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Navigator_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_31c15c71_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Navigator_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__LangSelector_vue__ = __webpack_require__(18);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      dirs: this.$i18n.t('lang.directory')
    };
  },
  components: {
    langSelector: __WEBPACK_IMPORTED_MODULE_0__LangSelector_vue__["a" /* default */]
  },
  props: ['activeChapter', 'activeSection'],
  methods: {
    updateLang() {
      this.dirs = this.$i18n.t('lang.directory');
    }
  }
});

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_LangSelector_vue__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6b47106a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_LangSelector_vue__ = __webpack_require__(20);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_LangSelector_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6b47106a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_LangSelector_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      lang: this.getBrowserLang()
    };
  },
  methods: {
    getBrowserLang() {
      if (navigator.language == "zh-CN") {
        return "cn";
      } else {
        return "en";
      }
    },
    changeLang() {
      this.$i18n.locale = this.lang;
      this.$emit('getLangFromSelector');
    }
  }
});

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.lang),expression:"lang"}],staticClass:"langSelector",attrs:{"change":_vm.changeLang()},on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.lang=$event.target.multiple ? $$selectedVal : $$selectedVal[0]}}},[_c('option',{attrs:{"value":"cn"}},[_vm._v("简体中文")]),_vm._v(" "),_c('option',{attrs:{"value":"en"}},[_vm._v("English")])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"navigator"},[_c('h2',{staticClass:"title"},[_c('router-link',{staticClass:"link",attrs:{"to":{ path: 'index'}}},[_vm._v(_vm._s(_vm.$t('lang.bookTitle')))])],1),_vm._v(" "),_c('langSelector',{on:{"getLangFromSelector":_vm.updateLang}}),_vm._v(" "),_c('ul',{staticClass:"chapter"},_vm._l((_vm.dirs),function(dir,cIndex){return _c('li',[_c('router-link',{staticClass:"link",class:{active: _vm.activeChapter === 'c-'+(cIndex+1)},attrs:{"to":{path: dir.componentName}}},[_vm._v(_vm._s(dir.chapter))]),_vm._v(" "),_c('ul',{staticClass:"section"},_vm._l((dir.sections),function(sec,sIndex){return _c('li',[_c('router-link',{staticClass:"link",class:{active: _vm.activeSection === sIndex + 1},attrs:{"to":{ path: dir.componentName+ '#c-' + (cIndex+1) + '-' + (sIndex+1)}}},[_vm._v(_vm._s(sec))])],1)}))],1)}))],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"wrapper"},[_c('navigator',{attrs:{"activeChapter":_vm.navActiveChapter,"activeSection":_vm.navActiveSection}}),_vm._v(" "),_c('router-view')],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_router__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__routermaps__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scrollBehavior__ = __webpack_require__(77);





const router = new __WEBPACK_IMPORTED_MODULE_0_vue_router__["a" /* default */]({
  routes: __WEBPACK_IMPORTED_MODULE_1__routermaps__["a" /* default */],
  //Here if we import routes as other names, we should use ' routes: othername  '
  scrollBehavior: __WEBPACK_IMPORTED_MODULE_2__scrollBehavior__["a" /* default */]
});

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_eadd9f3c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(29);
function injectStyle (ssrContext) {
  __webpack_require__(25)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_eadd9f3c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("e6437b0a", content, true);

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, ".cover{overflow:hidden;position:relative}.cover .cover-img{position:relative;left:-100px;width:100%;max-width:600px}", ""]);

// exports


/***/ }),
/* 27 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      viewLink: 'https://github.com/hazelGranger/css-secrets-demo',
      downloadZip: 'https://github.com/hazelGranger/css-secrets-demo/zipball/master',
      downloadTar: 'https://github.com/hazelGranger/css-secrets-demo/tarball/master'
    };
  }
});

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content"},[_c('h1',[_vm._v("Css Secrets Demos")]),_vm._v(" "),_vm._m(0,false,false),_vm._v(" "),_c('p',[_vm._v("《CSS Secrets》一书中各章节的 demo")]),_vm._v(" "),_c('p',[_c('a',{staticClass:"btn",attrs:{"href":_vm.viewLink}},[_vm._v("View on GitHub")]),_vm._v(" "),_c('a',{staticClass:"btn",attrs:{"href":_vm.downloadZip}},[_vm._v("Download .zip")]),_vm._v(" "),_c('a',{staticClass:"btn",attrs:{"href":_vm.downloadTar}},[_vm._v("Download .tar.gz")])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"cover"},[_c('img',{staticClass:"cover-img",attrs:{"src":"https://cloud.githubusercontent.com/assets/1231359/14773652/5bf7c006-0adf-11e6-8712-70be89b3b97d.jpg","alt":"[CSS Secrets 简体中文版 - 封面]"}})])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bgAndBorders_vue__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_44a40643_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bgAndBorders_vue__ = __webpack_require__(32);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bgAndBorders_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_44a40643_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bgAndBorders_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({});

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content"},[_c('section',{staticClass:"c-chapter",attrs:{"id":"c-1"}},[_c('h2',[_vm._v(_vm._s(_vm.$t("lang.directory[0].chapter")))]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-1-1"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[0].sections[0]")))]),_vm._v(" "),_vm._m(0,false,false),_vm._v(" "),_c('code',[_vm._v("\n        border: 10px solid rgba(0, 0, 0, 0.3);\n        background: white;\n        background-clip: padding-box;\n      ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-1-2"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[0].sections[1]")))]),_vm._v(" "),_c('h4',[_vm._v("box-shadow solution")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-1-2-1"}}),_vm._v(" "),_c('code',[_vm._v("\n        background: yellowgreen;\n        box-shadow: 0 0 0 10px #655,\n        0 0 0 15px deeppink,\n        0 2px 5px 15px rgba(0,0,0,.6);\n      ")]),_vm._v(" "),_c('h4',[_vm._v("outline solution")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-1-2-2"}}),_vm._v(" "),_c('code',[_vm._v("\n        background: yellowgreen;\n        border: 10px solid #655;\n        outline: 15px solid deeppink;\n      ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-1-3"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[0].sections[2]")))]),_vm._v(" "),_c('h4',[_vm._v("Extended background-position solution")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-1-3-1"}}),_vm._v(" "),_c('code',[_vm._v("\n        background: url(img/water.svg) no-repeat bottom right #CEE2EF;\n        background-position: right 20px bottom 10px;\n      ")]),_vm._v(" "),_c('h4',[_vm._v("background-origin solution")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-1-3-2"}}),_vm._v(" "),_c('code',[_vm._v("\n        padding: 20px;\n        background: url(\"img/water.svg\") no-repeat #CEE2EF\n        bottom right; /* or 100% 100% */\n        background-origin: content-box;\n      ")]),_vm._v(" "),_c('h4',[_vm._v("calc() solution")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-1-3-3"}}),_vm._v(" "),_c('code',[_vm._v("\n        background: url(\"img/water.svg\") no-repeat #CEE2EF;\n        background-position: calc(100% - 20px) calc(100% - 20px);\n      ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-1-4"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[0].sections[3]")))]),_vm._v(" "),_c('div',{attrs:{"id":"eg-1-4-1"}}),_vm._v(" "),_c('code',[_vm._v("\n        background: tan;\n        border-radius: .8em;\n        padding: 1em;\n        box-shadow: 0 0 0 .6em #655;\n        outline: .65em solid #655;\n      ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-1-5"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[0].sections[4]")))]),_vm._v(" "),_vm._m(1,false,false),_vm._v(" "),_vm._m(2,false,false),_vm._v(" "),_vm._m(3,false,false),_vm._v(" "),_vm._m(4,false,false),_vm._v(" "),_vm._m(5,false,false),_vm._v(" "),_vm._m(6,false,false),_vm._v(" "),_vm._m(7,false,false),_vm._v(" "),_vm._m(8,false,false),_vm._v(" "),_vm._m(9,false,false),_vm._v(" "),_vm._m(10,false,false),_vm._v(" "),_vm._m(11,false,false),_vm._v(" "),_vm._m(12,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-1-6"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[0].sections[5]")))]),_vm._v(" "),_vm._m(13,false,false),_vm._v(" "),_vm._m(14,false,false),_vm._v(" "),_vm._m(15,false,false),_vm._v(" "),_vm._m(16,false,false),_vm._v(" "),_vm._m(17,false,false),_vm._v(" "),_vm._m(18,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-1-7"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[0].sections[6]")))]),_vm._v(" "),_vm._m(19,false,false),_vm._v(" "),_vm._m(20,false,false)])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-1-1"}},[_c('div',{attrs:{"id":"eg-1-1-1"}},[_vm._v("\n          semitransparent borders\n          semitransparent borders\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-5-1"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: linear-gradient(#fb3, #58a);\n          background: linear-gradient(#fb3 0%, #58a 100%);\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-5-2"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: linear-gradient(#fb3 20%, #58a 80%);\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-5-3"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: linear-gradient(#fb3 40%, #58a 60%);\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-5-4"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: linear-gradient(#fb3 50%, #58a 50%);\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-5-5"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: linear-gradient(#fb3 30%, #58a 0);\n          background-size: 100% 30px;\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-5-6"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: linear-gradient(#fb3 33.3%,#58a 0, #58a 66.6%, yellowgreen 0);\n          background-size: 100% 45px;\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-5-7"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: linear-gradient(to right,#fb3 50%, #58a 0);\n          background: linear-gradient(90deg,#fb3 50%, #58a 0);\n          background-size: 30px 100%;\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-5-8"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: linear-gradient(45deg,#fb3 50%, #58a 0);\n          background-size: 30px 30px;\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-5-9"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: linear-gradient(45deg,#fb3 25%, #58a 0, #58a 50%,#fb3 0, #fb3 75%, #58a 0);\n          background-size: 30px 30px;\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-5-10"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: repeating-linear-gradient(45deg,#fb3, #58a 30px);\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-5-11"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: repeating-linear-gradient(60deg,#fb3, #fb3 15px, #58a 0, #58a 30px);\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-5-12"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: #58a;\n          background-image: repeating-linear-gradient(30deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,.1) 15px,transparent 0, transparent 30px);\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-6-1"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: white;\n          background-image: linear-gradient(90deg,rgba(200,0,0,.5) 50%, transparent 0),linear-gradient(rgba(200,0,0,.5) 50%, transparent 0);\n          background-size: 31px 30px;\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-6-2"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: white;\n          background-image: linear-gradient(90deg,rgba(200,0,0,.5) 50%, transparent 0),linear-gradient(rgba(200,0,0,.5) 50%, transparent 0);\n          background-size: 31px 30px;\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-6-3"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: #58a;\n          background-image:linear-gradient(white 2px, transparent 0),\n          linear-gradient(90deg, white 2px, transparent 0),\n          linear-gradient(hsla(0,0%,100%,.3) 1px,transparent 0),\n          linear-gradient(90deg, hsla(0,0%,100%,.3) 1px,transparent 0);\n          background-size: 75px 75px, 75px 75px,15px 15px, 15px 15px;\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-6-4"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: #655;\n          background-image: radial-gradient(tan 30%, transparent 0),\n          radial-gradient(tan 30%, transparent 0);\n          background-size: 30px 30px;\n          background-position: 0 0, 15px 15px;\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-6-5"}}),_vm._v(" "),_c('code',[_vm._v("\n          background: #eee;\n          background-image:\n          linear-gradient(45deg, #bbb 25%, transparent 0),\n          linear-gradient(45deg, transparent 75%, #bbb 0),\n          linear-gradient(45deg, #bbb 25%, transparent 0),\n          linear-gradient(45deg, transparent 75%, #bbb 0);\n          background-size: 30px 30px;\n          background-position: 0 0, 15px 15px,15px 15px,30px 30px;\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('p',[_vm._v("\n          复杂的背景参考：\n          "),_c('a',{attrs:{"href":"http://bennettfeely.com/gradients/"}},[_vm._v("http://bennettfeely.com/gradients/")])])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-7-1"}},[_vm._v("content")]),_vm._v(" "),_c('code',[_vm._v("\n          padding: 1em;\n          border: 1em solid transparent;\n          background: linear-gradient(white, white) padding-box,\n          repeating-linear-gradient(-45deg,\n          red 0, red 12.5%,\n          transparent 0, transparent 25%,\n          #58a 0, #58a 37.5%,\n          transparent 0, transparent 50%)\n          0 / 5em 5em;\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-1-7-2"}},[_vm._v("content")]),_vm._v(" "),_c('code',[_vm._v("\n          @keyframes ants { to { background-position: 100% } }\n\n          #eg-1-7-2{\n             padding: 1em;\n             border: 1px solid transparent;\n             background:\n            linear-gradient(white, white) padding-box,\n            repeating-linear-gradient(-45deg,\n            black 0, black 25%, white 0, white 50%\n            ) 0 / .6em .6em;\n             animation: ants 12s linear infinite;\n          }\n        ")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_shapes_vue__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6ee20191_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_shapes_vue__ = __webpack_require__(35);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_shapes_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6ee20191_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_shapes_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({});

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content"},[_c('section',{staticClass:"c-chapter",attrs:{"id":"c-2"}},[_c('h2',[_vm._v(_vm._s(_vm.$t("lang.directory[1].chapter")))]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-2-1"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[1].sections[0]")))]),_vm._v(" "),_c('div',{attrs:{"id":"eg-2-1-1"}}),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\tbackground-color: #FFDD00;\n\t\t\t\t\tborder-radius: 50px / 10px;\n\t\t\t\t\tborder-radius: 50% / 50%;\n\t\t\t\t")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-2-1-2"}}),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\tborder-radius: 100% 0 0 100% / 50%;\n\t\t\t\t")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-2-1-3"}}),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\tborder-radius: 100% 0 0 0 ;\n\t\t\t\t")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-2-2"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[1].sections[1]")))]),_vm._v(" "),_c('h4',[_vm._v("Nested elements solution")]),_vm._v(" "),_vm._m(0,false,false),_vm._v(" "),_c('h4',[_vm._v("Pseudo-element solution")]),_vm._v(" "),_vm._m(1,false,false),_vm._v(" "),_vm._m(2,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-2-3"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[1].sections[2]")))]),_vm._v(" "),_vm._m(3,false,false),_vm._v(" "),_vm._m(4,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-2-4"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[1].sections[3]")))]),_vm._v(" "),_vm._m(5,false,false),_vm._v(" "),_vm._m(6,false,false),_vm._v(" "),_vm._m(7,false,false),_vm._v(" "),_vm._m(8,false,false),_vm._v(" "),_vm._m(9,false,false),_vm._v(" "),_vm._m(10,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-2-5"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[1].sections[4]")))]),_vm._v(" "),_vm._m(11,false,false),_vm._v(" "),_vm._m(12,false,false),_vm._v(" "),_vm._m(13,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-2-6"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[1].sections[5]")))]),_vm._v(" "),_vm._m(14,false,false),_vm._v(" "),_c('section',[_c('h4',[_vm._v("svg solution")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-2-6-2"}},[_c('div',{staticClass:"pie"},[_c('svg',{attrs:{"viewBox":"0 0 32 32"}},[_c('title',[_vm._v("20%")]),_vm._v(" "),_c('circle',{attrs:{"r":"16","cx":"16","cy":"16","stroke-dasharray":"20 100"}})]),_vm._v(" "),_c('svg',{attrs:{"viewBox":"0 0 32 32"}},[_c('circle',{attrs:{"r":"16","cx":"16","cy":"16","stroke-dasharray":"60 100"}})]),_vm._v(" "),_c('svg',{attrs:{"viewBox":"0 0 32 32"}},[_c('circle',{staticClass:"grow",attrs:{"r":"16","cx":"16","cy":"16","stroke-dasharray":"0 100"}})])])])])])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-2-2-1"}},[_c('div',{staticClass:"ele-wrapper"},[_c('a',{staticClass:"button",attrs:{"href":"#yolo"}},[_c('div',[_vm._v("Click me")])])]),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\t.button{\n\t\t\t\t\t\t\ttransform: skewX(-45deg);\n\t\t\t\t\t\t\tdisplay: inline-block;\n\t\t\t\t\t\t\tbackground: #0066aa;\n\t\t\t\t\t\t\ttext-decoration: none;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\t.button > div{\n\t\t\t\t\t\t\ttransform: skewX(45deg);\n\t\t\t\t\t\t}\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-2-2-2"}},[_c('div',{staticClass:"ele-wrapper"},[_c('a',{staticClass:"button",attrs:{"href":"#yolo"}},[_vm._v("\n  \t\t\t\t\t\tClick me\n  \t\t\t\t\t")])]),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\t.button {\n\t\t\t\t\t\tposition: relative;\n\t\t\t\t\t\t}\n\t\t\t\t\t\t.button::before {\n\t\t\t\t\t\tcontent: '';\n\t\t\t\t\t\tposition: absolute;\n\t\t\t\t\t\ttop: 0; right: 0; bottom: 0; left: 0;\n\t\t\t\t\t\tz-index: -1;\n\t\t\t\t\t\tbackground: #58a;\n\t\t\t\t\t\ttransform: skew(45deg);\n\t\t\t\t\t\t}\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',[_c('a',{attrs:{"href":"https://www.oneasp.com/","target":"_blink"}},[_vm._v("点击查看我的应用案例")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('h4',[_vm._v("transform-based solution")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-2-3-1"}},[_c('img',{attrs:{"src":__webpack_require__(4)}})]),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\twidth: 180px;\n\t\t\t\t\t\ttransform: rotate(45deg);\n\t\t\t\t\t\toverflow: hidden;\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('h4',[_vm._v("Clipping path solution")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-2-3-2"}},[_c('img',{attrs:{"src":__webpack_require__(4)}})]),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\t-webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);\n\t\t\t\t\t\tclip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-2-4-1"}}),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tbackground: #58a;\n\t\t\t\t\t\tbackground: linear-gradient(-45deg, transparent 15px, #58a 0);\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-2-4-2"}}),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tbackground: #58a;\n\t\t\t\t\t\tbackground:\n\t\t\t\t\t\tlinear-gradient(-45deg, transparent 15px, #58a 0)\n\t\t\t\t\t\tright,\n\t\t\t\t\t\tlinear-gradient(45deg, transparent 15px, #655 0)\n\t\t\t\t\t\tleft;\n\t\t\t\t\t\tbackground-size: 50% 100%;\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-2-4-3"}}),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tbackground: #58a;\n\t\t\t\t\t\tbackground:\n\t\t\t\t\t\tlinear-gradient(-45deg, transparent 15px, #58a 0)\n\t\t\t\t\t\tright,\n\t\t\t\t\t\tlinear-gradient(45deg, transparent 15px, #655 0)\n\t\t\t\t\t\tleft;\n\t\t\t\t\t\tbackground-size: 50% 100%;\n\t\t\t\t\t\tbackground-repeat: no-repeat;\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-2-4-4"}}),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tbackground: #58a;\n\t\t\t\t\t\tbackground:\n\t\t\t\t\t\tlinear-gradient(135deg, transparent 15px, #58a 0)\n\t\t\t\t\t\ttop left,\n\t\t\t\t\t\tlinear-gradient(-135deg, transparent 15px, #655 0)\n\t\t\t\t\t\ttop right,\n\t\t\t\t\t\tlinear-gradient(-45deg, transparent 15px, #58a 0)\n\t\t\t\t\t\tbottom right,\n\t\t\t\t\t\tlinear-gradient(45deg, transparent 15px, #655 0)\n\t\t\t\t\t\tbottom left;\n\t\t\t\t\t\tbackground-size: 50% 50%;\n\t\t\t\t\t\tbackground-repeat: no-repeat;\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-2-4-5"}}),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tbackground: #58a;\n\t\t\t\t\t\tbackground:\n\t\t\t\t\t\tradial-gradient(circle at top left,\n\t\t\t\t\t\ttransparent 15px, #58a 0) top left,\n\t\t\t\t\t\tradial-gradient(circle at top right,\n\t\t\t\t\t\ttransparent 15px, #58a 0) top right,\n\t\t\t\t\t\tradial-gradient(circle at bottom right,\n\t\t\t\t\t\ttransparent 15px, #58a 0) bottom right,\n\t\t\t\t\t\tradial-gradient(circle at bottom left,\n\t\t\t\t\t\ttransparent 15px, #58a 0) bottom left;\n\t\t\t\t\t\tbackground-size: 50% 50%;\n\t\t\t\t\t\tbackground-repeat: no-repeat;\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-2-4-6"}}),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tbackground: #58a;\n\t\t\t\t\t\t-webkit-clip-path: polygon(\n\t\t\t\t\t\t20px 0, calc(100% - 20px) 0, 100% 20px,\n\t\t\t\t\t\t100% calc(100% - 20px), calc(100% - 20px) 100%,\n\t\t\t\t\t\t20px 100%, 0 calc(100% - 20px), 0 20px\n\t\t\t\t\t\t);\n\t\t\t\t\t\tclip-path: polygon(\n\t\t\t\t\t\t20px 0, calc(100% - 20px) 0, 100% 20px,\n\t\t\t\t\t\t100% calc(100% - 20px), calc(100% - 20px) 100%,\n\t\t\t\t\t\t20px 100%, 0 calc(100% - 20px), 0 20px\n\t\t\t\t\t\t);\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-2-5-1"}}),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\ttransform: perspective(5em) rotateX(5deg);\n\t\t\t\t\t\tbackground: #58a;\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-2-5-2"}},[_c('div',{staticClass:"tab"})]),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\t.tab{\n\t\t\t\t\t\t\tposition: relative;\n\t\t\t\t\t\t\tdisplay: inline-block;\n\t\t\t\t\t\t\tpadding: .5em 1em .35em;\n\t\t\t\t\t\t\tcolor: white;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\t.tab:before{\n\t\t\t\t\t\t\tcontent: '';\n\t\t\t\t\t\t\tposition: absolute;\n\t\t\t\t\t\t\ttop: 0; right: 0; bottom: 0; left: 0;\n\t\t\t\t\t\t\tz-index: -1;\n\t\t\t\t\t\t\tbackground: #58a;\n\t\t\t\t\t\t\ttransform: scaleY(1.3) perspective(.5em) rotateX(5deg);\n\t\t\t\t\t\t\ttransform-origin: bottom;\n\t\t\t\t\t\t}\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{attrs:{"id":"eg-2-5-3"}},[_c('nav',[_c('a',[_vm._v("home")]),_vm._v(" "),_c('a',[_vm._v("A")]),_vm._v(" "),_c('a',[_vm._v("B")])]),_vm._v(" "),_c('div',{staticStyle:{"background":"#eee","width":"240px"}})]),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tnav > a{\n\t\t\t\t\t\t\tposition: relative;\n\t\t\t\t\t\t\tdisplay: inline-block;\n\t\t\t\t\t\t\tpadding: .3em 1em 0;\n\t\t\t\t\t\t\tcursor: pointer;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tnav > a:before{\n\t\t\t\t\t\t\tcontent: '';\n\t\t\t\t\t\t\tposition: absolute;\n\t\t\t\t\t\t\ttop: 0; right: 0; bottom: 0; left: 0;\n\t\t\t\t\t\t\tz-index: -1;\n\t\t\t\t\t\t\tbackground: #ccc;\n\t\t\t\t\t\t\tbackground-image: linear-gradient(\n\t\t\t\t\t\t\thsla(0,0%,100%,.6),\n\t\t\t\t\t\t\thsla(0,0%,100%,0));\n\t\t\t\t\t\t\tborder: 1px solid rgba(0,0,0,.4);\n\t\t\t\t\t\t\tborder-bottom: none;\n\t\t\t\t\t\t\tborder-radius: .5em .5em 0 0;\n\t\t\t\t\t\t\tbox-shadow: 0 .15em white inset;\n\t\t\t\t\t\t\ttransform: perspective(.5em) rotateX(5deg);\n\t\t\t\t\t\t\ttransform-origin: bottom;\n\t\t\t\t\t\t}\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('h4',[_vm._v("div solution")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-2-6-1"}},[_c('div',{staticClass:"pie"})])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_visualEffects_vue__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_99868054_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_visualEffects_vue__ = __webpack_require__(38);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_visualEffects_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_99868054_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_visualEffects_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({});

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content"},[_c('section',{staticClass:"c-chapter",attrs:{"id":"c-3"}},[_c('h2',[_vm._v(_vm._s(_vm.$t("lang.directory[2].chapter")))]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-3-1"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[2].sections[0]")))]),_vm._v(" "),_vm._m(0,false,false),_vm._v(" "),_vm._m(1,false,false),_vm._v(" "),_vm._m(2,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-3-2"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[2].sections[1]")))]),_vm._v(" "),_vm._m(3,false,false),_vm._v(" "),_vm._m(4,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-3-3"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[2].sections[2]")))]),_vm._v(" "),_vm._m(5,false,false),_vm._v(" "),_vm._m(6,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-3-4"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[2].sections[3]")))]),_vm._v(" "),_vm._m(7,false,false),_vm._v(" "),_vm._m(8,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-3-5"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[2].sections[4]")))]),_vm._v(" "),_vm._m(9,false,false),_vm._v(" "),_vm._m(10,false,false)])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{attrs:{"id":"eg-3-1-1"}},[_c('h4',[_vm._v("Shadow on one side")]),_vm._v(" "),_c('div'),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tbox-shadow: 0 5px 4px -4px black;\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{attrs:{"id":"eg-3-1-2"}},[_c('h4',[_vm._v("Shadow on two adjacent sides")]),_vm._v(" "),_c('div'),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tbox-shadow: 3px 3px 6px -3px black;\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{attrs:{"id":"eg-3-1-3"}},[_c('h4',[_vm._v("Shadow on two opposite sides")]),_vm._v(" "),_c('div'),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tbox-shadow: 5px 0 5px -5px black,-5px 0 5px -5px black;\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{attrs:{"id":"eg-3-2-1"}},[_c('div',{staticClass:"speech"}),_vm._v(" "),_c('div',{staticClass:"dot"}),_vm._v(" "),_c('div',{staticClass:"cutout"}),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\t-webkit-filter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));\n\t\t\t\t\t\tfilter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{attrs:{"id":"eg-3-2-2"}},[_c('h4',[_vm._v("shadow's shadow")]),_vm._v(" "),_c('div',[_vm._v("shadows")]),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\ttext-shadow: .1em .2em yellow;\n\t\t\t\t\t\t-webkit-filter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));\n\t\t\t\t\t\tfilter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{attrs:{"id":"eg-3-3-1"}},[_c('h4',[_vm._v("Filter-based solution")]),_vm._v(" "),_c('img',{attrs:{"src":"http://csssecrets.io/images/tiger.jpg","alt":""}}),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tfilter: sepia() saturate(4) hue-rotate(295deg);\n\t\t\t\t\t\t-webkit-filter: sepia() saturate(4) hue-rotate(295deg);\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{attrs:{"id":"eg-3-3-2"}},[_c('h4',[_vm._v("Blending mode solution")]),_vm._v(" "),_c('div'),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tbackground-color: hsl(335, 100%, 50%);\n\t\t\t\t\t\tbackground-blend-mode: luminosity;\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{attrs:{"id":"eg-3-4-1"}},[_c('div',{staticClass:"bg"},[_c('div',[_vm._v("This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.")])]),_vm._v(" "),_c('code',[_vm._v("\n            background-color: rgba(255,255,255,0.5);\n          ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{attrs:{"id":"eg-3-4-2"}},[_c('div',{staticClass:"bg"},[_c('div',[_vm._v("This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.")])]),_vm._v(" "),_c('code',[_vm._v("\n            filter: blur(20px);\n          ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{attrs:{"id":"eg-3-5-1"}},[_c('h4',[_vm._v("The 45° solution")]),_vm._v(" "),_c('div'),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tbackground: #58a; /* Fallback */\n\t\t\t\t\t\tbackground:\n\t\t\t\t\t\t    linear-gradient(to left bottom,\n\t\t\t\t\t\t        transparent 50%, rgba(0,0,0,.4) 0)\n\t\t\t\t\t\t        no-repeat 100% 0 / 2em 2em,\n\t\t\t\t\t\t    linear-gradient(-135deg,\n\t\t\t\t\t\t        transparent 1.4em, #58a 0);\n\t\t\t\t\t")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{attrs:{"id":"eg-3-5-2"}},[_c('h4',[_vm._v("Solution for other angles")]),_vm._v(" "),_c('div'),_vm._v(" "),_c('code',[_vm._v("\n\t\t\t\t\t\tbackground: #58a; /* Fallback */\n\t\t\t\t\t\tlinear-gradient(to left bottom,\n\t        transparent 50%, rgba(0,0,0,.4) 0)\n\t        no-repeat 100% 0 / 3em 1.73em,\n\t    linear-gradient(-150deg,\n\t        transparent 1.5em, #58a 0)\n\t\t\t\t\t")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_typography_vue__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_18818151_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_typography_vue__ = __webpack_require__(41);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_typography_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_18818151_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_typography_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({});

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content"},[_c('section',{staticClass:"c-chapter",attrs:{"id":"c-4"}},[_c('h2',[_vm._v(_vm._s(_vm.$t("lang.directory[3].chapter")))]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-4-1"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[3].sections[0]")))]),_vm._v(" "),_c('p',[_vm._v("中文排版环境下一般不需要考虑连字符断行")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-4-1-1"}},[_vm._v("“The only way to get rid of a temptation is to yield to it.”")]),_vm._v(" "),_c('code',[_vm._v("\n            width: 5em;\n            font-size: 18px;\n            text-align: justify;\n            hyphens: auto;\n            height: auto;\n          ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-4-2"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[3].sections[1]")))]),_vm._v(" "),_vm._m(0,false,false),_vm._v(" "),_c('code',[_vm._v("\n          dt,dd{\n            display: inline;\n          }\n          dd{\n            margin: 0;\n            font-weight: bold;\n            &ammp;::after{\n              content: '\\A';\n              white-space: pre;\n          }\n        ")]),_vm._v(" "),_vm._m(1,false,false),_vm._v(" "),_c('code',[_vm._v("\n          dd + dt::before{\n            content: '\\A';\n            white-space: pre;\n          }\n          dd + dd::before{\n            content: ', ';\n            font-weight: normal;\n            margin-left: -.25em;\n          }\n        ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-4-3"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[3].sections[2]")))]),_vm._v(" "),_c('p',[_vm._v("条纹会随着字体的大小改变而自适应地变化，注意background-size 第二个参数是行高的 2倍")]),_vm._v(" "),_vm._m(2,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-4-4"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[3].sections[3]")))]),_vm._v(" "),_vm._m(3,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-4-5"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[3].sections[4]")))]),_vm._v(" "),_vm._m(4,false,false),_vm._v(" "),_c('code',[_vm._v("\n          font: 150%/1.6 \"Adobe Caslon Pro\", Baskerville, serif;\n          font-variant: common-ligatures discretionary-ligatures historical-ligatures;\n        ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-4-6"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[3].sections[5]")))]),_vm._v(" "),_vm._m(5,false,false),_vm._v(" "),_c('code',[_vm._v("\n          font-family: Ampersand;\n          src: local('Baskerville-Italic'),\n               local('GoudyOldStyleT-Italic'),\n               local('Palatino-Italic'),\n               local('BookAntiqua-Italic');\n          unicode-range: U+26;\n\n          p{\n            font-family: Ampersand, Helvetica, sans-serif;\n          }\n        ")]),_vm._v(" "),_vm._m(6,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-4-7"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[3].sections[6]")))]),_vm._v(" "),_vm._m(7,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-4-8"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[3].sections[7]")))]),_vm._v(" "),_c('div',{attrs:{"id":"eg-4-8-1"}},[_c('h4',[_vm._v("Letterpress")]),_vm._v(" "),_c('p',{staticClass:"letterpress-1"},[_vm._v("CSS Secrets Demos")]),_vm._v(" "),_c('code',[_vm._v("\n            background: hsl(210, 13%, 60%);\n            color: hsl(210, 13%, 30%);\n            text-shadow: 0 1px 1px hsla(0,0%,100%,.8);\n          ")]),_vm._v(" "),_c('p',{staticClass:"letterpress-2"},[_vm._v("CSS Secrets Demos")]),_vm._v(" "),_c('code',[_vm._v("\n            background: hsl(210, 13%, 30%);\n            color: hsl(210, 13%, 60%);\n            text-shadow: 0 -1px 1px black;\n          ")]),_vm._v(" "),_c('h4',[_vm._v("Stroked text")]),_vm._v(" "),_c('p',{staticClass:"strokeText"},[_c('svg',{attrs:{"width":"2em","height":"1.2em"}},[_c('use',{attrs:{"xlink:href":"#css"}}),_vm._v(" "),_c('text',{attrs:{"id":"css","y":"1em"}},[_vm._v("css")])])]),_vm._v(" "),_c('code',[_vm._v("\n            .strokeText{\n              font: 500%/1 Rockwell, serif;\n              background: deeppink;\n              color: white;\n              text{\n                fill: currentColor;\n              }\n              use{\n                stroke: black;\n          \t    stroke-width: 6;\n          \t    stroke-linejoin: round;\n              }\n            }\n          ")]),_vm._v(" "),_c('h4',[_vm._v("Glowing text")]),_vm._v(" "),_c('p',{staticClass:"glowingText"},[_vm._v("\n            Hover to glow\n          ")]),_vm._v(" "),_c('code',[_vm._v("\n            .glowingText{\n              background: #203;\n              font: bold;\n              color: #ffc;\n              text-decoration: none;\n              transition: 1s;\n              &:hover{\n                text-shadow: 0 0 .1em,0 0 .3em;\n              }\n            }\n          ")]),_vm._v(" "),_c('h4',[_vm._v("Extruded text")]),_vm._v(" "),_c('p',{staticClass:"extrudedText"},[_vm._v("\n            CSS 3D\n          ")]),_vm._v(" "),_c('code',[_vm._v("\n            background: #58a;\n            color: #fff;\n            text-shadow: 0 1px hsl(0,0%,85%),\n                         0 2px hsl(0, 0%,80%),\n                         0 3px hsl(0,0%,75%),\n                         0 4px hsl(0,0%,70%),\n                         0 5px hsl(0,0%,65%),\n                         0 5px 10px black;\n            font: bold 400%/1 Rockwell,serif;\n          ")])])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-4-9"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[3].sections[8]")))]),_vm._v(" "),_c('div',{attrs:{"id":"eg-4-9-1"}},[_c('div',{staticClass:"circle"},[_c('svg',{attrs:{"viewBox":"0 0 100 100"}},[_c('path',{attrs:{"d":"M0,50 a50,50 0 1,1 0,1z","id":"circle"}}),_vm._v(" "),_c('text',[_c('textPath',{attrs:{"xlink:href":"#circle"}},[_vm._v("\n                  Welcome to the World of CSS :)\n                ")])])])]),_vm._v(" "),_c('code',[_vm._v("\n            .circle{\n              width: 10em;\n              height: 10em;\n              margin: 4em auto 0;\n              font: bold 120% Helvetica, sans-serif;\n            }\n\n            .circle svg{\n              display: block;\n        \t    overflow: visible;\n        \t    transition: 10s linear transform;\n              &:hover{\n                transform: rotate(-2turn);\n              }\n            }\n\n            .circle text{\n              fill: black;\n            }\n            .circle path{\n              fill: none;\n            }\n\n          ")])])])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-4-2-1"}},[_c('dl',[_c('dt',[_vm._v("Name:")]),_vm._v(" "),_c('dd',[_vm._v("Hazel")]),_vm._v(" "),_c('dt',[_vm._v("Email:")]),_vm._v(" "),_c('dd',[_vm._v("css-secrets-demo@gmail.com")]),_vm._v(" "),_c('dt',[_vm._v("Location:")]),_vm._v(" "),_c('dd',[_vm._v("Earth")])])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-4-2-2"}},[_c('dl',[_c('dt',[_vm._v("Name:")]),_vm._v(" "),_c('dd',[_vm._v("Hazel")]),_vm._v(" "),_c('dt',[_vm._v("Email:")]),_vm._v(" "),_c('dd',[_vm._v("css-secrets-demo@gmail.com")]),_vm._v(" "),_c('dd',[_vm._v("css@edu.cn")]),_vm._v(" "),_c('dt',[_vm._v("Location:")]),_vm._v(" "),_c('dd',[_vm._v("Earth")])])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-4-3-1"}},[_c('pre',[_vm._v("            "),_c('code',{staticClass:"code"},[_vm._v("while (true) {\n  var d = new Date();\n  if (d.getDate()==1 &&\n      d.getMonth()==3) {\n    alert(\"TROLOLOL\");\n  }\n}")])]),_vm._v(" "),_c('code',[_vm._v("\n              font-size: 20px;\n              padding: 0.5em;\n              line-height: 1.5;\n              background: beige;\n              background-size: auto 3em;\n              background-image: linear-gradient(rgba(0, 0, 0, 0.2) 50%, transparent 0);\n              background-origin: content-box;\n              white-space: pre;\n            ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-4-4-1"}},[_c('pre',{staticClass:"pre-2"},[_vm._v("            "),_c('code',{staticClass:"code"},[_vm._v("while (true) {\n\tvar d = new Date();\n\tif (d.getDate()==1 &&\n\t    d.getMonth()==3) {\n\t\talert(\"TROLOLOL\");\n\t}\n}")]),_vm._v("\n          ")]),_vm._v(" "),_c('code',[_vm._v("\n            tab-size: 2;\n          ")]),_vm._v(" "),_c('pre',{staticClass:"pre-4"},[_vm._v("            "),_c('code',{staticClass:"code"},[_vm._v("while (true) {\n\tvar d = new Date();\n\tif (d.getDate()==1 &&\n\t    d.getMonth()==3) {\n\t\talert(\"TROLOLOL\");\n\t}\n}")]),_vm._v("\n          ")]),_vm._v(" "),_c('code',[_vm._v("\n            tab-size: 4;\n          ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-4-5-1"}},[_c('p',[_vm._v("Common ligatures: fi ff fl ffi ffl")]),_vm._v(" "),_c('p',[_vm._v("Discretionary ligatures: st ct")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-4-6-1"}},[_c('p',[_vm._v("HTML & CSS")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',[_vm._v("unicode-range不是css属性，但是它能告诉浏览器，只把字体应用在某个编码范围内；"),_c('br'),_vm._v("\n          如果需要下载远程的字体文件，有的浏览器甚至只会下载会运用的那一部分；"),_c('br'),_vm._v("\n          26是 "),_c('code',{staticClass:"inline"},[_vm._v("\"&\".charCodeAt(0).toString(16);")]),_vm._v(" 这么来的；"),_c('br'),_vm._v("\n          local() 里需要加 Italic，而不能用 font-style，因为只希望运用在符号上。\n        ")])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-4-7-1"}},[_c('h4',[_vm._v("Normal underlines 横线")]),_vm._v(" "),_c('p',{staticClass:"normal"},[_vm._v("“The only way to "),_c('a',[_vm._v("get rid of a temp­ta­tion")]),_vm._v(" is to "),_c('a',[_vm._v("yield")]),_vm._v(" to it.\"")]),_vm._v(" "),_c('code',[_vm._v("\n            background: linear-gradient(gray, gray) no-repeat;\n            background-size: 100% 1px;\n            background-position: 0 1.05em;\n            text-shadow: .05em 0 white, -.05em 0 white;\n          ")]),_vm._v(" "),_c('h4',[_vm._v("Dashed underlines 虚线")]),_vm._v(" "),_c('p',{staticClass:"dashed"},[_vm._v("“The only way to "),_c('a',[_vm._v("get rid of a temp­ta­tion")]),_vm._v(" is to "),_c('a',[_vm._v("yield")]),_vm._v(" to it.\"")]),_vm._v(" "),_c('code',[_vm._v("\n            background: linear-gradient(90deg,gray 66%, transparent 0) repeat-x;\n            background-size: .2em 2px;\n            background-position: 0 1.05em;\n            text-shadow: .05em 0 white, -.05em 0 white;\n          ")]),_vm._v(" "),_c('h4',[_vm._v("Wavy underlines 波浪线")]),_vm._v(" "),_c('p',{staticClass:"wavy"},[_vm._v("“The only way to "),_c('a',[_vm._v("get rid of a temp­ta­tion")]),_vm._v(" is to "),_c('a',[_vm._v("yield")]),_vm._v(" to it.\"")]),_vm._v(" "),_c('code',[_vm._v("\n            background: linear-gradient(90deg,gray 66%, transparent 0) repeat-x;\n            background-size: .2em 2px;\n            background-position: 0 1.05em;\n            text-shadow: .05em 0 white, -.05em 0 white;\n          ")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userExperience_vue__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_345fd432_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_userExperience_vue__ = __webpack_require__(44);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userExperience_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_345fd432_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_userExperience_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      lightboxShow: false,
      blurDialogShow: false,
      imgSliderRange: 50
    };
  },
  methods: {
    showLightbox() {
      this.lightboxShow = true;
    },
    hideLightBox() {
      this.lightboxShow = false;
    }
  }
});

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content"},[_c('section',{staticClass:"c-chapter",attrs:{"id":"c-5"}},[_c('h2',[_vm._v(_vm._s(_vm.$t("lang.directory[4].chapter")))]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-5-1"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[4].sections[0]")))]),_vm._v(" "),_vm._m(0,false,false),_vm._v(" "),_c('code',[_vm._v("\n        :disabled, [disabled], [aria-disabled=\"true\"]{\n          cursor: not-allowed;\n        }\n      ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-5-2"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[4].sections[1]")))]),_vm._v(" "),_vm._m(1,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-5-3"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[4].sections[2]")))]),_vm._v(" "),_c('h4',[_vm._v("checkboxes")]),_vm._v(" "),_vm._m(2,false,false),_vm._v(" "),_c('code',[_vm._v("\n        input[type=\"checkbox\"] {\n        \tposition: absolute;\n        \tclip: rect(0,0,0,0);\n        }\n\n        input[type=\"checkbox\"] + label::before {\n        \tcontent: '\\a0';\n        \tdisplay: inline-block;\n        \tvertical-align: .2em;\n        \twidth: .8em;\n        \theight: .8em;\n        \tmargin-right: .2em;\n        \tborder-radius: .2em;\n        \tbackground: silver;\n        \ttext-indent: .15em;\n        \tline-height: .65;\n        }\n\n        input[type=\"checkbox\"]:checked + label::before {\n        \tcontent: '\\2713';\n        \tbackground: yellowgreen;\n        }\n\n        input[type=\"checkbox\"]:focus + label::before {\n        \tbox-shadow: 0 0 .1em .1em #58a;\n        }\n\n        input[type=\"checkbox\"]:disabled + label::before {\n        \tbackground: gray;\n        \tbox-shadow: none;\n        \tcolor: #555;\n        \tcursor: not-allowed;\n        }\n      ")]),_vm._v(" "),_c('h4',[_vm._v("Toggle buttons")]),_vm._v(" "),_vm._m(3,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-5-4"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[4].sections[3]")))]),_vm._v(" "),_c('h4',[_vm._v("box-shadow solution")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-5-4-1"}},[_c('button',{on:{"click":_vm.showLightbox}},[_vm._v("Show Modal")]),_vm._v(" "),(_vm.lightboxShow)?_c('div',{staticClass:"lightbox"},[_c('span',{staticClass:"close-btn",attrs:{"title":"关闭"},on:{"click":_vm.hideLightBox}},[_vm._v("X")]),_vm._v(" "),_c('img',{attrs:{"src":__webpack_require__(4),"alt":"pokemon-img"}})]):_vm._e(),_vm._v(" "),_c('code',[_vm._v("\n          box-shadow: 0 0 0 50vmax rgba(0,0,0,.8);")]),_vm._v(" "),_c('p',[_vm._v("注意由于此方法用 box-shadow 来做黑色阴影，所以无法捕获到鼠标焦点，\n          鼠标仍可以操作后层的元素;这个方法比较适合做原型等简易场景时使用")])]),_vm._v(" "),_c('h4',[_vm._v("backdrop solution")]),_vm._v(" "),_vm._m(4,false,false)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-5-5"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[4].sections[4]")))]),_vm._v(" "),_c('router-link',{attrs:{"to":{ path: 'blurDialog' },"target":"_blank"}},[_vm._v("查看示例")])],1),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-5-6"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[4].sections[5]")))]),_vm._v(" "),_vm._m(5,false,false),_vm._v(" "),_c('code',[_vm._v("\n        display: inline-block;\n        overflow: auto;\n        width: 12em;\n        height: 8em;\n        border: 1px solid silver;\n        padding: .3em .5em;\n        list-style: none;\n        font-size: 200%;\n        background: linear-gradient(#fff 15px,hsla(0,0%,100%,0)) 0 0,\n                    radial-gradient(at center top,rgba(0,0,0,0.2),transparent 70%) 0 0,\n                    linear-gradient(to top,white 15px,hsla(0,0%,100%,0)) bottom,\n                    radial-gradient(at center bottom, rgba(0,0,0,0.2),transparent 70%) bottom;\n        background-size: 100% 15px,100% 15px,100% 15px,100% 15px;\n        background-repeat: no-repeat;\n        background-attachment: local,scroll,local,scroll;\n        margin-top: 30px;\n      ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-5-7"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[4].sections[6]")))]),_vm._v(" "),_c('h4',[_vm._v("CSS resize solution")]),_vm._v(" "),_vm._m(6,false,false),_vm._v(" "),_c('code',[_vm._v("\n        .image-slider {\n        \tposition:relative;\n        \tdisplay: inline-block;\n        }\n\n        .image-slider > .slider {\n        \tposition: absolute;\n        \ttop: 0; bottom: 0; left: 0;\n        \twidth: 50%;\n        \tmax-width: 100%;\n        \toverflow: hidden;\n        \tresize: horizontal;\n        }\n\n        .image-slider > .slider:before {\n        \tcontent: '';\n        \tposition: absolute;\n        \tright: 0; bottom: 0;\n        \twidth: 12px; height: 12px;\n        \tpadding: 5px;\n        \tbackground: linear-gradient(-45deg, white 50%, transparent 0);\n        \tbackground-clip: content-box;\n        \tcursor: ew-resize;\n        \t-webkit-filter: drop-shadow(0 0 2px black);\n        \tfilter: drop-shadow(0 0 2px black);\n        }\n\n        .image-slider img {\n        \tdisplay: block;\n        \tuser-select: none;\n        }\n      ")]),_vm._v(" "),_c('h4',[_vm._v("Range input solution")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-5-7-2"}},[_c('div',{staticClass:"img-slider"},[_c('div',{staticClass:"slider",style:({ width: _vm.imgSliderRange +'%'})},[_c('img',{attrs:{"src":"http://csssecrets.io/images/adamcatlace-before.jpg","alt":"after"}})]),_vm._v(" "),_c('img',{staticClass:"img",attrs:{"src":"http://csssecrets.io/images/adamcatlace.jpg","alt":"now"}}),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.imgSliderRange),expression:"imgSliderRange"}],staticClass:"range",attrs:{"type":"range"},domProps:{"value":(_vm.imgSliderRange)},on:{"__r":function($event){_vm.imgSliderRange=$event.target.value}}})])])])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-5-1-1"}},[_c('button',[_vm._v("Button")]),_vm._v(" "),_c('button',{attrs:{"disabled":""}},[_vm._v("Disabled Button")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-5-2-1"}},[_c('h4',[_vm._v("Border solution")]),_vm._v(" "),_c('button',{staticClass:"border"},[_vm._v("+")]),_c('br'),_vm._v(" "),_c('code',[_vm._v("\n          button{\n            background: #58a;\n            color: #fff;\n            cursor: pointer;\n            border-radius: 50%;\n            padding: .3em .5em;\n            font: 150% bold;\n            line-height: 1;\n            border: 10px solid transparent;\n            background-clip: padding-box;\n            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3) inset;\n          }\n        ")]),_vm._v(" "),_c('h4',[_vm._v("Pseudo-elements solution")]),_vm._v(" "),_c('button',{staticClass:"pseudo"},[_vm._v("+")]),_c('br'),_vm._v(" "),_c('code',[_vm._v("\n          button{\n            position: relative;\n            background: #58a;\n            color: #fff;\n            cursor: pointer;\n            border-radius: 50%;\n            padding: .3em .5em;\n            font: 150% bold;\n            line-height: 1;\n            border: 10px solid transparent;\n            background-clip: padding-box;\n            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3) inset;\n          }\n          button::before{\n            position: absolute;\n            content: '';\n            top: -10px;\n            right: -10px;\n            bottom: -10px;\n            left: -10px;\n          }\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-5-3-1"}},[_c('input',{attrs:{"type":"checkbox","id":"checkbox1"}}),_vm._v(" "),_c('label',{attrs:{"for":"checkbox1"}},[_vm._v("option 1")]),_c('br'),_vm._v(" "),_c('input',{attrs:{"type":"checkbox","id":"checkbox2","checked":""}}),_vm._v(" "),_c('label',{attrs:{"for":"checkbox2"}},[_vm._v("option 2")]),_c('br'),_vm._v(" "),_c('input',{attrs:{"type":"checkbox","id":"checkbox3","disabled":""}}),_vm._v(" "),_c('label',{attrs:{"for":"checkbox3"}},[_vm._v("option 3")]),_c('br'),_vm._v(" "),_c('input',{attrs:{"type":"checkbox","id":"checkbox4","checked":"","disabled":""}}),_vm._v(" "),_c('label',{attrs:{"for":"checkbox4"}},[_vm._v("option 4")]),_c('br')])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-5-3-2"}},[_c('input',{attrs:{"type":"checkbox","id":"btn1"}}),_vm._v(" "),_c('label',{attrs:{"for":"btn1"}},[_vm._v("Button 1")]),_vm._v(" "),_c('input',{attrs:{"type":"checkbox","id":"btn2"}}),_vm._v(" "),_c('label',{attrs:{"for":"btn2"}},[_vm._v("Button 2")]),_vm._v(" "),_c('code',[_vm._v("\n          input[type=\"checkbox\"]{\n            position: absolute;\n            clip: rect(0,0,0,0);\n          }\n\n          input[type=\"checkbox\"]& + label{\n            display: inline-block;\n            padding: .3em .5em;\n            background: yellowgreen;\n            background-image: linear-gradient(yellowgreen, #6fa600);\n            border-radius: 10px;\n            border: 1px solid #6fa600;\n            box-shadow: 0 1px white inset;\n            text-align: center;\n            text-shadow: 0 1px 1px white;\n            cursor: pointer;\n            transition: all .3s ease-in-out;\n          }\n\n          input[type=\"checkbox\"]&:checked + label{\n            box-shadow: 0 0 .2em .2em rgba(6, 114, 0, 0.6) inset;\n            background: #6fa600;\n            border: 1px solid rgba(0,0,0,.3);\n          }\n        ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',[_vm._v("这种方法需要使用浏览器自带的 showModal() 方法，但是支持的浏览器有限，"),_c('br'),_vm._v("\n        并且需要直接操作DOM元素，在此不做展示")])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-5-6-1"}},[_c('ul',{staticClass:"list"},[_c('li',[_vm._v("Ada Catlace")]),_vm._v(" "),_c('li',[_vm._v("Alan Purring")]),_vm._v(" "),_c('li',[_vm._v("Schrödingcat")]),_vm._v(" "),_c('li',[_vm._v("Tim Purrners-Lee")]),_vm._v(" "),_c('li',[_vm._v("Webkitty")]),_vm._v(" "),_c('li',[_vm._v("Json")]),_vm._v(" "),_c('li',[_vm._v("Void")]),_vm._v(" "),_c('li',[_vm._v("Neko")]),_vm._v(" "),_c('li',[_vm._v("NaN")]),_vm._v(" "),_c('li',[_vm._v("Cat5")]),_vm._v(" "),_c('li',[_vm._v("Vector")])])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-5-7-1"}},[_c('div',{staticClass:"img-slider"},[_c('div',{staticClass:"slider"},[_c('img',{attrs:{"src":"http://csssecrets.io/images/adamcatlace-before.jpg","alt":"after"}})]),_vm._v(" "),_c('img',{staticClass:"img",attrs:{"src":"http://csssecrets.io/images/adamcatlace.jpg","alt":"now"}})])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_blurDialog_vue__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a6207ab8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_blurDialog_vue__ = __webpack_require__(49);
function injectStyle (ssrContext) {
  __webpack_require__(46)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_blurDialog_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a6207ab8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_blurDialog_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(47);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("0b37109e", content, true);

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, ".navigator{display:none}.content{margin-left:0!important}main{padding:30px}main.deEmphasized{z-index:1;-webkit-filter:blur(3px);filter:blur(3px)}.cover-img{width:500px;margin-left:-80px}button{font-size:20px}.dialog{position:fixed;width:300px;height:250px;top:50%;left:50%;margin:-150px;z-index:2;border:1px solid silver;border-radius:6px;box-shadow:0 .2em .5em rgba(0,0,0,.5),0 0 0 100vmax rgba(0,0,0,.2);background:#fff;display:flex;align-items:center;justify-content:center}.dialog .close-btn{position:absolute;top:10px;right:10px;font-weight:700;cursor:pointer}", ""]);

// exports


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      blurDialogShow: false
    };
  },
  methods: {
    showBlurDialog() {
      this.blurDialogShow = true;
    },
    hideBlurDialog() {
      this.blurDialogShow = false;
    }
  }
});

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content"},[_c('main',{class:{deEmphasized: _vm.blurDialogShow}},[_c('img',{staticClass:"cover-img",attrs:{"src":"https://cloud.githubusercontent.com/assets/1231359/14773652/5bf7c006-0adf-11e6-8712-70be89b3b97d.jpg","alt":"[CSS Secrets 简体中文版 - 封面]"}}),_vm._v(" "),_c('p',[_vm._v("Welocome to this page!")]),_vm._v(" "),_c('button',{on:{"click":_vm.showBlurDialog}},[_vm._v("Show Dialog")]),_c('br')]),_vm._v(" "),(_vm.blurDialogShow)?_c('div',{staticClass:"dialog"},[_c('span',{staticClass:"close-btn",attrs:{"title":"关闭"},on:{"click":_vm.hideBlurDialog}},[_vm._v("X")]),_vm._v("\n    Hello I'am a dialog!"),_c('br'),_vm._v("\n    Enjoy the Blur!\n  ")]):_vm._e()])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_structureAndLayout_vue__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_641581ce_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_structureAndLayout_vue__ = __webpack_require__(58);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_structureAndLayout_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_641581ce_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_structureAndLayout_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data_c6s2table_js__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Palette_vue__ = __webpack_require__(53);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      tables: __WEBPACK_IMPORTED_MODULE_0__data_c6s2table_js__["a" /* default */]
    };
  },
  components: {
    palette: __WEBPACK_IMPORTED_MODULE_1__components_Palette_vue__["a" /* default */]
  }
});

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const tableContent = {
  "table1": [["If we don’t…", "specify a cell width, they will be assigned one that depends on their contents. Notice how the cell with the more content here is much wider."]],
  "table2": [["If we don’t…", "specify a cell width, they will be assigned one that depends on their contents. Notice how the cell with the more content here is much wider."], ["All rows take part in calculating the widths, not just the first one.", "Notice how the dimensions here are different than the previous example."]],
  "table3": [[{
    "content": "If we specify a width, it will not always be followed. I have a width of 1000px",
    "styles": "onethousand" }, {
    "content": "…and I have a width of 2000px. Because there’s not enough space for 3000px, they are reduced proportionally, to 33.3% and 66.6% of the total width.",
    "styles": "threethousand"
  }]],
  "table4": [["If we prevent word wrapping, the table can become so wide it grows beyond its container.", {
    "content": "…and text-overflow: ellipsis doesn’t help either.",
    "styles": "noWrapping"
  }]],
  "table5": [["Large images and blocks of code can also cause the same issue.", { "imgSrc": "http:\/\/lea.verou.me\/book\/panoramic.jpg" }]]
};

/* harmony default export */ __webpack_exports__["a"] = (tableContent);

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Palette_vue__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_213bed08_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Palette_vue__ = __webpack_require__(57);
function injectStyle (ssrContext) {
  __webpack_require__(54)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Palette_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_213bed08_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Palette_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(55);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("787c710e", content, true);

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, ".palette{display:flex;background:#d6e055;height:200px;max-width:900px}.palette li{flex:1}.palette li .color-options{min-height:0;width:auto;margin:0 10px;padding:10px;background:rgba(0,0,0,.7);border-bottom-left-radius:10px;border-bottom-right-radius:10px;overflow:hidden}.palette li .color-options a{cursor:pointer;color:#fff}.palette li .color-options a:hover{text-decoration:none}.palette li .color-options a:before{display:inline-block;text-align:center;height:1.3em;width:1.3em;margin-right:.3em;font-size:16px;line-height:1.3;background:#fff;border-radius:50%}.palette li .color-options a:after{content:\" color\"}.palette li .color-options .add{float:left}.palette li .color-options .add:before{content:\"\\271A\";color:#590}.palette li .color-options .delete{float:right}.palette li .color-options .delete:before{content:\"\\2716\";color:#b00}.palette li:only-child .delete{display:none}.palette li:first-child:nth-last-child(n+4) .color-options a:after,.palette li:first-child:nth-last-child(n+4)~li .color-options a:after{content:none}.palette li:first-child:nth-last-child(n+6) .color-options a,.palette li:first-child:nth-last-child(n+6)~li .color-options a{font-size:0;color:transparent}", ""]);

// exports


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      colors: ['#D6E055', '#082323', '#E6E2AF', '#A7A37E', '#EFECCA', '#046380', '#1C171D', '#FEE169', '#CDD452', '#F9722E', '#C9313D', '#2E95A3', '#50B8B4', '#C6FFFA', '#E2FFA8'],
      palette: ['#D6E055']
    };
  },
  methods: {
    addColor() {
      let mycolor = this.colors.pop();
      this.palette.push(mycolor);
      this.colors.unshift(mycolor);
    },
    deleteColor(index) {
      if (this.palette.length > 1) {
        this.palette.splice(index, 1);
      }
    }
  }
});

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ul',{staticClass:"palette"},_vm._l((_vm.palette),function(color,index){return _c('li',{style:({background: color})},[_c('div',{staticClass:"color-options"},[_c('a',{staticClass:"add",on:{"click":_vm.addColor}},[_vm._v("Add")]),_vm._v(" "),_c('a',{staticClass:"delete",on:{"click":function($event){_vm.deleteColor(index)}}},[_vm._v("Delete")])])])}))}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content"},[_c('section',{staticClass:"c-chapter",attrs:{"id":"c-6"}},[_c('h2',[_vm._v(_vm._s(_vm.$t("lang.directory[5].chapter")))]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-6-1"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[5].sections[0]")))]),_vm._v(" "),_vm._m(0,false,false),_vm._v(" "),_c('code',[_vm._v("\n        figure {\n        \tmax-width: 300px;\n        \tmax-width: min-content;\n        \tmargin: auto;\n        }\n\n        figure > img { max-width: inherit }\n      ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-6-2"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[5].sections[1]")))]),_vm._v(" "),_c('div',{attrs:{"id":"eg-6-2-1"}},[_c('h4',[_vm._v("With table-layout: auto")]),_vm._v(" "),_vm._l((_vm.tables),function(table){return _c('table',[_c('tbody',_vm._l((table),function(tr){return _c('tr',[_vm._l((tr),function(td){return (!td.hasOwnProperty('styles'))?_c('td',[(td.hasOwnProperty('imgSrc'))?_c('img',{attrs:{"src":td.imgSrc,"alt":"pics"}}):_c('span',[_vm._v(_vm._s(td))])]):_vm._e()}),_vm._v(" "),_vm._l((tr),function(td){return (td.hasOwnProperty('styles'))?_c('td',{class:td.styles},[_vm._v(_vm._s(td.content))]):_vm._e()})],2)}))])}),_vm._v(" "),_vm._m(1,false,false),_vm._v(" "),_c('h4',[_vm._v("With table-layout: fixed")]),_vm._v(" "),_vm._l((_vm.tables),function(table){return _c('table',{staticClass:"fixed"},[_c('tbody',_vm._l((table),function(tr){return _c('tr',[_vm._l((tr),function(td){return (!td.hasOwnProperty('styles'))?_c('td',[(td.hasOwnProperty('imgSrc'))?_c('img',{attrs:{"src":td.imgSrc,"alt":"pics"}}):_c('span',[_vm._v(_vm._s(td))])]):_vm._e()}),_vm._v(" "),_vm._l((tr),function(td){return (td.hasOwnProperty('styles'))?_c('td',{class:td.styles},[_vm._v(_vm._s(td.content))]):_vm._e()})],2)}))])}),_vm._v(" "),_c('code',[_vm._v("\n          table-layout: fixed")]),_vm._v(" "),_vm._m(2,false,false)],2)]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-6-3"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[5].sections[2]")))]),_vm._v(" "),_c('h4',[_vm._v("select the first of a certain number of list")]),_vm._v(" "),_vm._m(3,false,false),_vm._v(" "),_c('p',[_vm._v("Here we use less to make our code become less verbose")]),_vm._v(" "),_c('code',[_vm._v("\n        .nItems(@n,@content){\n          &:first-child:nth-last-child(@{n}),\n          &:first-child:nth-last-child(@{n}) ~ & {\n            @content();\n          }\n        }\n\n        .nItems(4,{\n            content...\n        });\n\n        .nItems(6,{\n            content...\n        });\n      ")]),_vm._v(" "),_c('p',[_vm._v("Here the first items of lists which have 4 and 6 items are given different styles.")]),_vm._v(" "),_c('p',[_vm._v("这里有4项和6项的列表的首相有不同的样式。")]),_vm._v(" "),_c('h4',[_vm._v("select a range of a certain number of list")]),_vm._v(" "),_vm._m(4,false,false),_vm._v(" "),_c('p',[_vm._v("the Example above")]),_vm._v(" "),_c('p',[_vm._v("lists which contains at most 4 items have yellow border.")]),_vm._v(" "),_c('p',[_vm._v("不超过4项的列表有黄色边框。")]),_vm._v(" "),_c('p',[_vm._v("lists which contains at least 4 items have a green background.")]),_vm._v(" "),_c('p',[_vm._v("超过4项的有绿色背景")]),_vm._v(" "),_c('p',[_vm._v("lists which contains 2-6 items have a check at the top-right corner.")]),_vm._v(" "),_c('p',[_vm._v("项目数在2-6之间的有check标记。")]),_vm._v(" "),_c('h4',[_vm._v("An Example from the book, using js to style sibling items.")]),_vm._v(" "),_c('div',{attrs:{"id":"eg-6-3-3"}},[_c('palette')],1),_vm._v(" "),_c('p',[_vm._v("Here we only list related code")]),_vm._v(" "),_c('code',[_vm._v("\n        /* Hide \"color\" 4 items or more */\n        /* 隐藏 \"color\" 字符 当有4项或以上时 */\n        .palette li:first-child:nth-last-child(n+4) .color-options a:after,\n        .palette li:first-child:nth-last-child(n+4) ~ li .color-options a:after {\n        \tcontent: none;\n        }\n\n        /* Hide word when 6 items or more */\n        /* 隐藏文字，当有6项或更多时 */\n        .palette li:first-child:nth-last-child(n+6) .color-options a,\n        .palette li:first-child:nth-last-child(n+6) ~ li .color-options a {\n        \tcolor: transparent;\n        \tfont-size: 0;\n        }\n\n        /* Hide “delete” button when only 1 items contained */\n        /* 隐藏删除按钮，只有一项时*/\n        .palette li:only-child .delete {\n        \tdisplay:none;\n        }\n      ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-6-4"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[5].sections[3]")))]),_vm._v(" "),_c('router-link',{attrs:{"to":{ path: '/fluidBg' },"target":"_blank"}},[_vm._v("查看示例")]),_vm._v(" "),_c('p',[_vm._v("展示页面布局的单开一页。")]),_vm._v(" "),_vm._m(5,false,false),_vm._v(" "),_c('code',[_vm._v("\n        max-width: 900px;\n        padding: 1em calc(50% - 450px);\n      ")])],1),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-6-5"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[5].sections[4]")))]),_vm._v(" "),_c('h4',[_vm._v("The absolute positioning solution")]),_vm._v(" "),_c('router-link',{attrs:{"to":{ path: '/verticalCenter/' + 'absPos1'},"target":"_blank"}},[_vm._v(" 点击查看例子，运用 cal()")]),_vm._v(" "),_c('code',[_vm._v("\n        .main1{\n          position: absolute;\n          top: calc(~\"50% - 3em\");\n          left: calc(~\"50% - 6em\");\n          width: 12em;\n          height: 6em;\n        }\n      ")]),_vm._v(" "),_c('router-link',{attrs:{"to":{ path: '/verticalCenter/' + 'absPos2' },"target":"_blank"}},[_vm._v("点击查看例子，运用 translate")]),_vm._v(" "),_c('code',[_vm._v("\n        .main2{\n          position: absolute;\n          top: 50%;\n          left: 50%;\n          transform: translate(-50%, -50%);\n        }\n      ")]),_vm._v(" "),_c('h4',[_vm._v("The viewport unit solution")]),_vm._v(" "),_c('router-link',{attrs:{"to":{ path: '/verticalCenter/' + 'viewport' },"target":"_blank"}},[_vm._v("点击查看运用 viewpoint 的例子")]),_vm._v(" "),_c('code',[_vm._v("\n        .main3{\n          width: 12em;\n          margin: 50vh auto 0;\n          transform: translateY(-50%);\n        }\n      ")]),_vm._v(" "),_c('h4',[_vm._v("The Flexbox solution ")]),_vm._v(" "),_c('router-link',{attrs:{"to":{ path: '/verticalCenter/' + 'flexbox1' },"target":"_blank"}},[_vm._v("点击查看运用 flexbox 的例子")]),_vm._v(" "),_c('code',[_vm._v("\n        .main4{\n          display: flex;\n          justify-content: center;\n          align-items: center;\n          width: 12em;\n          margin: auto;\n        }\n        .bodyForFlex{\n          display: flex;\n        }\n      ")]),_vm._v(" "),_c('router-link',{attrs:{"to":{ path: '/verticalCenter/' + 'flexbox2' },"target":"_blank"}},[_vm._v("我觉得这样写更好～～A better flexbox solution I think")]),_vm._v(" "),_c('code',[_vm._v("\n        .main5{\n          width: 12em;\n        }\n        .myFlexBody{\n          display: flex;\n          justify-content: center;\n          align-items: center;\n        }\n      ")])],1),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-6-6"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[5].sections[5]")))]),_vm._v(" "),_c('router-link',{attrs:{"to":{ path: '/stickyFooter/' },"target":"_blank"}},[_vm._v("查看示例")])],1)])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-6-1-1"}},[_c('p',[_vm._v("Enjoy playing with this little kitty! Look at its tiny claws,its bright eys,pointed ears,and soft belly!")]),_vm._v(" "),_c('figure',{staticClass:"figure"},[_c('img',{staticClass:"img",attrs:{"src":"http://csssecrets.io/images/adamcatlace-before.jpg","alt":"kitty"}}),_vm._v(" "),_c('figcaption',[_vm._v("Enjoy playing with this little kitty! Look at its tiny claws,its bright eys,pointed ears,and soft belly!")])]),_vm._v(" "),_c('p',[_vm._v("Enjoy playing with this little kitty! Look at its tiny claws,its bright eys,pointed ears,and soft belly!")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ul',{staticClass:"explanation"},[_c('li',[_vm._v("如果没有设置单元格宽度，宽度将会随着内容而分配。宽的单元格也较宽")]),_vm._v(" "),_c('li',[_vm._v("所有的行都会参与计算")]),_vm._v(" "),_c('li',[_vm._v("当给两个单元格分别 1000px 和 2000px 的宽度，由于表格没有这么宽，表格最终的宽会按比例减少，分别变为33.3%和66.6%")]),_vm._v(" "),_c('li',[_vm._v("阻止自动换行 text-overflow: ellipsis 失效")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',[_vm._v("如果想看表格到底多么长，可以审查元素将，content 的 "),_c('code',{staticClass:"inline"},[_vm._v("overflow：hideden")]),_vm._v("去掉")])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-6-3-1"}},[_c('ul',{staticClass:"list first"},[_c('li',[_vm._v("1")]),_vm._v(" "),_c('li',[_vm._v("2")]),_vm._v(" "),_c('li',[_vm._v("3")])]),_vm._v(" "),_c('ul',{staticClass:"list first"},[_c('li',[_vm._v("1")]),_vm._v(" "),_c('li',[_vm._v("2")]),_vm._v(" "),_c('li',[_vm._v("3")]),_vm._v(" "),_c('li',[_vm._v("4")])]),_vm._v(" "),_c('ul',{staticClass:"list first"},[_c('li',[_vm._v("1")]),_vm._v(" "),_c('li',[_vm._v("2")]),_vm._v(" "),_c('li',[_vm._v("3")]),_vm._v(" "),_c('li',[_vm._v("4")]),_vm._v(" "),_c('li',[_vm._v("5")]),_vm._v(" "),_c('li',[_vm._v("6")])])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-6-3-2"}},[_c('ul',{staticClass:"list second"},[_c('li',[_vm._v("1")]),_vm._v(" "),_c('li',[_vm._v("2")]),_vm._v(" "),_c('li',[_vm._v("3")])]),_vm._v(" "),_c('ul',{staticClass:"list second"},[_c('li',[_vm._v("1")]),_vm._v(" "),_c('li',[_vm._v("2")]),_vm._v(" "),_c('li',[_vm._v("3")]),_vm._v(" "),_c('li',[_vm._v("4")])]),_vm._v(" "),_c('ul',{staticClass:"list second"},[_c('li',[_vm._v("1")]),_vm._v(" "),_c('li',[_vm._v("2")]),_vm._v(" "),_c('li',[_vm._v("3")]),_vm._v(" "),_c('li',[_vm._v("4")]),_vm._v(" "),_c('li',[_vm._v("5")])]),_vm._v(" "),_c('ul',{staticClass:"list second"},[_c('li',[_vm._v("1")]),_vm._v(" "),_c('li',[_vm._v("2")]),_vm._v(" "),_c('li',[_vm._v("3")]),_vm._v(" "),_c('li',[_vm._v("4")]),_vm._v(" "),_c('li',[_vm._v("5")]),_vm._v(" "),_c('li',[_vm._v("6")])]),_vm._v(" "),_c('ul',{staticClass:"list second"},[_c('li',[_vm._v("1")]),_vm._v(" "),_c('li',[_vm._v("2")]),_vm._v(" "),_c('li',[_vm._v("3")]),_vm._v(" "),_c('li',[_vm._v("4")]),_vm._v(" "),_c('li',[_vm._v("5")]),_vm._v(" "),_c('li',[_vm._v("6")]),_vm._v(" "),_c('li',[_vm._v("7")])])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',[_vm._v("这里想要表达的是，之前对于这样的布局通常是在外层元素内包裹一层元素，设置宽度，并给予\n        "),_c('code',{staticClass:"inline"},[_vm._v("margin: auto")]),_vm._v("，为了让我们的 code 更加 dry，省去包裹元素的做法，就是给外层元素一个计算的padding")])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fluidBg_vue__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_69459e02_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_fluidBg_vue__ = __webpack_require__(63);
function injectStyle (ssrContext) {
  __webpack_require__(60)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fluidBg_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_69459e02_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_fluidBg_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(61);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("aece42d2", content, true);

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, ".navigator{display:none}.content{margin-left:0!important;padding:0!important}footer,header,section{padding:1em calc(50% - 350px)}footer{background:#333;color:#fff}header{background:#9acd32}header h1{color:#fff;opacity:1}section+section{background:#eee}", ""]);

// exports


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({});

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _vm._m(0,false,false)}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content"},[_c('header',[_c('h1',[_vm._v("Fluid background"),_c('br'),_vm._v("\n      fixed content\n    ")])]),_vm._v(" "),_c('section',[_c('h2',[_vm._v("Heading")]),_vm._v(" "),_c('p',[_vm._v("Bacon ipsum dolor amet voluptate et shoulder, ipsum flank tongue exercitation commodo sed beef ribs drumstick in venison laborum. Laboris ut enim id drumstick, et aute esse. Consequat ad kielbasa anim pork loin turkey qui cupidatat drumstick doner labore. Nulla sirloin jerky do sed magna meatloaf. Ribeye ea ut elit leberkas laboris sausage corned beef drumstick cillum non.")])]),_vm._v(" "),_c('section',[_c('h2',[_vm._v("Another heading")]),_vm._v(" "),_c('p',[_vm._v("Nostrud landjaeger cillum beef cow tail cupidatat non mollit voluptate jowl. Enim sunt in, flank hamburger proident qui. Id aute excepteur chuck magna tempor ipsum pork chop t-bone. Frankfurter meatball pork loin beef et leberkas pork. Pig ball tip pancetta in.")]),_vm._v(" "),_c('p',[_vm._v("Ribeye in veniam ipsum flank. Elit incididunt t-bone proident meatball. Porchetta exercitation prosciutto sausage chuck ut eu brisket shank pastrami turkey sunt laboris tenderloin anim. Landjaeger do venison laboris kevin.")])]),_vm._v(" "),_c('footer',[_c('p',[_vm._v("Consectetur et t-bone pork loin. Tri-tip cupim in, spare ribs velit exercitation in. Tempor cillum fugiat, nisi leberkas reprehenderit anim laboris proident cow. Eu fatback kevin sint, ad shoulder in venison picanha. Sausage drumstick capicola, culpa boudin pork belly minim aute ipsum biltong picanha venison nulla adipisicing.")])])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_verticalCenter_vue__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_dfbd49b6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_verticalCenter_vue__ = __webpack_require__(68);
function injectStyle (ssrContext) {
  __webpack_require__(65)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_verticalCenter_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_dfbd49b6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_verticalCenter_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(66);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("92b44910", content, true);

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, ".navigator{display:none}.content{margin-left:0!important;padding:0!important}.simulateBody{width:100%;height:100%;background-color:#d6e055}.bodyForFlex,.myFlexBody{display:flex}.myFlexBody{justify-content:center;align-items:center}.main{background:#666;font-size:150%;padding:15px;color:#fff;text-align:center}.main1{top:calc(50% - 3em);left:calc(50% - 6em);width:12em;height:6em}.main1,.main2{position:absolute}.main2{top:50%;left:50%;transform:translate(-50%,-50%)}.main3{width:12em;margin:50vh auto 0;transform:translateY(-50%)}.main4{display:flex;justify-content:center;align-items:center;margin:auto}.main4,.main5{width:12em}", ""]);

// exports


/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      id: this.$route.params.id,
      shareText: 'I am centered! Vertical centered! Horizonal centered!'
    };
  }
});

/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content simulateBody",class:[{bodyForFlex: _vm.id ==='flexbox1'},{myFlexBody: _vm.id === 'flexbox2'}]},[(_vm.id === 'absPos1' )?_c('div',{staticClass:"main main1"},[_vm._v("\n    "+_vm._s(_vm.shareText)+"\n  ")]):_vm._e(),_vm._v(" "),(_vm.id === 'absPos2' )?_c('div',{staticClass:"main main2"},[_vm._v("\n    "+_vm._s(_vm.shareText)+"\n  ")]):_vm._e(),_vm._v(" "),(_vm.id === 'viewport')?_c('div',{staticClass:"main main3"},[_vm._v("\n    "+_vm._s(_vm.shareText)+"\n  ")]):_vm._e(),_vm._v(" "),(_vm.id === 'flexbox1')?_c('div',{staticClass:"main main4"},[_vm._v("\n    "+_vm._s(_vm.shareText)+"\n  ")]):_vm._e(),_vm._v(" "),(_vm.id === 'flexbox2')?_c('div',{staticClass:"main main5"},[_vm._v("\n    "+_vm._s(_vm.shareText)+"\n  ")]):_vm._e()])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stickyFooter_vue__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8c94b33c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_stickyFooter_vue__ = __webpack_require__(73);
function injectStyle (ssrContext) {
  __webpack_require__(70)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stickyFooter_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8c94b33c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_stickyFooter_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(71);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("26b15156", content, true);

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, ".navigator{display:none}.content{margin-left:0!important;padding:0!important}.simulateBody{display:flex;min-height:100vh;flex-direction:column}header{background-color:#d6e055;text-align:center}header h1{color:#fff}main{flex:1;padding:.5em calc(50% - 400px);font-size:18px}a{cursor:pointer}footer{background:#333;color:#fff;padding:.5em calc(50% - 400px)}", ""]);

// exports


/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      para1: "Lincoln University (Māori: Te Whare Wanaka o Aoraki) is a New Zealand university that was formed in 1990 when Lincoln College, Canterbury was made independent of the University of Canterbury. Its undergraduate study areas include agriculture, commerce, computing, engineering, environment, food, forestry, horticulture, hospitality, landscape, Māori planning, property, recreation, sciences, transport and winemaking.",
      para2: "Lincoln University has a student population from more than 60 countries.[4] Its primary campus is situated on 50 hectares (123 acres) of land located about 15 km (9 mi) outside the city of Christchurch in Lincoln, Canterbury.",
      para3: "Lincoln University began life in 1878 as a School of Agriculture. From 1896 to 1961 it served students under the name \"Canterbury Agricultural College\", and offered qualifications of the University of New Zealand until that institution's demise. From 1961 to 1990, it was known as Lincoln College, a constituent college of the University of Canterbury, until achieving autonomy in 1990 as Lincoln University.[6] It is the oldest agricultural teaching institution in the Southern Hemisphere. It remains the smallest university in New Zealand and one of the 8 government universities.[7] The University is a member of the Euroleague for Life Sciences.",
      showPara: false,
      toggleText: "Show All Text"
    };
  },
  methods: {
    showToggle() {
      this.showPara = !this.showPara;
      this.toggleText = this.showPara ? "Hide the rest" : "Show All Text";
    }
  }
});

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content simulateBody"},[_vm._m(0,false,false),_vm._v(" "),_c('main',[_c('p',[_vm._v(_vm._s(_vm.para1))]),_vm._v(" "),_c('p',[_vm._v(_vm._s(_vm.para2))]),_vm._v(" "),_c('p',[_c('a',{on:{"click":_vm.showToggle}},[_vm._v(_vm._s(_vm.toggleText))])]),_vm._v(" "),(_vm.showPara)?_c('p',[_vm._v(_vm._s(_vm.para3))]):_vm._e()]),_vm._v(" "),_vm._m(1,false,false)])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('header',[_c('h1',[_vm._v("Welcome to the Sticky Footer Page!")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('footer',[_c('p',[_vm._v("© 2017 No rights reserved.")]),_vm._v(" "),_c('p',[_vm._v("Made with ♥ by an anonymous coder.")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_transitionsAndAnimations_vue__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_635c0b74_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_transitionsAndAnimations_vue__ = __webpack_require__(76);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_transitionsAndAnimations_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_635c0b74_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_transitionsAndAnimations_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {
      typingText: 'CSS is awesome!',
      typingStyles: {}
    };
  },
  created() {
    let length = this.typingText.length;
    let styles = {
      width: length + 'ch',
      animationTimingFunction: "steps(" + length + "),steps(1)",
      animationDuration: length / 2 + "s, 1s"
    };
    this.typingStyles = styles;
  }
});

/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content"},[_c('section',{staticClass:"c-chapter",attrs:{"id":"c-7"}},[_c('h2',[_vm._v(_vm._s(_vm.$t("lang.directory[6].chapter")))]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-7-1"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[6].sections[0]")))]),_vm._v(" "),_c('h4',[_vm._v("Bouncing Animations")]),_vm._v(" "),_vm._m(0,false,false),_vm._v(" "),_c('code',[_vm._v("\n        @keyframes bounce {\n          60%, 80%, to {\n        \t\ttransform: translateY(280px);\n        \t\tanimation-timing-function: ease;\n        \t}\n        \t70% { transform: translateY(210px); }\n        \t90% { transform: translateY(250px); }\n        }\n        .ball{\n          animation: bounce 1.5s cubic-bezier(.1,.25,1,.25) forwards;\n        }\n      ")]),_vm._v(" "),_c('h4',[_vm._v("Elastic tranistions")]),_vm._v(" "),_vm._m(1,false,false),_vm._v(" "),_c('code',[_vm._v("\n        input:not(:focus) + .callout:not(:hover){\n          transform: scale(0);\n          transition: .25s transform;\n        }\n        .callout{\n          transition: .5s cubic-bezier(.25,.1,.3,1.5) transform;\n          transform-origin: 1em -.4em;\n        }\n      }\n      ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-7-2"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[6].sections[1]")))]),_vm._v(" "),_vm._m(2,false,false),_vm._v(" "),_c('code',[_vm._v("\n        @keyframes loader {\n          to {\n            background-position: -800px 0;\n          }\n        }\n\n        .loader{\n          animation: loader 1s infinite steps(8);\n        }\n      ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-7-3"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[6].sections[2]")))]),_vm._v(" "),_vm._m(3,false,false),_vm._v(" "),_c('code',[_vm._v("\n        @keyframes blink-1 {\n          50% {\n            color: transparent;\n          };\n        }\n\n        @keyframes blink-2 {\n          to {\n            color: transparent;\n          }\n        }\n\n        .blink-smooth-1{\n          animation: blink-1 1s 3;\n        }\n        .blink-smooth-2{\n          animation: blink-2 .5s 6;\n          animation-direction: alternate;\n        }\n        .blink{\n          animation: 1s blink-1 3 steps(1);\n        }\n      ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-7-4"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[6].sections[3]")))]),_vm._v(" "),_c('div',{attrs:{"id":"eg-7-4-1"}},[_c('h1',{style:(_vm.typingStyles)},[_vm._v(_vm._s(_vm.typingText))])]),_vm._v(" "),_c('code',[_vm._v("\n        @keyframes typing {\n          from{\n            width: 0;\n          }\n        }\n\n        @keyframes caret {\n          50% {\n            border-right-color: transparent;\n          }\n        }\n\n        h1{\n          overflow: hidden;\n          border-right: .05em solid;\n          white-space: nowrap;\n          width: 15ch;\n          animation: typing 8s steps(15),caret 1s steps(1) infinite;\n        }\n      ")]),_vm._v(" "),_c('p',[_vm._v("If use js to calculate the animation params, the effect would be better.")]),_vm._v(" "),_c('p',[_vm._v("Since I use vue in the whole project, the js code will not be displayed here! You can find it in the source code!")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-7-5"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[6].sections[4]")))]),_vm._v(" "),_c('div',{attrs:{"id":"eg-7-5-1"}}),_vm._v(" "),_c('code',[_vm._v("\n        @keyframes panoramic {\n          to {\n            background-position: 100% 0;\n          }\n        }\n\n        #eg-7-5-1{\n          background-image: url('http://lea.verou.me/book/panoramic.jpg');\n          height: 300px;\n          width: 300px;\n          background-size: auto 100%;\n          animation: panoramic 10s linear infinite alternate;\n          animation-play-state: paused;\n          &:hover,&:focus{\n            animation-play-state: running;\n          }\n        }\n      ")])]),_vm._v(" "),_c('section',{staticClass:"c-section",attrs:{"id":"c-7-6"}},[_c('h3',[_vm._v(_vm._s(_vm.$t("lang.directory[6].sections[5]")))]),_vm._v(" "),_c('h4',[_vm._v("Two element solution")]),_vm._v(" "),_vm._m(4,false,false),_vm._v(" "),_c('code',[_vm._v("\n        @keyframes spin {\n          to{\n            transform: rotate(1turn);\n          }\n        }\n        .avatar{\n          animation: spin 8s linear infinite;\n          transform-origin: 50% 180px;\n        }\n        .avatar > img{\n          animation: inherit;\n          animation-direction: reverse;\n        }\n      ")]),_vm._v(" "),_c('h4',[_vm._v("Single element solution")]),_vm._v(" "),_vm._m(5,false,false),_vm._v(" "),_c('code',[_vm._v("\n        @keyframes spin-2 {\n          from {\n            transform: rotate(0turn) translateY(-180px) translateY(50%) rotate(1turn);\n          }\n          to {\n            transform: rotate(1turn) translateY(-180px) translateY(50%) rotate(0turn);\n          }\n        }\n\n        .avatar{\n          margin: calc(~\"50% - 30px\") auto 0;\n          animation: spin-2 8s linear infinite;\n        }\n      ")])])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-7-1-1"}},[_c('div',{staticClass:"ball"})])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-7-1-2"}},[_c('label',[_c('input',{attrs:{"type":"text","value":"NoOne"}}),_vm._v(" "),_c('span',{staticClass:"callout"},[_vm._v("Only letters, numbers, underscores (_) and hyphens (-) allowed!")])])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-7-2-1"}},[_c('div',{staticClass:"loader"})])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-7-3-1"}},[_c('p',{staticClass:"blink-smooth-1"},[_vm._v("Pokemon!")]),_vm._v(" "),_c('p',{staticClass:"blink-smooth-2"},[_vm._v("Pokemon!")]),_vm._v(" "),_c('p',{staticClass:"blink"},[_vm._v("Pokemon!")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-7-6-1"}},[_c('div',{staticClass:"path"},[_c('div',{staticClass:"avatar"},[_c('img',{attrs:{"src":"http://csssecrets.io/images/adamcatlace.jpg","alt":"avatar"}})])])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"eg-7-6-2"}},[_c('div',{staticClass:"path"},[_c('img',{staticClass:"avatar",attrs:{"src":"http://csssecrets.io/images/adamcatlace.jpg","alt":"avatar"}})])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition;
  } else {
    const position = {};
    if (to.hash) {
      position.selector = to.hash;
    }
    if (to.matched.some(m => m.meta.scrollToTop)) {
      position.x = 0;
      position.y = 0;
    }
    return position;
  }
};

/* harmony default export */ __webpack_exports__["a"] = (scrollBehavior);

/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_i18n__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_directory_js__ = __webpack_require__(79);





__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vue_i18n__["a" /* default */]);

const messages = {
  en: {
    lang: {
      directory: __WEBPACK_IMPORTED_MODULE_2__data_directory_js__["a" /* default */].en,
      bookTitle: 'CSS Secrets Demos'
    }
  },
  cn: {
    lang: {
      directory: __WEBPACK_IMPORTED_MODULE_2__data_directory_js__["a" /* default */].cn,
      bookTitle: 'CSS 揭秘示例集'
    }
  }
};

const i18n = new __WEBPACK_IMPORTED_MODULE_1_vue_i18n__["a" /* default */]({
  locale: "en",
  messages
});

/* harmony default export */ __webpack_exports__["a"] = (i18n);

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const directory = {
  "en": [{
    "chapter": "Backgrounds & Borders",
    "componentName": "bgAndBorders",
    "sections": ["Translucent borders", "Multiple borders", "Flexible background positioning", "Inner rounding", "Striped backgrounds", "Complex background patterns", "Continuous image borders"]
  }, {
    "chapter": "Shapes",
    "componentName": "shapes",
    "sections": ["Flexible ellipses", "Parallelograms", "Diamond images", "Cutout corners", "Trapezoid tabs", "Simple pie charts"]
  }, {
    "chapter": "Visual Effects",
    "componentName": "visualEffects",
    "sections": ["One-sided shadows", "Irregular drop shadows", "Color tinting", "Frosted glass effec", "Folded corner effect"]
  }, {
    "chapter": "Typography",
    "componentName": "typography",
    "sections": ["Hyphenation", "Inserting line breaks", "Zebra-striped text lines", "Adjusting tab width", "Ligatures", "Fancy ampersands", "Custom underlines", "Realistic text effects", "Circular text"]
  }, {
    "chapter": "User Experience",
    "componentName": "userExperience",
    "sections": ["Picking the right cursor", "Extending the clickable area", "Custom checkboxes", "De-emphasize by dimming", "De-emphasize by blurring", "Scrolling hints", "Interactive image comparison"]
  }, {
    "chapter": "Structure & Layout",
    "componentName": "structureAndLayout",
    "sections": ["Intrinsic sizing", "Taming table column widths", "Styling by sibling count", "Fluid background, fixed content", "Vertical centering", "Sticky footers"]
  }, {
    "chapter": "Transitions & Animations",
    "componentName": "transitionsAndAnimations",
    "sections": ["Elastic transitions", "Frame-by-frame animations", "Blinking", "Typing animation", "Smooth state animations", "Animation along a circular path"]
  }],
  "cn": [{
    "chapter": "背景与边框",
    "componentName": "bgAndBorders",
    "sections": ["半透明边框", "多重边框", "灵活的背景定位", "边框内圆角", "条纹背景", "复杂的背景图案", "连续的图像边框"]
  }, {
    "chapter": "形状",
    "componentName": "shapes",
    "sections": ["自适应的椭圆", "平行四边形", "菱形图片", "切角效果", "梯形标签页", "简单的饼图"]
  }, {
    "chapter": "视觉效果",
    "componentName": "visualEffects",
    "sections": ["单侧投影", "不规则投影", "染色效果", "毛玻璃效果", "折角效果"]
  }, {
    "chapter": "字体排印",
    "componentName": "typography",
    "sections": ["连字符断行", "插入换行", "文本行的斑马条纹", "调整 Tab 的宽度", "连字", "华丽的 & 符号", "自定义下划线", "现实中的文字效果", "环形文字"]
  }, {
    "chapter": "用户体验",
    "componentName": "userExperience",
    "sections": ["选用合适的鼠标光标", "扩大可点击区域", "自定义复选框", "通过阴影来弱化背景", "通过模糊来弱化背景", "滚动提示", "交互式的图片对比控件"]
  }, {
    "chapter": "结构与布局",
    "componentName": "structureAndLayout",
    "sections": ["自适应内部元素", "精确控制表格列宽", "根据兄弟元素的数量来设置样式", "满幅的背景、定宽的内容", "垂直居中", "紧贴底部的页脚"]
  }, {
    "chapter": "过渡与动画",
    "componentName": "transitionsAndAnimations",
    "sections": ["缓动效果", "逐帧动画", "闪烁效果", "打字动画", "状态平滑的动画", "沿环形路径平移的动画"]
  }]
};

/* harmony default export */ __webpack_exports__["a"] = (directory);

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router_routermaps__ = __webpack_require__(9);



const gaSettings = {
  id: 'UA-111721364-1',
  routes: __WEBPACK_IMPORTED_MODULE_0__router_routermaps__["a" /* default */],
  autoTracking: {
    pageviewTemplate(route) {
      return {
        page: route.path,
        title: document.title,
        location: window.location.href
      };
    }
  }
};

/* harmony default export */ __webpack_exports__["a"] = (gaSettings);

/***/ }),
/* 81 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);