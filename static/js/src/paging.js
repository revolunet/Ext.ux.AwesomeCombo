/**
 * BeeCombo paging.
 *
 * @author
 * @version
 */
Ext.ux.BeeCombo = Ext.apply(Ext.ux.BeeCombo, {
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
		if (this.pageSize < 1) {
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