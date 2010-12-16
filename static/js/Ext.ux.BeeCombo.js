/**
 * Advanced and lightweight combobox
 * with multi-selection options.
 *
 * @author Revolunet
 * @version 0.1
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
		var minListWidth = this.minListWidth;
		if (this.pageSize && minListWidth < 222) {
			minListWidth = 222;
		}
		Ext.apply(this, Ext.apply(this.initialConfig, {
			minListWidth: minListWidth
		}));
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
		var success = this.internal.containsKey(index);
		if (success) {
			var item = this.internal.get(index);
			item[this.displayField] = record.get(this.displayField);
		}
		return (success);
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


/**
 * BeeCombo override.
 *
 * @author Revolunet
 * @version 0.1
 */
Ext.apply(Ext.ux.BeeCombo, {
	// private
	beforeBlur: function() {
		this.refreshDisplay();
	},

	// private
	getTrigger : function(index){
		return this.triggers[index];
	},

	// private
	afterRender: function(){
		Ext.ux.BeeCombo.superclass.afterRender.call(this);
		var triggers = this.triggers,
		i = 0,
		len = triggers.length;

		for(; i < len; ++i){
			if(this['hideTrigger' + (i + 1)]){
				triggers[i].hide();
			}

		}
	},

	// private
	initTrigger : function(){
		var ts = this.trigger.select('.x-form-trigger', true),
		triggerField = this;

		ts.each(function(t, all, index){
			var triggerIndex = 'Trigger'+(index+1);
			t.hide = function(){
				var w = triggerField.wrap.getWidth();
				this.dom.style.display = 'none';
				triggerField.el.setWidth(w-triggerField.trigger.getWidth());
				triggerField['hidden' + triggerIndex] = true;
			};
			t.show = function(){
				var w = triggerField.wrap.getWidth();
				this.dom.style.display = '';
				triggerField.el.setWidth(w-triggerField.trigger.getWidth());
				triggerField['hidden' + triggerIndex] = false;
			};
			this.mon(t, 'click', this['on'+triggerIndex+'Click'], this, {
				preventDefault:true
			});
			t.addClassOnOver('x-form-trigger-over');
			t.addClassOnClick('x-form-trigger-click');
		}, this);
		this.triggers = ts.elements;
	},

	// private
	getTriggerWidth: function(){
		var tw = 0;
		Ext.each(this.triggers, function(t, index){
			var triggerIndex = 'Trigger' + (index + 1),
			w = t.getWidth();
			if(w === 0 && !this['hidden' + triggerIndex]){
				tw += this.defaultTriggerWidth;
			}else{
				tw += w;
			}
		}, this);
		return tw;
	},

	// private
	onDestroy : function() {
		Ext.destroy(this.triggers);
		Ext.ux.BeeCombo.superclass.onDestroy.call(this);
	}
});

/**
 * BeeCombo events.
 *
 * @author Revolunet
 * @version 0.1
 */
Ext.ux.BeeCombo = Ext.apply(Ext.ux.BeeCombo, {
	// private
	onBeforeSelect: function(combo, record, index) {
		if (this.isChecked(record)) {
			if (this.fireEvent('beforeentryuncheck', this, record, index) === false) {
				return (false);
			}
			this.uncheckRecord(record);
			this.fireEvent('entryuncheck', this, record, index);
		} else {
			if (this.fireEvent('beforeentrycheck', this, record, index) === false) {
				return (false);
			}
			this.checkRecord(record);
			this.fireEvent('entrycheck', this, record, index);
		}
		return (false);
	},

	// private
	onAfterRender: function(cmp) {
		if (this.enableTooltip) {
			this.getTooltip();
		}
		this.refreshDisplay();
	},

	// private
	onExpand: function(combo) {
		if (this.hasPageTbButton == false) {
			this.hasPageTbButton = true;
			this.defaultCheckRecords();
			this.customizePageToolbar();
		}
	},

	// private
	onStoreBeforeLoad: function(store, options) {
		//
	},

	// private
	onStoreLoad: function(store, records, options) {
		for (i in records) {
			if (Ext.isObject(records[i])) {
				if (this.isChecked(records[i])) {
					records[i].set('checked', 'checked');
					records[i].commit(true);
				} else {
					records[i].set('checked', 'non-checked');
					records[i].commit(true);
				}
			}
		}
	},

	// private
	onInternalAdd: function(index, obj, key) {
		var record = this.findRecord(this.valueField, key);
		if (Ext.isObject(record)) {
			obj[this.displayField] = record.get(this.displayField);
			record.set('checked', 'checked');
			record.commit(true);
		}
		this.refreshDisplay();
	},

	// private
	onInternalClear: function() {
		this.getStore().each(function(record) {
			record.set('checked', 'unchecked');
			record.commit(true);
		});
		this.refreshDisplay();
	},

	// private
	onInternalRemove: function(obj, key) {
		var record = this.findRecord(this.valueField, key);
		if (Ext.isObject(record)) {
			record.set('checked', 'unchecked');
			record.commit(true);
		}
		this.refreshDisplay();
	}
});

