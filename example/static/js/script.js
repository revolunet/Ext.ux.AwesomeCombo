Ext.onReady(function() {

    new Ext.form.ComboBox({
        store:["toto", "titi", "tata"]
    }).render("combo1");

    new Ext.form.ComboBox({
        store:["toto", "titi", "tata"]
    }).render("combo2");

});