/* ************************************************************************
   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.
************************************************************************ */
qx.Theme.define("wizarddemo.theme.Appearance", {
    
    extend: qx.theme.modern.Appearance,
    
    appearances: {
        "button" : {
            style : function(states) {
                return {
                    allowShrinkX : false,
                    allowGrowX : true
                };
            }
        },

        "button/label" : {
            alias : "label",
            include : "label",
            style : function(states) {
                return {
                    marginLeft : 0,
                    minWidth : 96,
                    textAlign : "center",
                    backgroundColor : states.disabled ? "#7777ff" : (states.selected ? "wizard-orange" : (states.hovered || states.focused) ? "#2222ff" : "#3333ff"),
                    padding : 8,
                    font : qx.bom.Font.fromConfig({
                        size:14, decoration:((states.hovered ||states.focused) ? "underline" : null)
                    }),
                    textColor : states.selected ? "blue" : (states.hovered ||states.focused) ? "white" : "#f0f0ff",
                    cursor : states.disabled ? null : "pointer"
                };
            }
        }

    }
});