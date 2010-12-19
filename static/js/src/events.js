// private {{classname}} events.
{{classname}} = Ext.apply({{classname}}, {
	// private
	onBeforeSelect: function(combo, record, index) {
		if (this.isChecked(record) && this.enableMultiSelect) {
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
			if (this.enableMultiSelect !== true) {
				this.collapse();
				this.refreshDisplay();
			}
			this.fireEvent('entrycheck', this, record, index);
		}
		this.fireEvent('select', this, record, index);
		return (false);
	},

	// private
	onAfterRender: function(cmp) {
		if (this.enableTooltip) {
			this.getTooltip();
		}
		if (this.disableClearButton) {
			this.triggers[0].hide();
		}
		this.refreshDisplay();
	},

	// private
	onFieldKeyUp: function(textfield, event) {
		if (this.enableMultiSelect === false) {
			var rawValue = this.getRawValue();
			if (rawValue.length == 0) {
				this.reset();
			}
		}
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
	onStoreLoad: function(store, records, options) {
		for (i in records) {
			if (Ext.isObject(records[i])) {
				records[i].set('checked',
					(this.isChecked(records[i]) ? 'checked' : 'unchecked'));
				records[i].commit(true);
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