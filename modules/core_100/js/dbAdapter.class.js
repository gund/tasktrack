/**
 * @author Alex Malkevich
 * @project tasktrack
 * @file dbAdapter.class.js
 * @package js
 * @date 13.11.2013 15:08:12
 * @id $js-2013-dbAdapter.class.js$
 *
 * window.class.js - DataBase Class v.1.0.0
 */

function DB_Adapter(settings) {
    var self = this;
    var dfd = $.Deferred();
    this.dbName = (settings.name !== "") ? settings.name : "DataBase";
    this.db = $.indexedDB(this.dbName, {
        "schema": {
            "1": function (vt) {
                var projectList = vt.createObjectStore("projectList", {
                    "autoIncrement": true,
                    "keyPath": "id"
                });
                projectList.createIndex("name");
                projectList.createIndex("status");
            },
            "2": function (vt) {
                var taskList = vt.createObjectStore("taskList", {
                    "autoIncrement": true,
                    "keyPath": "id"
                });
                taskList.createIndex("name");
                taskList.createIndex("projectId");
                taskList.createIndex("status");
            },
            "3": function (vt) {
                vt.createObjectStore("settings");
            }
        }
    });
    this.db.then(function (db) {
        Utils.log("Connected to Indexed DB " + settings.name + "! Version: " + db.version);
        dfd.resolve(self);
    }, function () {
        Utils.log("Cannot create Indexed DB " + settings.name);
        dfd.reject();
        throw new Error("Cannot create Indexed DB_Adapter!");
    }, function () {
        Utils.log("Creating Indexed DB_Adapter...");
        dfd.notify();
    });

    return dfd.promise();
}

// Database Constants
const DB_DELETED = 0;
const DB_NORMAL = 1;
const DB_MODIFIED = 2;
const DB_NEW = 3;
const DB_ALL = [DB_NORMAL, DB_NEW];

// Database Vars
DB_Adapter.prototype.version = "1.0.0";
DB_Adapter.prototype.dbName = "";
DB_Adapter.prototype.dbReady = false;
DB_Adapter.prototype.db = null;