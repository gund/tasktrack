/**
 * @author Alex Malkevich
 * @project tasktrack
 * @file main.js
 * @package js
 * @date 08.08.2013 18:34:12
 * @id $js-2013-main.js$
 * main.js - Main JavaScript Application
 */

var TT = null;

/* #### Windows Section START #### */

// Settings Window
var sWindow = {
    wnd: null,
    setup: function () {
        this.wnd = new WindowTT({
            title: "Settings",
            modal: true,
            height: 205,
            html: 'To Sync your tasks you need to register on <a href="//ttrack.tk/register" target="_blank">TaskTrack</a><hr>' +
                '<div id="settings-error"></div><br>' +
                'Login: <input type="text" id="settings-login"><br>' +
                'Password: <input type="password" id="settings-pass"><br>' +
                '<input type="button" class="button primary" value="Save" id="settings-ok"><br><br><hr>' +
                '<h5>You can stay logged out but you may not sync your Tasks and Projects.</h5>'
        });
        // Bind events in window
        $('#settings-ok').click(this.save);
    },
    save: function () {
        var login = $('#settings-login').val();
        var pass = $('#settings-pass').val();
        Utils.log(MultiCrypting.encode(pass));
        if (login.length > 3 && pass.length > 3) {
            Utils.log("Saving settings...");
            TT.db.objectStore("settings").put({
                "login": login,
                "password": pass,
                "up2date": TT.up2date
            }, 1).then(function () {
                    TT.checkLogin();
                    sWindow.wnd.close();
                    Utils.log("Settings saved!");
                }, function () {
                    Utils.log("Settings NOT saved!");
                });
        }
    }
};
// ProjectList Window
var projWindow = {
    wnd: null,
    setup: function () {
        var self = this;
        this.wnd = new WindowTT({
            title: "Projects",
            modal: true,
            max_height: 350,
            html: '<table border="0"><thead><tr><td>Name</td><td class="second">Controls</td></tr></thead></table>' +
                '<input type="text" id="proj-add-text">' +
                '<a href="javascript://" class="button primary icon add" id="proj-add">Add</a>' +
                '<table border="0" id="proj-list"><tr><td colspan="2">Empty list</td></tr></table>'
        });
        // Bind events in window
        $('#proj-ok').click(this.save);
        $('#proj-add').click(this.add);
        $('#proj-add-text').keydown(function (e) {
            if (e.keyCode == 13) { // Enter = 13
                self.add();
            }
        });
    },
    add: function () {
        if ($('#proj-add-text').val().length > 0) {
            TT.db.objectStore(TT_PROJECTS[1]).add({
                name: $('#proj-add-text').val(),
                status: DB_NEW
            }).done(function () {
                    $('#proj-add-text').val('');
                    TT.clearTableListCache(TT_PROJECTS).done(projWindow.render);
                });
        }
    },
    editShow: function (itemId) {
        // Get item info
        TT.db.objectStore(TT_PROJECTS[1]).get(itemId).done(function (item) {
            var tdName = document.getElementById('td-name_' + itemId);
            var nameTextBox = document.createElement('input');
            nameTextBox.setAttribute('type', 'text');
            nameTextBox.setAttribute('id', 'input-name_' + itemId);
            nameTextBox.setAttribute('value', item.name);
            // Show textbox
            tdName.innerHTML = ''; // Clear
            tdName.appendChild(nameTextBox);
            tdName.innerHTML += '<input class="button" onclick="projWindow.editSave(' + itemId + ')" type="button" value="Save">'; // Add save Btn
            $('#input-name_' + itemId).focus();
        });
    },
    editSave: function (itemId) {
        var tdName = document.getElementById('td-name_' + itemId);
        var nameTextBox = document.getElementById('input-name_' + itemId);
        if (nameTextBox.value.length == 0) {
            throw new Error("Invalid argument!");
        }
        // Get Item
        TT.db.objectStore(TT_PROJECTS[1]).get(itemId).done(function (item) {
            // New Item
            var newItem = {
                "id": itemId,
                "name": nameTextBox.value,
                "status": (item.status == DB_NEW) ? DB_NEW : DB_MODIFIED
            };
            // Save item info
            TT.db.objectStore(TT_PROJECTS[1]).put(newItem).then(function () {
                tdName.innerHTML = nameTextBox.value;
                TT.clearTableListCache(TT_PROJECTS).done(projWindow.render);
                Utils.log("Item saved!");
            }, function () {
                Utils.log("Item NOT saved!");
            });
        }).fail(function () {
                throw new Error("Failed to get Project!");
            });
    },
    remove: function (itemId) {
        // Get Item
        TT.db.objectStore(TT_PROJECTS[1]).get(itemId).done(function (item) {
            item.status = DB_DELETED;
            // Save Item
            TT.db.objectStore(TT_PROJECTS[1]).put(item).done(function () {
                TT.clearTableListCache(TT_PROJECTS).done(projWindow.render);
            });
        });
        /*TT.db.objectStore(TT_PROJECTS[1]).delete(itemId).done(function () {
         projWindow.render();
         });*/
    },
    render: function () {
        var projListHTML = document.getElementById('proj-list');
        if (TT.projectList.count > 0) {
            // Clear and fill list
            projListHTML.innerHTML = ''; // Clear
            for (var i = 0; i < TT.projectList.count; ++i) {
                var item = TT.projectList.list[i];
                var trElem = document.createElement('tr');
                trElem.setAttribute('valign', 'middle');
                var tdName = document.createElement('td');
                tdName.setAttribute('id', 'td-name_' + item.id);
                var tdCtrl = document.createElement('td');
                tdCtrl.setAttribute('class', 'second');
                tdCtrl.innerHTML = '<div class="button-group"><a class="button icon edit" href="javascript://" onclick="projWindow.editShow(' + item.id + ')">Edit</a>' +
                    '<a class="button danger icon remove" href="javascript://" onclick="projWindow.remove(' + item.id + ')">Delete</a></div>';
                tdName.innerHTML = item.name;
                trElem.appendChild(tdName);
                trElem.appendChild(tdCtrl);
                projListHTML.appendChild(trElem);
            }
        } else {
            projListHTML.innerHTML = '<tr><td colspan="2">Empty list</td></tr>';
        }
    }
};
// Task Window
var taskWindow = {
    wnd: null,
    setup: function () {
        this.wnd = new WindowTT({
            title: 'Add New Task',
            modal: true,
            html: '<label>Name: <input id="win-task-name" type="text"></label><br>' +
                '<label>Project: <select id="win-task-proj"></select></label><br><hr>' +
                '<label>Date: <input id="win-task-date" type="date"></label><br>' +
                '<label>Set Time? <input id="win-task-settime" type="checkbox"></label><br>' +
                '<input id="win-task-time-h" min="0" max="255" type="number"> ' +
                '<input id="win-task-time-m" min="0" max="60" type="number"> ' +
                '<input id="win-task-time-s" min="0" max="60" type="number"><hr>' +
                '<input class="button primary" id="win-task-add" type="button" value="Add">' +
                '<input class="button primary" id="win-task-save" type="button" value="Save">'
        });
        //Bind window events
        $('#win-task-add').click(this.add);
        $('#win-task-save').click(this.save);
        $('#win-task-settime').change(this.activateTime);
    },
    add: function () {
        var name = $('#win-task-name');
        var project = $('#win-task-proj');
        var date = $('#win-task-date');
        var setTime = !!$('#win-task-settime').prop('checked');
        var h = $('#win-task-time-h').val();
        var m = $('#win-task-time-m').val();
        var s = $('#win-task-time-s').val();
        // Validate Task
        if (name.val().length == 0 || (setTime && ((h.length == 0 || h < 0 || h > 255)
            || (m.length == 0 || m < 0 || m > 60) || (s.length == 0 || s < 0 || s > 60)))) {
            return;
        }
        // Generate New Task
        var newTask = {
            name: name.val(),
            projectId: project.val(),
            state: TASK_PAUSED,
            status: DB_NEW,
            date: date.val(),
            time: (setTime) ? {
                h: h,
                m: m,
                s: s
            } : {
                h: 0,
                m: 0,
                s: 0
            }
        };
        // Add New Task
        TT.db.objectStore(TT_TASKS[1]).add(newTask).done(function () {
            taskWindow.wnd.close();
            TT.clearTableListCache(TT_TASKS).done(TaskList.render).fail(function () {
                throw new Error("Failed to update Task List!");
            });
            Utils.log("Task Added!");
        }).fail(function () {
                throw new Error("Failed to add new task to inDB!");
            });
    },
    save: function () {
        var taskId = parseInt(localStorage.getItem('task_id'));
        if (typeof taskId != 'number') {
            throw new Error("Invalid Task ID!");
        }
        var name = $('#win-task-name');
        var project = $('#win-task-proj');
        var date = $('#win-task-date');
        var setTime = !!$('#win-task-settime').prop('checked');
        var h = $('#win-task-time-h').val();
        var m = $('#win-task-time-m').val();
        var s = $('#win-task-time-s').val();
        // Validate Task
        if (name.val().length == 0 || (setTime && ((h.length == 0 || h < 0 || h > 255)
            || (m.length == 0 || m < 0 || m > 60) || (s.length == 0 || s < 0 || s > 60)))) {
            return;
        }
        // Get this Task
        TT.db.objectStore(TT_TASKS[1]).get(taskId).done(function (item) {
            item.name = name.val();
            item.projectId = project.val();
            item.date = date.val();
            item.state = (setTime) ? TASK_PAUSED : item.state;
            item.status = (item.status == DB_NEW) ? DB_NEW : DB_MODIFIED;
            if (setTime) {
                item.time.h = h;
                item.time.m = m;
                item.time.s = s;
            }
            // Save Task
            TT.db.objectStore(TT_TASKS[1]).put(item).done(function () {
                taskWindow.wnd.close();
                TT.clearTableListCache(TT_TASKS).done(TaskList.render).fail(function () {
                    throw new Error("Failed to update Task List!");
                });
                Utils.log("Task Saved!");
            }).fail(function () {
                    throw new Error("Failed to save Task to inDB!");
                });
        }).fail(function () {
                throw new Error("Failed to get Task form inDB!");
            });

    },
    activateTime: function (e) {
        if (e.target.checked) {
            $('#win-task-time-h').removeAttr('disabled');
            $('#win-task-time-m').removeAttr('disabled');
            $('#win-task-time-s').removeAttr('disabled');
        } else {
            $('#win-task-time-h').attr('disabled', 'disabled');
            $('#win-task-time-m').attr('disabled', 'disabled');
            $('#win-task-time-s').attr('disabled', 'disabled');
        }
    },
    render: function (taskId) {
        var self = this;
        // Fill Project List
        var projectListHTML = document.getElementById('win-task-proj');
        projectListHTML.innerHTML = '<option value="null">----</option>\n';
        var projHtml = '';
        for (var i = 0; i < TT.projectList.count; ++i) {
            var item = TT.projectList.list[i];
            projHtml += '<option value="' + item.id + '">' + item.name + '</option>\n';
        }
        projectListHTML.innerHTML += projHtml;
        $('#win-task-settime').prop('checked', false);
        var h = $('#win-task-time-h').attr('disabled', 'disabled');
        var m = $('#win-task-time-m').attr('disabled', 'disabled');
        var s = $('#win-task-time-s').attr('disabled', 'disabled');
        // Fill task if set
        if (taskId !== undefined) {
            Utils.log("Get Task!");
            $('#win-task-add').css('display', 'none');
            $('#win-task-save').css('display', 'block');
            // Get Task from inDB
            TT.db.objectStore(TT_TASKS[1]).get(taskId).done(function (item) {
                self.wnd.setTitle("Edit Task <b>" + item.name + "</b>");
                localStorage.setItem('task_id', item.id);
                $('#win-task-name').val(item.name);
                $('#win-task-proj').val(item.projectId);
                $('#win-task-date').val(item.date);
                h.val(item.time.h);
                m.val(item.time.m);
                s.val(item.time.s);
            }).fail(function () {
                    throw new Error("Failed to get Task from inDB!");
                });
        } else {
            self.wnd.setTitle('Add New Task');
            $('#win-task-save').css('display', 'none');
            $('#win-task-add').css('display', 'block');
            $('#win-task-date').val(TT.getCurrDate());
            localStorage.setItem('task_id', null);
            $('#win-task-name').val('');
            $('#win-task-proj').val("null");
            h.val(0);
            m.val(0);
            s.val(0);
        }
    }
};

