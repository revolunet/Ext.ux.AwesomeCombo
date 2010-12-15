/**
 * Advanced and lightweight combobox
 * with multi-selection options.
 *
 * @author
 * @version
 * @class Ext.ux.BeeCombo
 * @extends Ext.form.ComboBox
 * @constructor
 * @param {Object} config Configuration options
 * @xtype beecombo
 */
Ext.ux.BeeCombo = {
	/**
	 * @cfg {Boolean} enableTooltip
	 * True to enable tooltip on field
	 * hover, false to disable it.
	 * Defaults to true.
	 */
	enableTooltip: true,

	/**
	 * @cfg {Boolean} enableMultiSelection
	 * True to enable this component to handle multiple items selections.
	 * Defaults to false.
	 */
	enableMultiSelection: false,

	/**
	 * @cfg {Mixed} paging
	 * True to let component handle paging dynamicly.
	 * False to disable paging toolbar.
	 * A number to enable paging and configure pageSize to given value.
	 * Defaults to true.
	 */
	paging: true,

	/**
	 * @cfg {String} format
	 * If value is set to "string" the getValue method will return
	 * selected value(s) as string.
	 * Else if value is set to "object" the getValue method will return
	 * selected value(s) as object.
	 * Defaults to "string".
	 */
	format: 'string',

	/**
	 * @cfg {String} formatSeparator
	 * This parameter is only used if {@link Ext.ux.BeeCombo#format format}
	 * is set to "string".
	 * Defines separator used to split {@link Ext.ux.BeeCombo#setValue setValue}
	 * given arg and to join {@link Ext.ux.BeeCombo#getValue getValue} return.
	 */
	formatSeparator: ',',

	/**
	 * @cfg {Ext.XTemplate} tpl
	 * Override template.
	 */
	tpl: undefined,

	/**
	 * @cfg {String} itemSelection
	 * Override this parameter according to template given via
	 * {@link Ext.ux.BeeCombo#tpl tpl} config.
	 * Defaults to "div.beecombo".
	 */
	itemSelector: 'div.beecombo-item',

	/**
	 * @cfg {Int} pageSize
	 * If {@link Ext.ux.BeeCombo#paging paging} config parameter value is a
	 * number, pageSize will be override with {@link Ext.ux#paging paging} value.
	 * Defaults to 10.
	 */
	pageSize: 10,

	/**
	 * @cfg {String} loadingText
	 * Override loading text.
	 */
	loadingText: 'Searching...',

	// private
	initComponent: function() {
		Ext.ux.BeeCombo.superclass.initComponent.call(this);
		var config = {
			tpl: new Ext.XTemplate(
			'<tpl for="."><div class="beecombo-item {checked}">',
			'{[this.wordwrap(values.', this.displayField || 'field1', ')]}',
			'</div></tpl>', {
				compiled: true,
				wordwrap: function(value) {
					if (value.length > 45) {
						return (value.substr(0, 45) + '...');
					}
					return (value);
				}
			})
		};
		Ext.applyIf(this, Ext.applyIf(this.initialConfig, config));
		this.addEvents(
			/**
			 * @event beforeentrycheck
			 * Fires before an entry is checked. Return false to cancel the action.
			 * @param {Ext.ux.BeeCombo} combo This combo box
			 * @param {Ext.data.Record} record The data record returned from the underlying store
			 * @param {Number} index The index of the selected item in the dropdown list
			 */
			'beforeentrycheck',

			/**
			 * @event entrycheck
			 * Fires when an entry is checked.
			 * @param {Ext.ux.BeeCombo} combo This combo box
			 * @param {Ext.data.Record} record The data record returned from the underlying store
			 * @param {Number} index The index of the selected item in the dropdown list
			 */
			'entrycheck',

			/**
			 * @event beforeentryuncheck
			 * Fires before an entry is unchecked. Return false to cancel the action.
			 * @param {Ext.ux.BeeCombo} combo This combo box
			 * @param {Ext.data.Record} record The data record returned from the underlying store
			 * @param {Number} index The index of the selected item in the dropdown list
			 */
			'beforeentryuncheck',

			/**
			 * @event entryuncheck
			 * Fires when an entry is unchecked.
			 * @param {Ext.ux.BeeCombo} combo This combo box
			 * @param {Ext.data.Record} record The data record returned from the underlying store
			 * @param {Number} index The index of the selected item in the dropdown list
			 */
			'entryuncheck',

			/**
			 * @event beforetooltipshow
			 * Fires before tooltip show. Return false to cancel the action.
			 * @param {Ext.ux.BeeCombo} combo This combo box
			 * @param {Ext.Tooltip} tooltip This combo box tooltip
			 * @param {String} title The tooltip title
			 * @param {String} content The tooltip content
			 */
			'beforetooltipshow',

			/**
			 * @event tooltipshow
			 * Fires when tooltip show.
			 * @param {Ext.ux.BeeCombo} combo This combo box
			 * @param {Ext.Tooltip} tooltip This combo box tooltip
			 * @param {String} title The tooltip title
			 * @param {String} content The tooltip content
			 */
			'tooltipshow'
		);
		this.internal = {};
		this.hasPageTbButton = false;
		this.getStore().on('beforeload', this.onStoreBeforeLoad, this);
		this.getStore().on('load', this.onStoreLoad, this);
		this.on('beforeselect', this.onBeforeSelect, this);
		this.on('afterrender', this.onAfterRender, this);
		this.on('expand', this.onExpand, this);
		this.on('collapse', this.onCollapse, this);
	},

	/**
	 * @method isChecked
	 * Check if given record is checked.
	 * @param {Ext.data.Record} record The record to check
	 * @return {Boolean} True if record is checked else false
	 */
	isChecked: function(record) {
		var index = record.get(this.valueField).toString();
		return (Ext.isDefined(this.internal[index]));
	},

	/**
	 * @method uncheckCurrentValue
	 * Uncheck the given record and remove it from values.
	 * @param {Ext.data.Record} record The record to uncheck
	 */
	uncheckCurrentValue: function() {
		if (Ext.isObject(this.internal)) {
			var record = null;
			for (var i in this.internal) {
				if (Ext.isString(i)) {
					record = this.findRecord(this.valueField, this.internal[i][this.valueField]);
					delete this.internal[i];
					break;
				}
			}
			if (Ext.isObject(record)) {
				record.set('checked', 'unchecked');
				record.commit(true);
			}
		}
	},

	// private
	findAndCheckRecord: function(internalObj, value) {
		var record = this.findRecord(this.valueField, value);
		if (Ext.isObject(record)) {
			if (this.isChecked(record)) {
				internalObj[this.displayField] = record.get(this.displayField);
				record.set('checked', 'checked');
				record.commit(true);
			} else {
				internalObj[this.displayField] = record.get(this.displayField);
				record.set('checked', 'unchecked');
				record.commit(true);
			}
		}
	},

	/**
	 * @method uncheckRecord
	 * Uncheck the given record and remove it from values.
	 * @param {Ext.data.Record} record The record to uncheck
	 */
	uncheckRecord: function(record) {
		var index = record.get(this.valueField).toString();
		if (Ext.isDefined(this.internal[index])) {
			delete this.internal[index];
		}
		record.set('checked', 'unchecked');
		record.commit(true);
		this.refreshDisplay();
	},

	/**
	 * @method checkRecord
	 * Check the given record and add it to values.
	 * @param {Ext.data.Record} record The record to check
	 */
	checkRecord: function(record) {
		if (this.enableMultiSelection !== true) {
			this.uncheckCurrentValue();
		}
		var index = record.get(this.valueField).toString();
		this.internal[index] = {};
		this.internal[index][this.valueField] = record.get(this.valueField);
		this.internal[index][this.displayField] = record.get(this.displayField);
		record.set('checked', 'checked');
		record.commit(true);
		this.refreshDisplay();
	},

	/**
	 * @method getValue
	 * Returns the currently selected field value or empty string if no value is set.
	 * @return {Mixed} value
	 * The selected value(s) corresponding to
	 * {@link Ext.ux.BeeCombo#format format} parameter value.
	 */
	getValue: function() {
		if (this.format === 'object') {
			return (this.getObjectValue());
		} else {
			return (this.getStringValue());
		}
	},

	// private
	defaultCheckRecords: function() {
		var records = this.getStore().getRange();
		for (var i in records) {
			if (Ext.isFunction(records[i]) === false) {
				var isChecked = this.isChecked(records[i]);
				records[i].set('checked', (isChecked ? 'checked' : 'unchecked'));
			}
		}
	},

	/**
	 * @method setValue
	 */
	setValue: function(value) {
		if (Ext.isArray(value)) {
			this.setArrayValue(value);
		} else if (Ext.isObject(value)) {
			this.setObjectValue(value);
		} else if (Ext.isString(value)) {
			this.setStringValue(value);
		} else {
			this.setStringValue(value.toString());
		}
		this.refreshDisplay();
		return (this);
	},

	// private
	refreshDisplay: function() {
		if (this.rendered === false || this.isExpanded()) {
			return (false);
		}
		var nb = 0;
		var selectedValue = '';
		for (i in this.internal) {
			if (Ext.isObject(this.internal[i]) && Ext.isDefined(this.internal[i][this.displayField])) {
				nb = nb + 1;
				selectedValue = this.internal[i][this.displayField];
			}
		}
		console.log(nb);
		var text = '';
		if (nb > 0) {
			if (nb == 1) {
				text = selectedValue;
			} else {
				text = nb + ' item' + (nb > 1 ? 's' : '') + ' selected';
			}
		} else {
			text = 'Select item' + (this.enableMultiSelect ? '(s)' : '') + '...';
		}
		this.emptyText = text;
		this.applyEmptyText();
		//this.setRawValue(text);
	}
};
