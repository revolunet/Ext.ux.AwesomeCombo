/**
 * Ext.ux.BeeCombo format.
 *
 * @author
 * @version
 */
Ext.ux.BeeCombo = Ext.applyIf(Ext.ux.BeeCombo, {
	// private
	setStringValue: function(value) {
		var values = value.split(this.formatSeparator);
		var length = values.length;
		for (var i = 0; i < length; ++i) {
			var index = values[i].toString();
			this.internal[index] = {};
			this.internal[index][this.valueField] = values[i];
			this.findAndCheckRecord(this.internal[index], values[i]);
			if (this.enableMultiSelect !== true) {
				break;
			}
		}
	},

	// private
	setArrayValue: function(value) {
		for (var i in value) {
			if (i == this.valueField) {
				this.setObjectValue(value);
			} else if (Ext.isObject(value[i])) {
				this.setObjectValue(value[i]);
			} else if (Ext.isArray(value[i])) {
				this.setArrayValue(value[i]);
			}
			if (this.enableMultiSelect !== true) {
				break;
			}
		}
	},

	// private
	setObjectValue: function(value) {
		if (Ext.isDefined(value[this.valueField])) {
			var index = value[this.valueField].toString();
			this.internal[index] = {};
			this.internal[index][this.valueField] = value[this.valueField];
			this.findAndCheckRecord(this.internal[index], value[this.valueField]);
			if (Ext.isDefined(value[this.displayField])) {
				this.internal[index][this.displayField] = value[this.displayField];
			}
		}
	},

	// private
	getStringValue: function() {
		var values = new Array();
		for (i in this.internal) {
			if (Ext.isString(i) && Ext.isDefined(this.internal[i][this.valueField])) {
				values.push(i.toString());
				if (this.enableMultiSelect !== true) {
					break;
				}
			}
		}
		return (values.join(this.formatSeparator));
	},

	// private
	getObjectValue: function() {
		var values = new Array();
		for (i in this.internal) {
			if (Ext.isString(i) && Ext.isDefined(this.internal[i][this.valueField])) {
				var value = {};
				value[this.valueField] = i;
				if (Ext.isDefined(this.internal[i][this.displayField])) {
					value[this.displayField] = this.internal[i][this.displayField];
				}
				values.push(value);
				if (this.enableMultiSelect !== true) {
					break;
				}
			}
		}
		return (values);
	}
});

Ext.ux.BeeCombo = Ext.extend(Ext.form.ComboBox, Ext.ux.BeeCombo);
Ext.reg('beecombo', Ext.ux.BeeCombo);
