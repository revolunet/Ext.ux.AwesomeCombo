// private BeeCombo tooltip.
{{classname}} = Ext.apply({{classname}}, {
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