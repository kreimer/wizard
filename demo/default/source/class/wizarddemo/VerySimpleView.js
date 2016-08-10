/* ************************************************************************
   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.
************************************************************************ */
qx.Class.define("wizarddemo.VerySimpleView", {
    
    extend : qx.ui.container.Composite,
    
    construct : function(text) {
        this.base(arguments, new qx.ui.layout.VBox(4));
        this.initText(text||null);
        this._initUI();
    },
    
    
    properties : {
        
        text : {
            deferredInit : true
        },

        valid : {
            init : false,
            check : "Boolean",
            event : "changeValid"
        }
        
    },
    
    
    
    members : {
        
        _initUI : function() {
            var label = new qx.ui.basic.Label(this.getText());
            this.add(label);
            var checkbox = new qx.ui.form.CheckBox("chek to make this view valid");
            checkbox.bind("value", this, "valid");
            this.add(checkbox);
        }
    }
    
});
