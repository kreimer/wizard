qx.Class.define("wizard.ContribTheme", {
    
    statics : {
        
        registerContributionTheme : function(themes) {
            if(themes) {
                if(themes.font) {
                    qx.theme.manager.Font.getInstance().addListener("changeTheme", qx.lang.Function.bind(function(e) {
                        qx.log.Logger.debug("change font theme: " + e.getData());
                        qx.Theme.include(e.getData(), this.font);
                    }, themes));
                }
                if(themes.icon) {
                    qx.theme.manager.Icon.getInstance().addListener("changeTheme", qx.lang.Function.bind(function(e) {
                        qx.log.Logger.debug("change icon theme: " + e.getData());
                        qx.Theme.include(e.getData(), this.icon);
                    }, themes));
                }
                if(themes.color) {
                    qx.theme.manager.Color.getInstance().addListener("changeTheme", qx.lang.Function.bind(function(e) {
                        qx.log.Logger.debug("change color theme: " + e.getData());
                        qx.Theme.include(e.getData(), this.color);
                    }, themes));
                }
                if(themes.decoration) {
                    qx.theme.manager.Decoration.getInstance().addListener("changeTheme", qx.lang.Function.bind(function(e) {
                        qx.log.Logger.debug("change decoration theme: " + e.getData());
                        qx.Theme.include(e.getData(), this.decoration);
                    }, themes));
                }
                if(themes.appearance) {
                    qx.theme.manager.Appearance.getInstance().addListener("changeTheme", qx.lang.Function.bind(function(e) {
                        qx.log.Logger.debug("change appearance theme: " + e.getData());
                        qx.Theme.include(e.getData(), this.appearance);
                    }, themes));
                }
                if(themes.meta) {
                    qx.theme.manager.Meta.getInstance().addListener("changeTheme", qx.lang.Function.bind(function(e) {
                        qx.log.Logger.debug("change meta theme: " + e.getData());
                        qx.Theme.include(e.getData(), this.meta);
                    }, themes));
                }
                
            }
        }
    }
    
});

