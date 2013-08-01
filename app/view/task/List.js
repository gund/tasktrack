/**
 * @author Алексей
 * @project tasktrack
 * @date 01.08.2013 19:20:44
 * 
 * $List.js$ List View
 * 
 */

Ext.define('TT.view.task.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.tasklist',

    title: 'Task & Projects',

    initComponent: function() {
        this.store = {
            fields: ['id', 'project', 'task', 'time', 'remain', 'controls'],
            data  : [
                {id: '1', project: 'shyna', task: '113', time: '01:02:56', remain: '--:--:--', controls: 'init'},
                {id: '2', project: 'eurometa', task: '54', time: '00:42:23', remain: '--:--:--', controls: 'init'}
            ]
        };

        this.columns = [
            {dataIndex: 'id',  header: '##',  flex: 0.2},
            {dataIndex: 'project',  header: 'Project',  flex: 1},
            {dataIndex: 'task',  header: 'Task',  flex: 1},
            {dataIndex: 'time',  header: 'Time',  flex: 1},
            {dataIndex: 'remain',  header: 'Remain',  flex: 1},
            {dataIndex: 'controls', header: 'Controls', flex: 1}
        ];

        this.callParent(arguments);
    }
});