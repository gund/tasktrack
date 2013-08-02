/**
 * @author Алексей
 * @project tasktrack
 * @date 01.08.2013 19:20:44
 * 
 * $Tasks.js$ Main App Controller
 * 
 */

Ext.define('TT.controller.Tasks', {
	extend : 'Ext.app.Controller',

	stores : [ 'Tasks' ],
	models : [ 'Task' ],
	views : [ 'task.List', 'task.Edit', 'app.Menu' ],

	init : function() {
		Ext.QuickTips.init();
		this.control({
			'viewport > panel' : {
				render : this.onPanelRendered
			},
			'viewport > tasklist' : {
				itemdblclick : this.editTask
			},
			'#save-task' : {
				click : this.updateTask
			}
		});
		// Check loaded data
		this.getTasksStore().load(function(records, operation, success) {
			if (success) {
				/*if (records.length == 0) {
					Ext.get('tasklistID').hide();
					Ext.get('emptyTaskID').show();
				} else {
					Ext.get('tasklistID').show();
					Ext.get('emptyTaskID').hide();
				}*/
			} else {
				Ext.MessageBox.show({
					title : 'Error',
					msg : 'Error while '+operation.action+'ing data. Please refresh the page!',
					icon : Ext.MessageBox.ERROR,
					closable : false,
					draggable : false
				});
			}
		});
	},

	onPanelRendered : function() {
		Util.log('The panel was rendered');
	},

	editTask : function(grid, task) {
		var title = task.get('project') + '-' + task.get('task');
		var view = Ext.widget('taskedit');
		var form = view.down('form');
		// Set title
		Util.setWinTitle(view, title);
		form.loadRecord(task);
		console.log(task);
		Util.log('Double clicked on ' + title);
	},

	updateTask : function(button) {
		Util.log('clicked the Save button');
		var win = button.up('window'), form = win.down('form'), record = form
				.getRecord(), values = form.getValues();
		if (form.isValid()) {
			if (values.remain == '00:00:00') {
				values.remain = '--:--:--';
			}
			// Update Task
			record.set(values);
			win.close();
			this.getTasksStore().sync();
		} else {
			Ext.MessageBox.show({
				title : 'Error',
				msg : 'Invalid form!',
				buttons : Ext.MessageBox.CANCEL,
				icon : Ext.MessageBox.WARNING
			});
		}
	}
});