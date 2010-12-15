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
Ext.ux.BeeCombo = Ext.extend(Ext.form.ComboBox, {
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
	 * @cfg {String} output
	 * If value is set to "string" the getValue method will return
	 * selected value(s) as string.
	 * Else if value is set to "object" the getValue method will return
	 * selected value(s) as object.
	 * Defaults to string.
	 */
	output: 'string',

	/**
	 * @cfg {String} outputSeparator
	 * This parameter is only used if {@link Ext.ux.BeeCombo#output}
	 * is set to "string".
	 * Defines separator used to split {@link Ext.ux.BeeCombo#setValue setValue}
	 * given arg and to join {@link Ext.ux.BeeCombo#getValue getValue} return.
	 */
	outputSeparator: ',',

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
		var config = {
			tpl: new Ext.XTemplate(
			'<tpl for="."><div class="beecombo-item {checked}">',
			'{[this.wordwrap(values.', this.displayField, ')]}',
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
		Ext.apply(this, Ext.applyIf(this.initialConfig, config));
		Ext.ux.BeeCombo.superclass.initComponent.apply(this);
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
	 */
	isChecked: function(record) {
		var index = record.get(this.valueField).toString();
		return (Ext.isDefined(this.internal[this.valueField]));
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
					record = this.getStore().getById(i);
					break;
				}
			}
			if (Ext.isObject(record)) {
				record.set('checked', 'non-checked');
				record.commit(true);
			}
		}
		this.internal = {};
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
	 * {@link Ext.ux.BeeCombo#outputType outputType} parameter value.
	 */
	getValue: function() {
		var values = new Array();
		for (i in this.internal) {
			if (Ext.isEmpty(i) == false && this.internal[i] !== false) {
				var index = i.toString();
				if (this.output === 'object') {
					var value = {};
					value[this.valueField] = index;
					if (Ext.isDefined(value[this.displayField])) {
						value[this.displayField] = this.internal[i];
					}
				} else {
					var value = index;
				}
				values.push(value);
			}
		}
		if (this.output !== 'object') {
			return (values.join(','));
		}
		return (values);
	},

	/**
	 * @method setValue
	 */
	setValue: function(value) {
		if (Ext.isArray(value)) {
			for (i = 0; i < value.length; ++i) {
				if (parseInt(value[i][this.valueField]) > 0) {
					this.internal[value[i][this.valueField].toString()] = value[i][this.displayField];
				}
			}
		}
		this.refreshDisplay();
		return (this);
	},

	refreshDisplay: function() {
		if (this.rendered === false || this.isExpanded()) {
			return (false);
		}
		var nb = 0;
		var selectedValue = '';
		for (i in this.internal) {
			if (Ext.isString(i) == false && Ext.isDefined(this.internal[i])) {
				nb = nb + 1;
				selectedValue = this.internal[i];
			}
		}
		var text = '';
		if (nb > 0) {
			if (nb == 1) {
				text = selectedValue;
			} else {
				text = nb + ' ' + this.displayName + (nb > 1 ? 's' : '') + ' selected';
			}
		} else {
			text = 'Select ' + this.displayName + '(s)...';
		}
	}
});

Ext.reg('beecombo', Ext.ux.BeeCombo);