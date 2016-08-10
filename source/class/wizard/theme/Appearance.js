/* ************************************************************************
   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.
************************************************************************ */
qx.Theme.define("wizard.theme.Appearance", {
    
    extend: qx.theme.indigo.Appearance,
    
    
    
    appearances: {
        
        "wizard" : {
            style : function(states) {
                return {
                };
            }
        },
        
        "wizard/header" : {
            style : function(states) {
                return {
                    backgroundColor : "white",
                    minHeight : 48,
                    maxHeight : 48
                };
            }
        },
        
        "wizard/description" : {
            style : function(states) {
                return {
                    font : qx.bom.Font.fromConfig({
                        size : 14
                    }),
                    textColor : "blue",
                    alignX : "left"
                };
            }
        },
        
        "wizard/step-list" : {
            style : function(states) {
                return {
                    backgroundColor : "white",
                    minWidth : 256,
                    maxWidth : 256,
                    paddingTop : 64,
                    paddingLeft: 24,
                    paddingRight : 16
                };
            }
        },
        
        "wizard/footer" : {
            style : function(states) {
                return {
                    backgroundColor : "white",
                    minHeight : 64,
                    maxHeight : 64,
                    paddingRight : 32
                };
            }
        },
        
        "wizard/view-pane" : {
            style : function(states) {
                return {
                    backgroundColor : "white"
                };
            }
        },
        
        
        
        "wizard-step-item" : {
            style : function(states) {
                return {
                    padding : 4,
                    font : qx.bom.Font.fromConfig({
                        size : (states.selected ? 16 : 13)
                    }),
                    textColor : (states.committed ? "black" : (states.future ? "#c0c0f0" : "blue"  )),
                    alignX : "left",
                    backgroundColor : (states.hovered && states.accesible) ? "wizard-orange" : (states.selected ? "#f0f0ff" : "white"),
                    cursor : ((states.accesible && !states.selected)? "pointer" : null)
                };
            }
        }
        
    }
    
});