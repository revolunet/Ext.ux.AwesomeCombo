var arrayData = ["John", "Mary", "Steve"]

var objectData = [
    {id:1, name:"John"}
    ,{id:2, name:"Mary"}
    ,{id:3, name:"Steve"}
];

Ext.onReady(function() {

    Ext.QuickTips.init();

    /*******************************************************************/
    /**** SIMPLE *******************************************************/
    /*******************************************************************/

    new Ext.form.ComboBox({
        store:arrayData
    }).render("combo1");

    new Ext.ux.BeeCombo({
        store:arrayData
    }).render("combo2");

    /*******************************************************************/
    /**** MULTIDIMENSIONAL ARRAY ***************************************/
    /*******************************************************************/

    var combo3 = new Ext.form.ComboBox({
        store:Ext.exampledata.states,
        width:100
    }).render("combo3");

    combo3.setValue("NY");

    var combo4 = new Ext.ux.BeeCombo({
        store:Ext.exampledata.states,
        width:100
    }).render("combo4");

    combo4.setValue("NY");

    /*******************************************************************/
    /**** LOCAL PAGING STORE *******************************************/
    /*******************************************************************/

    var combo5 = new Ext.form.ComboBox({
        displayField:"name"
        ,valueField:"id"
        ,triggerAction:"all"
        ,pageSize:5
        ,store:new Ext.data.Store({
            reader:new Ext.data.ArrayReader({}, ["id", "name"])
            ,proxy:new Ext.ux.data.PagingMemoryProxy(Ext.exampledata.states)
        })
    }).render("combo5");

	var combo6 = new Ext.ux.BeeCombo({
        triggerAction:"all"
        ,pageSize:5
        ,store:Ext.exampledata.states
    }).render("combo6");

    /*******************************************************************/
    /**** AJAX LOAD ****************************************************/
    /*******************************************************************/

    var combo7 = new Ext.form.ComboBox({
        displayField:"name"
        ,valueField:"id"
        ,triggerAction:"all"
        ,store:new Ext.data.JsonStore({
            url:"php/data.php"
            ,fields:["id", "name"]
        })
    }).render("combo7");

    var combo8 = new Ext.ux.BeeCombo({
        displayField:"name"
        ,valueField:"id"
        ,triggerAction:"all"
        ,store:new Ext.data.JsonStore({
            url:"php/data.php"
            ,fields:["id", "name"]
        })
    }).render("combo8");

    /*******************************************************************/
    /**** XTYPE STORE **************************************************/
    /*******************************************************************/

    var combo9 = new Ext.form.ComboBox({
        displayField:"name"
        ,valueField:"id"
        ,triggerAction:"all"
        ,store:{
            xtype:"jsonstore"
            ,url:"php/data.php"
            ,fields:["id", "name"]
        }
    }).render("combo9");

    var combo10 = new Ext.ux.BeeCombo({
        displayField:"name"
        ,valueField:"id"
        ,triggerAction:"all"
        ,store:{
            xtype:"jsonstore"
            ,url:"php/data.php"
            ,fields:["id", "name"]
        }
    }).render("combo10");

});