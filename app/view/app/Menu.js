/**
 * @author Алексей
 * @project tasktrack
 * @date 01.08.2013 19:20:44
 * 
 * $menu.js$ Menu View
 * 
 */

Ext.define('TT.view.app.Menu', {
	extend : 'Ext.toolbar.Toolbar',
	alias : 'widget.mainToolbar',
	id : 'mainToolbarID',

	suspendLayout : true,
	heigth : '30px',

	initComponent : function() {
		// Create menu
		var mainMenu = Ext.create('Ext.menu.Menu', {
			id : 'mainMenuID',
			style : {
				overflow : 'visible' // For the Combo popup
			},
			items : [ {
				text : 'Submenu1'
			}, {
				text : 'Submenu2'
			}, {
				text : 'Submenu3'
			} ]
		});

		this.callParent(arguments);

		// Adding menu to Toolbar
		this.add({
			text : 'File',
			menu : mainMenu
		});
		this.add({
			text : 'Project',
			id : 'add_projID',
			iconCls : 'add_proj',
			tooltip : 'Add new Project'
		});
		this.suspendLayout = false;
		this.doLayout();
		this.items.get('add_projID').on(
				'click',
				function() {
					var view = Ext.widget('taskedit');
					var form = view.down('form');
					Util.setWinTitle(view, 'Add Task', true);
					var recordData = {
						data : {
							id : Ext.id(),
							project : '',
							task : '',
							time : '',
							remain : '--:--:--'
						}
					};
					var record = new TT.model.Task(Ext.id(), recordData.data);
					Ext.getStore('Tasks').insert(3, record);
					form.loadRecord(record);
				});

		/*
		 * this.width = 100; this.margin = '0 0 10 0'; this.floating = false;
		 * this.items = [{ text: 'regular item 1' },{ text: 'regular item 2' },{
		 * text: 'regular item 3' }];
		 */

	}
});