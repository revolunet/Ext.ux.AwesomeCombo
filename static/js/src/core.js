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
	 * Defaults to 0.
	 */
	pageSize: 0,

	/**
	 * @cfg {String} loadingText
	 * Override loading text.
	 */
	loadingText: 'Searching...',

	/**
	 * @cfg {String} trigger1Class (optional)
	 * Css class for clear button.
	 * Defaults to "x-form-clear-trigger".
	 */
	trigger1Class: 'x-form-clear-trigger',

	/**
	 * @cfg {String} trigger2Class (optional)
	 * Css class for expand button.
	 * Defaults to "x-form-trigger".
	 */
	trigger2Class: 'x-form-trigger',

	// private
	initComponent: function() {
		this.triggerConfig = {
			tag: 'span',
			cls: 'x-form-twin-triggers',
			cn: [{
				tag: 'img',
				src: Ext.BLANK_IMAGE_URL,
				alt: '',
				cls: 'x-form-trigger ' + this.trigger1Class
			}, {
				tag: 'img',
				src: Ext.BLANK_IMAGE_URL,
				alt: '',
				cls: 'x-form-trigger ' + this.trigger2Class
			}]
		};
		this.onTrigger2Click = this.onTriggerClick;
		this.onTrigger1Click = this.reset;
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
		this.internal = new Ext.util.MixedCollection();
		this.internal.addListener('add', this.onInternalAdd, this);
		this.internal.addListener('clear', this.onInternalClear, this);
		this.internal.addListener('remove', this.onInternalRemove, this);
		this.hasPageTbButton = false;
		this.store.on('beforeload', this.onStoreBeforeLoad, this);
		this.store.on('load', this.onStoreLoad, this);
		this.on('beforeselect', this.onBeforeSelect, this);
		this.on('afterrender', this.onAfterRender, this);
		this.on('expand', this.onExpand, this);
	},

	/**
	 * @method isChecked
	 * Check if given record is checked.
	 * @param {Ext.data.Record} record The record to check
	 * @return {Boolean} True if record is checked else false
	 */
	isChecked: function(record) {
		var index = record.get(this.valueField).toString();
		return (this.internal.containsKey(index));
	},

	/**
	 * @method reset
	 * Flush all values.
	 */
	reset: function() {
		this.internal.clear();
	},

	/**
	 * @method uncheckRecord
	 * Uncheck the given record and remove it from values.
	 * @param {Ext.data.Record} record The record to uncheck
	 */
	uncheckRecord: function(record) {
		var index = record.get(this.valueField).toString();
		this.internal.removeKey(index);
	},

	/**
	 * @method checkRecord
	 * Check the given record and add it to values.
	 * @param {Ext.data.Record} record The record to check
	 */
	checkRecord: function(record) {
		if (this.enableMultiSelection !== true) {
			this.reset();
		}
		var index = record.get(this.valueField).toString();
		var item = {};
		item[this.valueField] = record.get(this.valueField);
		this.internal.add(index, item);
		this.internal.get(index)[this.displayField] = record.get(this.displayField);
	},

	/**
	 * @method getValue
	 * Returns the currently selected field value or
	 * empty string if no value is set.
	 * @param {String} forcedFormat (optional) Force output format.
	 * Defaults to {@link Ext.ux.BeeCombo#format format} parameter value.
	 * @return {Mixed} value
	 * The selected value(s) corresponding to
	 * {@link Ext.ux.BeeCombo#format format} parameter value.
	 */
	getValue: function(forcedFormat) {
		forcedFormat = forcedFormat || this.format;
		if (this.format === 'object') {
			return (this.getObjectValue());
		} else {
			return (this.getStringValue());
		}
	},

	// private
	getDisplayValue: function() {
		if (this.internal.getCount()) {
			var item = this.internal.get(0);
			if (Ext.isDefined(item[this.displayField])) {
				return (item[this.displayField]);
			} else {
				return (item[this.valueField]);
			}
		} else {
			return (false);
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
		if (value == this.getRawValue()) {
			this.refreshDisplay();
			return (this);
		}
		this.reset();
		this.isSettingValue = true;
		if (Ext.isArray(value)) {
			this.setArrayValue(value);
		} else if (Ext.isObject(value)) {
			this.setObjectValue(value);
		} else if (Ext.isString(value)) {
			this.setStringValue(value);
		} else {
			this.setStringValue(value.toString());
		}
		this.isSettingValue = false;
		this.refreshDisplay();
		return (this);
	},

	// private
	refreshDisplay: function() {
		if (this.rendered === false || this.isExpanded() || this.isSettingValue) {
			return (false);
		}
		var nb = this.internal.getCount();
		var selectedValue = '';
		this.internal.each(function(item, index, length) {
			selectedValue = item[this.displayField];
		}, this);
		var text = '';
		if (nb > 0) {
			this.triggers[0].show();
			if (nb == 1) {
				text = selectedValue;
				this.el.removeClass(this.emptyClass);
				this.setRawValue(text);
				return (true);
			} else {
				text = nb + ' item' + (nb > 1 ? 's' : '') + ' selected';
			}
		} else {
			this.triggers[0].hide();
			text = 'Select item' + (this.enableMultiSelect ? '(s)' : '') + '...';
		}
		this.emptyText = text;
		this.clearValue();
		return (true);
	}
};
