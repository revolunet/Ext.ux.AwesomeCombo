// private {{classname}} override.
Ext.apply({{classname}}, {
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
		{{classname}}.superclass.onDestroy.call(this);
	}
});