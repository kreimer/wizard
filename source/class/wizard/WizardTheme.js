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
