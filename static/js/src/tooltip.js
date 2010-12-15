/**
 * BeeCombo tooltip.
 *
 * @author
 * @version
 */
Ext.ux.BeeCombo = Ext.applyIf(Ext.ux.BeeCombo, {
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
		this.tooltipTitle = ' ';
		this.tooltipContent = ' ';
		this.internal.each(function(item, index, length) {
			nb = length;
			var value = item[this.displayField];
			if (Ext.isDefined(value) === false) {
				value = item[this.valueField];
			}
			this.tooltipContent += ' - ' + value + '<br />';
		}, this);
		if (nb == 0) {
			return (false);
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