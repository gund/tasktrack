/**
 * @author Алексей
 * @project tasktrack
 * @date 01.08.2013 19:20:44
 * 
 * $Task.js$ Tasks DB Model
 * 
 */

Ext.define('TT.model.Task', {
    extend: 'Ext.data.Model',
    fields: ['id', 'project', 'task', 'time', 'remain', 'controls'],
});