Ext.ux.AwesomeCombo
===================

Features
--------
>
- Enable multi-selection (with configuration enableMultiSelection: true)
- Enable tooltip selection (with enableTooltip: true)
- Custom tooltip template (with tooltipTpl: new Ext.XTemplate())
- Clear button available by default
- Many new events

Documentation
-------------
>
- Available via /doc/
- Examples available via /examples/

Quick setup
-----------
First of all include css file as below into head tag:

	<link rel="stylesheet" type="text/css" href="static/css/Ext.ux.AwesomeCombo.css" />

And then javascript files into body tag:

	<script type="text/javascript" src="static/js/Ext.ux.PagingMemoryProxy.js"></script>
	<script type="text/javascript" src="static/js/Ext.ux.AwesomeCombo.js"></script>

Try:

	{
		xtype: "awesomecombo", // or new Ext.ux.AwesomeCombo({...})
		anchor: "0",
		emptyText: "select item(s)...",
		fieldLabel: "Awesome Combo",
		triggerAction: "all",
		enableMultiSelect: true,
		store: [
			['1', 'One'],
			['2', 'Two'],
			['3', 'Three'],
			['4', 'Four']
		]
	}

Screenshot
----------
![From examples page][1]

[1]: https://github.com/revolunet/Ext.ux.BeeCombo/raw/master/screenshot.png