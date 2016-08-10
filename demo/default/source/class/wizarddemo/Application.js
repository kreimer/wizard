/* ************************************************************************
   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.
************************************************************************ */

/**
 * This is the main application class of your custom application "wizarddemo"
 *
 * @asset(wizarddemo/*)
 */
qx.Class.define("wizarddemo.Application", {
    
    extend: qx.application.Standalone,
    
    
    
    members: {

        main: function () {
            this.base(arguments);
//            if (qx.core.Environment.get("qx.debug")) {
                qx.log.appender.Native;
                qx.log.appender.Console;
//            }

            var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            this.getRoot().add(container, { edge : 0 });
            var showWizardButton = new qx.ui.form.Button("show wizard");
            showWizardButton.addListener("execute", function(e) {
                this._showWizard();
            }, this);
            container.add(showWizardButton);
        },
        
        
        _showWizard : function() {
            var wizard1 = new wizard.Wizard();
            wizard1.setSteps(this._createSteps());
            wizard1.getCommonAction("next").set({ highlightWhenAvailable : true });
            var ww = new qx.ui.window.Window("windowed wizard");
            ww.setLayout(new qx.ui.layout.Dock());
            ww.add(wizard1);
            wizard1.addListener("end", function(e) {
                ww.close();
            }, this);
            wizard1.addListener("cancel", function(e) {
                ww.close();
            }, this);
            this.getRoot().add(ww);
            ww.open();
            ww.center();
            ww.maximize();
        },
        
        
        
        _createSteps : function() {
            var valid2StateDoneConverter = function(data, model, source, target) {
                if(data) {
                    return "done";
                } else {
                    return "to-be-done";
                }
            };
            var valid2StateCommitedConverter = function(data, model, source, target) {
                if(data) {
                    return "committed";
                } else {
                    return "to-be-done";
                }
            };
            var steps = new qx.data.Array();
            var view1 = new wizarddemo.VerySimpleView("this is step1 view");
            var step1 = new wizard.PropertyBoundWizardStep(
                "step1", "first step", "Welcome to step 1", view1,
                ["next", "cancel"], "valid", { converter : valid2StateCommitedConverter}
            );
            steps.push(step1);
            var view2 = new wizarddemo.VerySimpleView("this is step2 view");
            var step2 = new wizard.PropertyBoundWizardStep(
                "step2", "second step", "Welcome to step 2", view2,
                ["next", "cancel"], "valid", { converter : valid2StateDoneConverter}
            );
            steps.push(step2);
            
//            var view3 = new wizarddemo.VerySimpleView("This is a final step, generally used to show some result after the transaction is commited");
//            var step3 = new wizard.PropertyBoundWizardStep(
//                "step3", "third step", "Welcome to step 3", view3,
//                ["end"], "valid", { converter : valid2StateConverter}
//            ).set({ finalStep : true });
//            steps.push(step3);
            var view3 = new qx.ui.basic.Label("This is a final step, generally used to show some result after the transaction is commited");
            var step3 = new wizard.WizardStep("step3", "third step", "Welcome to step 3", view3, ["end"] ).set({ finalStep : true });
            steps.push(step3);
            return steps;
        }
        
    }
});
