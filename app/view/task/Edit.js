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
    modal: true,
    constrain: true,
    resizable: false,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                items: [
                    {
                        xtype: 'textfield',
                        name : 'project',
                        vtype: 'alphanum',
                        vtypeText: 'Project name must be Alpha-Numeric',
                        padding: '5',
                        fieldLabel: 'Project'
                    },
                    {
                        xtype: 'textfield',
                        name : 'task',
                        allowBlank: false,
                        vtype: 'alphanum',
                        vtypeText: 'Task name must be Alpha-Numeric and is required',
                        padding: '5',
                        fieldLabel: 'Task'
                    },
                    {
                        xtype: 'timefield',
                        format: 'H:i:s',
                        validateOnChange: true,
                        allowBlank: false,
                        vtypeText: '',
                        name : 'time',
                        value: '00:00:00',
                        padding: '5',
                        fieldLabel: 'Time'
                    },
                    {
                        xtype: 'timefield',
                        format: 'H:i:s',
                        validateOnChange: true,
                        allowBlank: false,
                        vtypeText: '',
                        name : 'remain',
                        altFormats: '--:--:--',
                        value: '--:--:--',
                        padding: '5',
                        fieldLabel: 'Remain'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: 'Save',
                action: 'save',
                id: 'save-task'
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