/**
 * BeeCombo tooltip.
 *
 * @author Revolunet
 * @version 0.1
 */
Ext.ux.BeeCombo = Ext.apply(Ext.ux.BeeCombo, {
	// private
	getTooltip: function() {
		if (Ext.isDefined(this.itooltip) === false &&
			Ext.QuickTips.isEnabled()) {
			this.itooltip = new Ext.ToolTip({
				title: ' ',
				html: ' ',
				target: this.getId(),
				listeners: {
					scope: this,
					show: this.onTooltipShow
				}
			});
		}
		return (this.itooltip);
	},

	// private
	generateTooltipContent: function() {
		this.tooltipTitle = ' ';
		this.tooltipContent = ' ';
		this.internal.each(function(item, index, length) {
			var value = item[this.displayField];
			if (Ext.isDefined(value) === false) {
				value = item[this.valueField];
			}
			this.tooltipContent += ' - ' + value.toString() + '<br />';
		}, this);
		var len = this.internal.getCount();
		if (len) {
			this.tooltipTitle = len.toString() + ' item' +
				(len > 1 ? 's' : '') + ' selected: ';
		} else {
			return (false);
		}
		return (true);
	},

	// private
	onTooltipShow: function() {
		if (this.getTooltip().rendered == false) {
			return (false);
		}
		if (this.rendered === false) {
			this.getTooltip().hide();
			return (false);
		}
		if (this.generateTooltipContent() == false) {
			this.getTooltip().hide();
			return (false);
		}
		if (this.fireEvent('beforetooltipshow', this, this.getTooltip(),
			this.tooltipTitle, this.tooltipContent) == false) {
			this.getTooltip().hide();
			return (false);
		}
		this.getTooltip().setTitle(this.tooltipTitle);
		this.getTooltip().update(this.tooltipContent);
		this.fireEvent('tooltipshow', this, this.getTooltip(),
			this.tooltipTitle, this.tooltipContent);
	}
});

/**
 * BeeCombo paging.
 *
 * @author Revolunet
 * @version 0.1
 */
Ext.ux.BeeCombo = Ext.apply(Ext.ux.BeeCombo, {
	// private
	customizePageToolbar: function() {
		if (this.pageSize) {
			this.pageTb.get(0).setIconClass('icon-arrow-stop-180');
			this.pageTb.get(1).setIconClass('icon-arrow-180');
			this.pageTb.get(7).setIconClass('icon-arrow');
			this.pageTb.get(8).setIconClass('icon-arrow-stop');
			this.pageTb.get(10).setIconClass('icon-arrow-circle-double-135');
		}
	}
});

/**
 * Ext.ux.BeeCombo format.
 *
 * @author Revolunet
 * @version 0.1
 */
Ext.ux.BeeCombo = Ext.apply(Ext.ux.BeeCombo, {
	// private
	setStringValue: function(value) {
		var values = value.split(this.formatSeparator);
		var length = values.length;
		for (var i = 0; i < length; ++i) {
			var index = values[i].toString();
			if (Ext.isEmpty(index) === false) {
				var item = {};
				item[this.valueField] = values[i];
				this.internal.add(index, item);
				if (this.enableMultiSelect !== true) {
					break;
				}
			}
		}
	},

	// private
	setArrayValue: function(value) {
		var success = false;
		for (var i in value) {
			if (i == this.valueField) {
				success = this.setObjectValue(value);
			} else if (Ext.isObject(value[i])) {
				success = this.setObjectValue(value[i]);
			} else if (Ext.isArray(value[i])) {
				success = this.setArrayValue(value[i]);
			}
			if (this.enableMultiSelect !== true && success) {
				break;
			}
		}
		return (success);
	},

	// private
	setObjectValue: function(value) {
		if (Ext.isDefined(value[this.valueField])) {
			var index = value[this.valueField].toString();
			if (Ext.isEmpty(index) === false) {
				var item = {};
				item[this.valueField] = value[this.valueField];
				this.internal.add(index, item);
				if (Ext.isDefined(value[this.displayField])) {
					this.internal.get(index)[this.displayField] = value[this.displayField];
				}
				return (true);
			}
		}
		return (false);
	},

	// private
	getStringValue: function() {
		var values = new Array();
		this.internal.eachKey(function(key, item) {
			if (this.enableMultiSelect) {
				values.push(key);
			} else if (values.length == 0) {
				values.push(key);
			}
		}, this);
		return (values.join(this.formatSeparator));
	},

	// private
	getObjectValue: function() {
		var values = new Array();
		this.internal.eachKey(function(key, item) {
			if (this.enableMultiSelect) {
				values.push(item);
			} else if (values.length == 0) {
				values.push(item);
			}
		}, this);
		return (values);
	}
});

Ext.ux.BeeCombo = Ext.extend(Ext.form.ComboBox, Ext.ux.BeeCombo);

Ext.reg('beecombo', Ext.ux.BeeCombo);


