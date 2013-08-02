/**
 * @author Алексей
 * @project tasktrack
 * @date 01.08.2013 19:20:44
 * 
 * $app.js$ Start MVC Application here
 * 
 */

Ext.application({
	requires: ['Ext.container.Viewport'],
	name: 'TT',
	
	appFolder: 'app',
	controllers: [
	              'Tasks'
	          ],
	
	launch: function() {
		Ext.create('Ext.container.Viewport', {
			layout: 'fit',
			items: [
			        {
			        	xtype: 'panel',
			        	title: 'Task Track',
			        	html: 'Here\'ll be your task and projects. Click <a href="#">Add</a> to add some data'
			        }
			        ]
		});
		Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: {
                xtype: 'tasklist'
            }
        });
	}
});