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
    var me = this;
    var dfd = $.Deferred();
    this.dbInit = new DB_Adapter({
        name: "TaskTrack DB"
    });
    // Wait for DB
    this.dbInit.done(function (dbAdapter) {
        me.dbAdapter = dbAdapter;
        me.initialize(dfd);
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
const E_INV_SYNC_METHOD = 100;
const E_MISS_DATA = 101;
const E_MISS_LOGIN_PASS = 102;
const E_INV_LOGIN_PASS = 103;
const E_FAIL_SAVE_DATA = 104;

// TaskTrackCore Vars
TaskTrackCore.prototype.version = "1.0.0";
TaskTrackCore.prototype.dbAdapter;
TaskTrackCore.prototype.db;
TaskTrackCore.prototype.projectList = [];
TaskTrackCore.prototype.taskList = [];
TaskTrackCore.prototype.synced = false;
TaskTrackCore.prototype.up2date = true;
TaskTrackCore.prototype.isConnected = false;
TaskTrackCore.prototype.sharedDfd = null;
TaskTrackCore.prototype.sharedDfd2 = null;
TaskTrackCore.prototype.dfdFlag = 0;

/* TaskTrackCore Methods */

TaskTrackCore.prototype.initialize = function (dfd) {
    var me = this;
    this.db = this.dbAdapter.db;
    this.initSettings();
    $.when(this.clearTableListCache(TT_PROJECTS, true), this.clearTableListCache(TT_TASKS, true)).done(function () {
        dfd.resolveWith(me);
    }).fail(function () {
            dfd.reject();
        });
};

TaskTrackCore.prototype.initSettings = function () {
    Utils.log("Init App Settings");
    var db = this.db, me = this;
    var me = this;
    // Init Ajax Settings
    $.ajaxSetup({
        url: '/server/sync.php',
        type: 'POST',
        dataType: 'JSON',
        async: true,
        success: function (data, textStatus, XHR) {
            me.handleSuccess(data, textStatus, XHR);
        },
        error: function (XHR, textStatus, errorThrown) {
            me.handleError(XHR, textStatus, errorThrown);
        }
    });
    db.objectStore("settings").count().done(function (count) {
        if (count === 0) {
            // Add new row
            db.objectStore("settings").add({
                login: null,
                password: null,
                up2date: true
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
                    $('#settings-pass').val('').prop('placeholder', "Type to change password or leave empty...");
                    me.checkLogin();
                }
                me.up2date = item.up2date;
            });
        }
    });
};

TaskTrackCore.prototype.checkLogin = function () {
    this.syncServer2Client();
    //TODO Check login&password ( not needed now ^_^ )
};

TaskTrackCore.prototype.clearTableListCache = function (table, sysCall) {
    var me = this;
    if (sysCall === undefined && sysCall !== true) {
        this.up2date = false;
        this.changeSyncState();
    }
    var dfd = this.getTableList(table[1]);
    dfd.done(function (tableList) {
        switch (table) {
            case TT_PROJECTS:
                me.projectList = tableList;
                break;
            case TT_TASKS:
                me.taskList = tableList;
                break;
        }
    }).fail(function () {
            throw new Error("Failed to get data from inDB!");
            dfd.reject();
        });
    return dfd;
};

TaskTrackCore.prototype.getTableList = function (tableName) {
    var dfd = $.Deferred();
    var me = this;
    var tableList = {count: 0, list: []};
    this.db.objectStore(tableName).index("status").count().done(function (count) {
        if (count > 0) {
            tableList.count = count;
            var activeCount = 0;
            me.db.objectStore(tableName).index("status").each(function (item) {
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

TaskTrackCore.prototype.changeSyncState = function (state) {
    var me = this;
    state = !!state;
    this.db.objectStore("settings").get(1).done(function (item) {
        item.up2date = state;
        me.db.objectStore("settings").put(item, 1);
    });
};

/**
 * METHODS FOR SERVER API
 */

TaskTrackCore.prototype.checkNetConn = function () {
    var dfd = $.Deferred();
    var connected = false;
    try {
        $.ajax({
            url: '/server/check_conn.php',
            type: "GET",
            async: true,
            success: function () {
                connected = true;
                dfd.resolve(connected);
            },
            error: function () {
                connected = false;
                dfd.resolve(connected);
            }
        });
    } catch (e) {
    }
    return dfd.promise();
};

TaskTrackCore.prototype.getData2Sync = function () {
    var me = this, dfd = $.Deferred();
    var projects = {};
    var tasks = {};
    // Get all Projects
    var pReady = this.db.objectStore(TT_PROJECTS[1]).each(function (item) {
        projects[item.key] = item.value;
    });
    // Get all Task
    var tReady = this.db.objectStore(TT_TASKS[1]).each(function (item) {
        tasks[item.key] = item.value;
    });
    $.when(pReady, tReady).done(function () {
        var data = {
            projects: projects,
            tasks: tasks
        };
        data = JSON.stringify(data);
        dfd.resolve(data);
    }).fail(dfd.reject);
    return dfd.promise();
};

TaskTrackCore.prototype.syncServer2Client = function (sysCall) {
    var me = this, percNull = 50, speed = 7;
    if (sysCall === undefined && sysCall !== true) {
        this.sharedDfd = $.Deferred();
        percNull = 0;
        speed = 17;
    }
    this.dfdFlag = 0;
    var wait1 = this.db.objectStore("settings").get(1);
    var wait2 = this.checkNetConn();
    $.when(wait1, wait2).done(function (settings, connected) {
        settings = settings[0];
        if (connected) {
            if (!me.up2date) {
                me.syncClient2Server(true).done(function () {
                    me.syncServer2Client(true);
                });
            } else {
                Utils.log('Starting synchronization S2C...');
                $.ajax({
                    data: {
                        method: 's2c',
                        login: settings.login,
                        password: settings.password
                    },
                    beforeSend: function () {
                        errorWindow.showBefore(99, percNull, speed);
                    }
                });
                me.sharedDfd.done(function (data) {
                    var projects = data.data.projects;
                    var tasks = data.data.tasks;
                    var queue = [];

                    me.dbAdapter.flushTaskAndProj().done(function () {
                        // Add new Projects
                        for (var i in projects) {
                            queue.push(me.db.objectStore(TT_PROJECTS[1]).put(projects[i]));
                        }

                        // Add new Tasks
                        for (var i in tasks) {
                            queue.push(me.db.objectStore(TT_TASKS[1]).put(tasks[i]));
                        }

                        $.when(queue).done(function () {
                            me.renderTaskAndProj();
                        }).fail(function () {
                                throw new Error('Failed to save data to inDB!');
                            });
                        Utils.log("S2C Complete!");
                    }).fail(function () {
                            throw new Error('Failed to update inDB!');
                        });

                });
            }
        } else {
            errorWindow.show("Check your Internet connection!");
        }
    });
    return this.sharedDfd.promise();
};

TaskTrackCore.prototype.syncClient2Server = function (sysCall) {
    var me = this, percNull = 99, speed = 17;
    if (sysCall !== undefined && sysCall === true) {
        percNull = 49;
        speed = 7;
    }
    this.sharedDfd2 = $.Deferred();
    this.dfdFlag = 1;
    var wait1 = this.db.objectStore("settings").get(1);
    var wait2 = this.checkNetConn();
    $.when(wait1, wait2).done(function (settings, connected) {
        settings = settings[0];
        if (connected) {
            if (!me.up2date) {
                Utils.log('Starting synchronization C2S...');
                me.getData2Sync().done(function (data) {
                    $.ajax({
                        data: {
                            method: 'c2s',
                            data: data,
                            login: settings.login,
                            password: settings.password
                        },
                        beforeSend: function () {
                            errorWindow.showBefore(percNull, 0, speed);
                        }
                    });
                });
                me.sharedDfd2.done(function () {
                    Utils.log("C2S Complete!");
                    me.up2date = true;
                    me.changeSyncState(true);
                });
            } else {
                errorWindow.show("Synchronization Completed!", false);
            }
        } else {
            errorWindow.show("Check your Internet connection!");
        }
    });
    return this.sharedDfd2.promise();
};

TaskTrackCore.prototype.renderTaskAndProj = function () {
    this.clearTableListCache(TT_PROJECTS, true);
    this.clearTableListCache(TT_TASKS, true).done(TaskList.render);
};

/* ### AJAX HANDLERS --- START ### */

TaskTrackCore.prototype.handleSuccess = function (data, textStatus, XHR) {
    Utils.log('Success!', data, data.msg);
    if (data.status == 200) {
        if (this.dfdFlag == 0)
            this.sharedDfd.resolve(data, data.status);
        else
            this.sharedDfd2.resolve(data, data.status);
    } else {
        if (this.dfdFlag == 0)
            this.sharedDfd.reject(data.status, data.msg);
        else
            this.sharedDfd2.reject(data.status, data.msg);
    }
    switch (data.status) {
        case 200:
            errorWindow.show("Synchronization Completed!", false);
            break;
        case E_INV_SYNC_METHOD:
            errorWindow.show("Invalid synchronization method!");
            break;
        case E_MISS_DATA:
            errorWindow.show("Missing data for sync!");
            break;
        case E_MISS_LOGIN_PASS:
            errorWindow.show("Missing Login and/or Password!");
            setTimeout('sWindow.wnd.show()', 2000);
            break;
        case E_INV_LOGIN_PASS:
            errorWindow.show("Invalid Login and/or Password!");
            setTimeout('sWindow.wnd.show()', 2000);
            break;
        case E_FAIL_SAVE_DATA:
            errorWindow.show("Failed to synchronization data!");
            break;
    }
};

TaskTrackCore.prototype.handleError = function (XHR, textStatus, errorThrown) {
    this.sharedDfd.reject(XHR.status, textStatus);
    switch (XHR.status) {
        case 404:
            errorWindow.show("404 - Not Found");
            break;
        default :
            errorWindow.show('Unknown Error: ' + XHR.status + ', ' + textStatus + ', ' + errorThrown);
            break;
    }
};

/* ### AJAX HANDLERS --- END ### */
