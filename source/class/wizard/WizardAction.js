qx.Class.define( "wizard.WizardAction", {

    extend : qx.core.Object,
    
    
    construct : function(id, name, predicate, action) {
        this.initId(id);
        this.initName(name);
        this.initPredicate(predicate);
        this.initAction(action);
    },
    
    
    
    properties : {
        
        id : {
            deferredInit : true,
            check : "String"
        },

        name : {
            deferredInit : true,
            check : "String"
        },
        
        
        predicate : {
            deferredInit : true,
            check : "Function"
        },
        
        action : {
            deferredInit : true,
            check : "Function"
        },
        
        highlightWhenAvailable : {
            init : false,
            check : "Boolean",
            event : "changeHighlightWhenAvailable"
        }
        
    }
    
});
