/* ************************************************************************
   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.
************************************************************************ */
qx.Class.define( "wizard.PropertyBoundWizardStep", {

    extend : wizard.WizardStep,
    
    construct : function(id, title, description, view, actionIds, propertyName, bindingOptions) {
        this.base(arguments, id, title, description, view, actionIds);
        this.initPropertyName(propertyName);
        this.initBindingOptions(bindingOptions);
        this.getView().bind(propertyName, this, "state", bindingOptions);
    },
    
    
    
    properties : {
        
        propertyName : {
            deferredInit : true,
            check : "String"
        },

        bindingOptions : {
            deferredInit : true,
            check : "Map"
        }

    }

});