var simpleArrayData = ["toto", "titi", "tata"]

var arrayData = [[1, "toto"], [2, "titi"], [3, "tata"]];

var objectData = [
    {id:1, name:"toto"}
    ,{id:2, name:"titi"}
    ,{id:3, name:"tata"}
];

Ext.onReady(function() {

		Ext.QuickTips.init();

    new Ext.form.ComboBox({
        store:simpleArrayData
    }).render("combo1");

    new Ext.ux.BeeCombo({
        store:simpleArrayData
    }).render("combo2");

    /*******************************************************************/
    /*******************************************************************/
    /*******************************************************************/

    var combo3 = new Ext.form.ComboBox({
        store:arrayData
    }).render("combo3");

    combo3.setValue(1);

    var combo4 = new Ext.ux.BeeCombo({
        store:arrayData
    }).render("combo4");

    combo4.setValue(1);

    /*******************************************************************/
    /*******************************************************************/
    /*******************************************************************/

    var combo5 = new Ext.form.ComboBox({
        displayField:"name"
        ,valueField:"id"
        ,mode:"remote"
        ,triggerAction:"all"
        ,pageSize:2
        ,store:new Ext.data.Store({
            // autoLoad:true
            reader:new Ext.data.JsonReader({}, ["id", "name"])
            ,proxy:new Ext.ux.data.PagingMemoryProxy(objectData)
        })
    }).render("combo5");

    combo5.store.load();

		var combo6 = new Ext.ux.BeeCombo({
        displayField:"name"
        ,valueField:"id"
        ,mode:"remote"
        ,triggerAction:"all"
        ,pageSize:2
        ,store:new Ext.data.Store({
            // autoLoad:true
            reader:new Ext.data.JsonReader({}, ["id", "name"])
            ,proxy:new Ext.ux.data.PagingMemoryProxy(objectData)
        })
    }).render("combo6");

    combo6.store.load();

    // combo3.setValue(1);

    // var combo6 = new Ext.ux.BeeCombo({
    //     store:arrayData
    // }).render("combo6");

    // combo4.setValue(1);

    /*******************************************************************/
    /*******************************************************************/
    /*******************************************************************/

    // var combo5 = new Ext.ux.BeeCombo({
    //     displayField:"name"
    //     ,valueField:"id"
    //     ,triggerAction:"all"
    //     ,store:new Ext.data.JsonStore({
    //         url:"php/data.php"
    //         ,autoLoad:true
    //         ,fields:["id", "name"]
    //     })
    // }).render("combo5");
    // 
    // combo5.setValue(1);

});