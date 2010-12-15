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
	 * {@link Ext.ux#tpl tpl} config.
	 * Defaults to "div.beecombo".
	 */
	itemSelector: 'div.beecombo-item',

	/**
	 * @cfg {Int} pageSize
	 * If {@link Ext.ux#paging paging} config parameter value is a number,
	 * pageSize will be override with {@link Ext.ux#paging paging} value.
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
		this.on('beforeselect', this.onBeforeSelect, this);
		this.on('afterrender', this.onAfterRender, this);
		this.on('expand', this.onExpand, this);
		this.on('collapse', this.onCollapse, this);
	},

	uncheckRecord: function(record) {
		if (this.enableMultiSelection !== true) {
			this.uncheckCurrentValue();
			this.clearValue();
		}
		record.set('checked', 'unchecked');
		record.commit(true);
	},

	checkRecord: function(record) {
		if (this.enableMultiSelection !== true) {
			this.uncheckCurrentValue();
		}
		var index = record.get(this.valueField).toString();
		this.internal[index][this.valueField] = record.get(this.valueField);
		this.internal[index][this.displayField] = record.get(this.displayField);
		record.set('checked', 'checked');
		record.commit(true);
		if (this.enableMultiSelection !== true) {
			this.setValue(this.internal);
		}
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
		this.refreshDisplay();
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
		var nb = 0;
		var selectedValue = '';
		for (i in this.internal) {
			if (Ext.isEmpty(i) == false &&
				this.internal[i] !== false) {
				nb = nb + 1;
				selectedValue = this.internal[i];
			}
		}
		if (this.isExpand == false) {
			if (nb > 0) {
				if (nb == 1) {
					this.emptyText = selectedValue;
				} else {
					this.emptyText = nb + ' ' + this.displayName + (nb > 1 ? 's' : '') + ' selected';
				}
			} else {
				this.emptyText = this.hasEmptyText || 'Select ' + this.displayName + '(s)...';
			}
		}
	}
});

Ext.reg('beecombo', Ext.ux.BeeCombo);

/**
 * BeeCombo events.
 *
 * @author Revolunet
 * @version 0.1
 */
Ext.apply(Ext.ux.BeeCombo, {
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
	},

	// private
	onExpand: function(combo) {
		if (this.hasPageTbButton == false) {
			this.hasPageTbButton = true;
			this.customizePageToolbar();
		}
		if (this.getRawValue() == this.getInternalValue()) {
			if (this.paging === false) {
				this.getStore().clearFilter();
			}
		}
	},

	// private
	onCollapse: function(combo) {
		this.setInternalValue();
	}
});

/**
 * BeeCombo tooltip.
 *
 * @author Revolunet
 * @version 0.1
 */
Ext.apply(Ext.ux.BeeCombo, {
	// private
	getTooltip: function() {
		if (Ext.isObject(this.tooltip) === false) {
			this.tooltip = new Ext.ToolTip({
				title: ' ',
				html: ' ',
				target: this.getEl(),
				listeners: {
					scope: this,
					beforeshow: this.onTooltipShow,
					afterrender: this.onTooltipShow
				}
			});
		}
		return (this.tooltip);
	},

	// private
	onTooltipShow: function() {
		if (this.rendered === false ||
			this.getTooltip().rendered === false) {
			return (false);
		}
		var nb = 0;
		this.tooltipContent = ' ';
		for (var i in this.internal) {
			if (Ext.isEmpty(i) == false && this.internal[i] !== false) {
				this.tooltipContent += ' - ' + this.internal[i] + '<br />';
				nb += 1;
			}
		}
		if (nb == 0) {
			this.getTooltip().hide();
		}
		this.tooltipTitle = nb.toString() + ' item' + (nb > 1 ? 's' : '') + ' selected: ';
		if (this.fireEvent('beforetooltipshow', this, this.getTooltip(),
			this.tooltipTitle, this.tooltipContent) === false) {
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
Ext.apply(Ext.ux.BeeCombo, {
	// private
	customizePageToolbar: function() {
		this.pageTb.get(0).setIconClass('icon-arrow-stop-180');
		this.pageTb.get(1).setIconClass('icon-arrow-180');
		this.pageTb.get(7).setIconClass('icon-arrow');
		this.pageTb.get(8).setIconClass('icon-arrow-stop');
		this.pageTb.get(10).setIconClass('icon-arrow-circle-double-135');
		this.pageTb.add('-');
		this.pageTb.addButton({
			tooltip: 'Unselect value',
			iconCls: 'icon-tick-red',
			listeners: {
				scope: this,
				click: this.onPageTbButtonUncheck
			}
		});
		if (this.paging === false) {
			for (var i = 0; i < 12; ++i) {
				this.pageTb.get(i).hide();
			}
			this.getStore().load();
		}
		this.pageTb.doLayout();
	},

	// private
	onPageTbButtonUncheck: function(button) {
		this.uncheckCurrentValue();
	}
});

