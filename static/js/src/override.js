// private {{classname}} override.
Ext.apply({{classname}}, {
	// private
	beforeBlur: function() {
		{{classname}}.superclass.beforeBlur.call(this);
		this.refreshDisplay();
	},

	// private
	getTrigger : function(index){
		return this.triggers[index];
	},

	// private
	afterRender: function(){
		{{classname}}.superclass.afterRender.call(this);
		var triggers = this.triggers,
		i = 0,
		len = triggers.length;
		for(; i < len; ++i){
			if(this['hideTrigger' + (i + 1)]){
				triggers[i].hide();
			}
		}
	},

	setReadOnly: function(readOnly) {
		if (readOnly != this.readOnly){
			this.readOnly = readOnly;
			if (this.rendered) {
				if (this.readOnly) {
					this.el.dom.readOnly = true;
					this.el.addClass('x-trigger-noedit');
				} else {
					if (!this.editable) {
						this.el.dom.readOnly = true;
						this.el.addClass('x-trigger-noedit');
					} else {
						this.el.dom.readOnly = false;
						this.el.removeClass('x-trigger-noedit');
					}
				}
				this.triggers[0].setReadOnly(this.readOnly);
				this.triggers[1].setReadOnly(this.readOnly);
			}
		}
	},

	// private
	initTrigger : function(){
		var ts = this.trigger.select('.x-form-trigger', true),
		triggerField = this;

		ts.each(function(t, all, index){
			var triggerIndex = 'Trigger'+(index+1);
			t.hide = function() {
				var w = triggerField.wrap.getWidth();
				if (triggerField.width) {
					w = triggerField.width;
				}
				this.dom.style.display = 'none';
				var width = w - triggerField.trigger.getWidth();
				triggerField.el.setWidth(width);
				triggerField['hidden' + triggerIndex] = true;
			};
			t.show = function() {
				if (this.readOnly) {
					return;
				}
				var w = triggerField.wrap.getWidth();
				if (triggerField.width) {
					w = triggerField.width;
				}
				this.dom.style.display = '';
				var width = w - triggerField.trigger.getWidth();
				triggerField.el.setWidth(width);
				triggerField['hidden' + triggerIndex] = false;
			};
			t.setReadOnly = function(readOnly) {
				this.readOnly = readOnly;
				if (this.readOnly) {
					this.hide();
				}
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
		{{classname}}.superclass.onDestroy.call(this);
	}
});