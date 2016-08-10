/* ************************************************************************
   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.
************************************************************************ */
qx.Class.define( "wizard.WizardStep", {

    extend : qx.core.Object,
    
    construct : function(id, title, description, view, actionIds) {
        this.base(arguments);
        this.initId(id);
        this.initTitle(title);
        this.initDescription(description);
        this.initView(view);
        this.initActionIds(actionIds);
        this._actions = new Object();
    },
    
    
    
    properties : {
        
        id : {
            deferredInit : true,
            check : "String"
        },

        title : {
            deferredInit : true,
            check : "String",
            event : "changeTitle"
        },
        
        description : {
            deferredInit : true,
            check : "String",
            event : "changeDescription"
        },
        
        view : {
            deferredInit : true,
            check : "qx.ui.core.Widget",
            event : "changeWidget"
        },
        
        recommended : {
            check : "Boolean",
            init : false,
            event : "changeRecommended"
        },
        
        state : {
            check : [ "to-be-done", "done", "committed" ],
            init : "to-be-done",
            event : "changeState"
        },
        
        actionIds : {
            deferredInit : true,
            check : "Array"
        },
        
        finalStep : {
            check : "Boolean",
            init : false,
            event : "changeFinalStep"
        }

    },
    
    
    
    
    members : {
        
        _actions : null,

        isToBeDone : function() {
            return this.getState()==="to-be-done";
        },

        isDone : function() {
            return this.getState()==="done";
        },
        
        isCommitted : function() {
            return this.getState()==="committed";
        },
        
        commit : function() {
            this.setState("committed");
        },
        
        setDone : function(done) {
            this.setState(done ? "done" : "to-be-done");
        },
        
        getAction : function(actionId) {
            return this._actions[actionId];
        },
        
        setAction : function(actionId, action) {
            this._actions[actionId] = action;
        }

    }

});