/**
 * BeeCombo events.
 *
 * @author
 * @version
 */
Ext.ux.BeeCombo = Ext.applyIf(Ext.ux.BeeCombo, {
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
			this.defaultCheckRecords();
			this.customizePageToolbar();
		}
		/*
		if (this.getRawValue() == this.getInternalValue()) {
			if (this.pageSize) {
				this.getStore().clearFilter();
			}
		}
		*/
	},

	// private
	onCollapse: function(combo) {
		this.refreshDisplay();
	},

	// private
	onStoreBeforeLoad: function(store, options) {
		/*
		if (this.getInternalValue() == this.combo.getRawValue()) {
			if (this.pageSize) {
				this.getStore().setBaseParam('query', '');
			}
		}
		*/
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