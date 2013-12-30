/**
 * @author Alex Malkevich
 * @project tasktrack
 * @file core.class.js
 * @package js
 * @date 13.11.2013 15:04:12
 * @id $js-2013-core.class.js$
 *
 * window.class.js - Core Class v.1.0.0
 */

function TaskTrackCore(settings) {
    var self = this;
    var dfd = $.Deferred();
    this.dbInit = new DB_Adapter({
        name: "TaskTrack DB"
    });
    // Wait for DB
    this.dbInit.done(function (dbAdapter) {
        self.dbAdapter = dbAdapter;
        self.initialize(dfd);
    }).fail(function () {
            throw new Error("Cannot connect to inDB!");
        }).progress(function () {
            Utils.log("Waiting for inDB...");
        });
    return dfd.promise();
}

// TaskTrackCore Constants
const TT_PROJECTS = [1, "projectList"];
const TT_TASKS = [2, "taskList"];
const TASK_PAUSED = 0;
const TASK_ACTIVE = 1;
// TaskTrackCore Vars
TaskTrackCore.prototype.version = "1.0.0";
TaskTrackCore.prototype.dbAdapter;
TaskTrackCore.prototype.db;
TaskTrackCore.prototype.projectList = [];
TaskTrackCore.prototype.taskList = [];

TaskTrackCore.prototype.isConnected = false;

/* TaskTrackCore Methods */

TaskTrackCore.prototype.initialize = function (dfd) {
    var self = this;
    this.db = this.dbAdapter.db;
    this.initSettings();
    $.when(this.clearTableListCache(TT_PROJECTS), this.clearTableListCache(TT_TASKS)).done(function () {
        dfd.resolveWith(self);
    }).fail(function () {
            dfd.reject();
        });
};

TaskTrackCore.prototype.initSettings = function () {
    Utils.log("Init App Settings");
    var db = this.db, self = this;
    db.objectStore("settings").count().done(function (count) {
        if (count === 0) {
            // Add new row
            db.objectStore("settings").add({
                login: null,
                password: null
            }, 1);
            // Open Settings window
            sWindow.wnd.show();
        } else {
            db.objectStore("settings").get(1).done(function (item) {
                if (item.login === null || item.password === null) {
                    // Open Settings window
                    sWindow.wnd.show();
                } else {
                    $('#settings-login').val(item.login);
                    $('#settings-pass').val(item.password);
                    self.checkLogin();
                }
            });
        }
    });
};

TaskTrackCore.prototype.checkLogin = function () {
    //TODO Check login&password via Ajax and set isConnected true|false
};

TaskTrackCore.prototype.clearTableListCache = function (table) {
    var self = this;
    var dfd = this.getTableList(table[1]);
    dfd.done(function (tableList) {
        switch (table) {
            case TT_PROJECTS:
                self.projectList = tableList;
                break;
            case TT_TASKS:
                self.taskList = tableList;
                break;
        }
    }).fail(function () {
            throw new Error("Failed to get data from inDB!");
            dfd2.reject();
        });
    return dfd;
};

TaskTrackCore.prototype.getTableList = function (tableName) {
    var dfd = $.Deferred();
    var self = this;
    var tableList = {count: 0, list: []};
    this.db.objectStore(tableName).index("status").count().done(function (count) {
        if (count > 0) {
            tableList.count = count;
            var activeCount = 0;
            self.db.objectStore(tableName).index("status").each(function (item) {
                var itemObj = {key: item.key, value: item.value};
                tableList.list.push(itemObj.value);
                activeCount++;
            }, DB_ALL).done(function () {
                    tableList.count = activeCount;
                    dfd.resolve(tableList);
                }).fail(function (error) {
                    dfd.reject(error);
                });
        } else {
            dfd.resolve(tableList);
        }
    });
    return dfd.promise();
};

TaskTrackCore.prototype.getCurrDate = function () {
    var D = new Date();
    var yyyy = D.getFullYear();
    var mm = (D.getMonth() + 1 < 10) ? '0' + (D.getMonth() + 1) : D.getMonth() + 1;
    var dd = (D.getDate() < 10) ? '0' + D.getDate() : D.getDate();
    return [yyyy, mm, dd].join('-');
};

TaskTrackCore.prototype.normalizeTime = function (timeObj, toStrig) {
    if (typeof timeObj != 'object') {
        throw new Error('Invalid argument!');
    }
    timeObj.h = parseInt(timeObj.h);
    timeObj.m = parseInt(timeObj.m);
    timeObj.s = parseInt(timeObj.s);
    // To 2 symbol
    timeObj.h = (timeObj.h < 10) ? '0' + timeObj.h : timeObj.h;
    timeObj.m = (timeObj.m < 10) ? '0' + timeObj.m : timeObj.m;
    timeObj.s = (timeObj.s < 10) ? '0' + timeObj.s : timeObj.s;
    if (toStrig === true) {
        return [timeObj.h, timeObj.m, timeObj.s].join(':');
    } else {
        return timeObj;
    }
};