var errorWindow = {
    wnd: null,
    setup: function () {
        this.wnd = new WindowTT({
            title: 'Error!',
            modal: true,
            height: 100,
            max_height: 250,
            closeAble: false
        });
    },
    show: function (text) {
        this.wnd.setHtml('<div align="center" style="font: 20px normal Arial">' + text + '</div>');
        this.wnd.show();
        setTimeout(function () {
            errorWindow.wnd.close();
        }, 2000);
    }
};

/* #### Windows Section END #### */

// Class to control Task List
var TaskList = {
    start: function (taskId) {
        if (typeof taskId != 'number') {
            throw new Error("Invalid argument!");
        }
        this.changeState(true, taskId);
    },
    stop: function (taskId) {
        if (typeof taskId != 'number') {
            throw new Error("Invalid argument!");
        }
        this.changeState(false, taskId);
    },
    edit: function (taskId) {
        if (typeof taskId != 'number') {
            throw new Error("Invalid argument!");
        }
        taskWindow.render(taskId);
        taskWindow.wnd.show();
    },
    remove: function (taskId) {
        var self = this;
        if (typeof taskId != 'number') {
            throw new Error("Invalid argument!");
        }
        // Get Task
        TT.db.objectStore(TT_TASKS[1]).get(taskId).done(function (task) {
            task.status = DB_DELETED; // Delete Task
            // Save Task
            TT.db.objectStore(TT_TASKS[1]).put(task).done(function () {
                TT.clearTableListCache(TT_TASKS).done(self.render).fail(function () {
                    throw new Error("Failed to update Task List!");
                });
            }).fail(function () {
                    throw new Error("Failed to delete Task!");
                });
        }).fail(function () {
                throw new Error("Failed to delete Task!");
            });
        /*TT.db.objectStore(TT_TASKS[1]).delete(taskId).done(function () {
         TT.clearTableListCache(TT_TASKS).done(self.render).fail(function () {
         throw new Error("Failed to update Task List!");
         });
         }).fail(function () {
         throw new Error("Failed to remove Task from inDB!");
         });*/
    },
    changeState: function (state, taskId) {
        if (typeof  state != 'boolean') {
            throw new Error("Invalid argument!");
        }
        var self = this;
        // Get Task from inDB
        TT.db.objectStore(TT_TASKS[1]).get(taskId).done(function (item) {
            item.state = (state) ? TASK_ACTIVE : TASK_PAUSED; // Update Task State
            // Save task to inDB
            TT.db.objectStore(TT_TASKS[1]).put(item).done(function () {
                self.render();
                TT.clearTableListCache(TT_TASKS);
            }).fail(function () {
                    throw new Error("Failed to save Task to inDB!");
                });
        }).fail(function () {
                throw new Error("Failed to get Task from inDB!");
            });
    },
    render: function () {
        var parentNode = document.getElementById('table-task-list');
        // Get tasks count
        var count = TT.taskList.count;
        if (count > 0) {
            // Clear List
            parentNode.innerHTML = '';
            // Fill all tasks
            for (var i = 0; i < count; ++i) {
                var task = TT.taskList.list[i];
                // Get Project
                var project = '---';
                if (task.projectId !== null) {
                    for (var j = 0; j < TT.projectList.count; ++j) {
                        if (TT.projectList.list[j].id == task.projectId) {
                            project = TT.projectList.list[j].name;
                            break;
                        }
                    }
                }
                // Create TR
                var tr = document.createElement('tr');
                tr.setAttribute('id', 'task_tr_' + task.id);
                // Create CheckBox
                var cb = document.createElement('td');
                cb.innerHTML = '<input type="checkbox" class="checkbox_js" id="checked_' + task.id + '">';
                // Create Name
                var name = document.createElement('td');
                name.setAttribute('class', 'task-name');
                name.innerHTML = task.name;
                // Create Project
                var proj = document.createElement('td');
                proj.setAttribute('class', 'task-proj');
                proj.innerHTML = project;
                // Create Time
                var time = document.createElement('td');
                time.setAttribute('class', 'task-time');
                time.innerHTML = TT.normalizeTime(task.time, true);
                // Create Date
                var date = document.createElement('td');
                date.setAttribute('class', 'task-date');
                date.innerHTML = task.date;
                // Create Controls
                var ctrl = document.createElement('td');
                ctrl.setAttribute('class', 'task-control');
                ctrl.innerHTML = '<div class="button-group"><a class="button icon clock" href="javascript://" onclick="TaskList.start(' + task.id + ')">Start</a>' +
                    '<a class="button danger icon clock" href="javascript://" onclick="TaskList.stop(' + task.id + ')">Stop</a>' +
                    '<a class="button icon edit" href="javascript://" onclick="TaskList.edit(' + task.id + ')">Edit</a>' +
                    '<a class="button danger icon trash" href="javascript://" onclick="TaskList.remove(' + task.id + ')">Delete</a></div>';
                tr.appendChild(cb);
                tr.appendChild(name);
                tr.appendChild(proj);
                tr.appendChild(time);
                tr.appendChild(date);
                tr.appendChild(ctrl);
                parentNode.appendChild(tr);
            }
            $('.checkbox_js').change(function () {
                var tr = this.parentNode.parentNode;
                if (this.checked) {
                    tr.setAttribute('style', 'background-image: -webkit-gradient(' +
                        'linear,left top,left bottom,color-stop(0, #9F9F9F),' +
                        'color-stop(0.5, #B8B8B8),color-stop(1, #9F9F9F) );' +
                        'background-image: -o-linear-gradient(bottom, #9F9F9F 0%, #B8B8B8 50%, #9F9F9F 100%);' +
                        'background-image: -moz-linear-gradient(bottom, #9F9F9F 0%, #B8B8B8 50%, #9F9F9F 100%);' +
                        'background-image: -webkit-linear-gradient(bottom, #9F9F9F 0%, #B8B8B8 50%, #9F9F9F 100%);' +
                        'background-image: -ms-linear-gradient(bottom, #9F9F9F 0%, #B8B8B8 50%, #9F9F9F 100%);' +
                        'background-image: linear-gradient(to bottom, #9F9F9F 0%, #B8B8B8 50%, #9F9F9F 100%);');
                } else {
                    tr.setAttribute('style', '');
                }
            });
        } else {
            parentNode.innerHTML = '<tr><td colspan="5">Empty Task List</td></tr>';
        }
    },
    updateTime: function (taskId, time) {
        if (typeof taskId != 'number' || time === undefined) {
            throw new Error("Invalid argument!");
        }
        $('#task_tr_' + taskId).find('.task-time').html(time);
    }
};

