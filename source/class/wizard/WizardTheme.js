/* ************************************************************************
   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.
************************************************************************ */
qx.Class.define("wizard.WizardTheme", {
    
    defer : function() {
        wizard.ContribTheme.registerContributionTheme({
            decoration : wizard.theme.Decoration,
            appearance : wizard.theme.Appearance,
            color : wizard.theme.Color,
            font : wizard.theme.Font
        });
    }
    
});
