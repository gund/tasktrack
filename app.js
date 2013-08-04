/**
 * @author Алексей
 * @project tasktrack
 * @date 01.08.2013 19:20:44
 * 
 * $app.js$ Start MVC Application here
 * 
 */

Ext.application({
	requires : [ 'Ext.container.Viewport', 'Ext.window.MessageBox' ],
	name : 'TT',

	appFolder : 'app',
	controllers : [ 'Tasks' ],

	launch : function() {
		Ext.create('Ext.container.Viewport', {
			layout : 'border',
			items : [

			{
				region : 'north',
				xtype : 'mainToolbar',
				autoHeight : true
			}, {
				region : 'center',
				xtype : 'tasklist'
			} ]
		});
	}
});