$(document).ready(function () {
    Utils.log('DOM is ready!');
    onLoadApp();
});

function hideLoadImg() {
    Utils.log("App Ready!");
    $('#app-loading-bg').stop().animate({
        opacity: 0
    }, 500, function () {
        $(this).css('display', 'none');
    });
    setInterval(startUpdate, 1000);
}

function onLoadApp() {
    sWindow.setup();
    projWindow.setup();
    taskWindow.setup();
    errorWindow.setup();
    initEvents();
    TT = new TaskTrackCore();
    TT.done(function () {
        TT = this;
        TaskList.render();
        hideLoadImg();
    }).fail(function () {
            throw new Error("Error while starting Core!");
        });
}

function initEvents() {
    $('#settings').click(function () {
        sWindow.wnd.show();
    });
    $('#manage-projects').click(function () {
        projWindow.render();
        projWindow.wnd.show();
    });
    $('#add-new-task').click(function () {
        taskWindow.render();
        taskWindow.wnd.show();
    });
    $('#sync').click(sync);
    $('#start-task').click(startTasks);
    $('#stop-task').click(stopTasks);
    $('#delete-task').click(deleteTasks);
    $('#task-control-checkbox').click(toggleTasks);
}

function startUpdate() {
    for (var i = TT.taskList.count - 1; i >= 0; --i) {
        var item = TT.taskList.list[i];
        if (item.state == TASK_ACTIVE) {
            item.time.s++;
            if (item.time.s >= 60) {
                item.time.s = 0;
                item.time.m++;
                if (item.time.m >= 60) {
                    item.time.m = 0;
                    item.time.h++;
                }
            }
            TaskList.updateTime(item.id, TT.normalizeTime(item.time, true));
            TT.db.objectStore(TT_TASKS[1]).put(item);
        }
    }
}

function startTasks() {
    $('#table-task-list .checkbox_js:checked').each(function (item) {
        var taskId = parseInt(this.getAttribute('id').match(/([0-9]+)/)[0]);
        TaskList.start(taskId);
    });
}

function stopTasks() {
    $('#table-task-list .checkbox_js:checked').each(function (item) {
        var taskId = parseInt(this.getAttribute('id').match(/([0-9]+)/)[0]);
        TaskList.stop(taskId);
    });
}

function deleteTasks() {
    $('#table-task-list .checkbox_js:checked').each(function (item) {
        var taskId = parseInt(this.getAttribute('id').match(/([0-9]+)/)[0]);
        TaskList.remove(taskId);
    });
}

function toggleTasks() {
    var check = !!$('#task-control-checkbox').prop('checked');
    $('#table-task-list .checkbox_js').each(function () {
        $(this).prop('checked', check).change();
    })
}

function sync() {
    TT.syncServer2Client().done(function () {
        Utils.log("AZAZAZAZa");
    }).fail(function (status, textStatus) {
            Utils.log("Failed XHR!", status, textStatus);
        });
}