// private BeeCombo paging.
{{classname}} = Ext.apply({{classname}}, {
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