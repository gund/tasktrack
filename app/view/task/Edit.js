/**
 * @author Алексей
 * @project tasktrack
 * @date 01.08.2013 19:20:44
 * 
 * $Edit.js$ Edit Task View
 * 
 */

Ext.define('TT.view.task.Edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.taskedit',

    title: 'Edit Task',
    layout: 'fit',
    autoShow: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                items: [
                    {
                        xtype: 'textfield',
                        name : 'project',
                        fieldLabel: 'Project'
                    },
                    {
                        xtype: 'textfield',
                        name : 'task',
                        fieldLabel: 'Task'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: 'Save',
                action: 'save'
            },
            {
                text: 'Cancel',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});