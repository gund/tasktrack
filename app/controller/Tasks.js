/**
 * @author Алексей
 * @project tasktrack
 * @date 01.08.2013 19:20:44
 * 
 * $Tasks.js$
 * 
 */

Ext.define('TT.controller.Tasks', {
    extend: 'Ext.app.Controller',

    views: [
            'task.List'
        ],
    
    init: function() {
        this.control({
            'viewport > panel': {
                render: this.onPanelRendered
            }
        });
    },

    onPanelRendered: function() {
        Util.log('The panel was rendered');
    }
});