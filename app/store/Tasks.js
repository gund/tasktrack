/**
 * @author Алексей
 * @project tasktrack
 * @date 01.08.2013 19:20:44
 * 
 * $Tasks.js$ Tasks Store DB Interface
 * 
 */

Ext.define('TT.store.Tasks', {
    extend: 'Ext.data.Store',
    model: 'TT.model.Task',
    alias: 'store.taskstore',
    id: 'taskstore',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'data/tasks.json',
        api: {
            read: 'data/tasks.json',
            update: 'data/tasks.json'
        },
        reader: {
            type: 'json',
            root: 'tasks',
            successProperty: 'success'
        }
    },
});