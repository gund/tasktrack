/**
 * @author Алексей
 * @project tasktrack
 * @date 01.08.2013 19:20:44
 * 
 * $Tasks.js$ Main App Controller
 * 
 */

Ext.define('TT.controller.Tasks', {
    extend: 'Ext.app.Controller',

    views: [
            'task.List',
            'task.Edit'
        ],
    
    init: function() {
        this.control({
            'viewport > panel': {
                render: this.onPanelRendered
            },
            'tasklist': {
                itemdblclick: this.editTask
            }
        });
    },

    onPanelRendered: function() {
        Util.log('The panel was rendered');
    },
    
    editTask: function(grid, task) {
        Util.log('Double clicked on ' + task.get('project')+ '-'+ task.get('task'));
        var view = Ext.widget('taskedit');
//        view.down('form').loadRecord(task);
    }
});