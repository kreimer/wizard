/* ************************************************************************
   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.
************************************************************************ */

/**
 * @require(wizard.WizardTheme)
 */
qx.Class.define("wizard.Wizard", {
    
    extend : qx.ui.core.Widget,
    
    construct : function() {
        this.base(arguments);
        this._setLayout(new qx.ui.layout.Dock().set({ sort : "x" }));
        this._add(this.getChildControl("header"), { edge : "north" });
        this._add(this.getChildControl("step-list"), { edge : "west" });
        this._add(this.getChildControl("footer"), { edge : "south" });
        this._add(this.getChildControl("view-pane"), { edge : "center" });
        this.initSteps(new qx.data.Array());
        this._initCommonActions();
        this._actionButtons = new Object();

    },
    
    
    
    events : {
        
        "end" : "qx.event.type.Event",

        "cancel" : "qx.event.type.Event"
        
    },
    
    
    
    properties : {
        
        appearance : {
            refine : true,
            init : "wizard"
        },

        steps : {
            deferredInit : true,
            check : "qx.data.Array",
            event : "changeSteps",
            apply : "_applySteps"
        },

        index : {
            check : "Integer",
            nullable : true,
            init : null,
            event : "changeIndex",
            apply : "_applyIndex"
        }
        
    },
    
    
    
    members : {
        
        _stepsChangeListenerId : null,

        _stepStateListenerIds : null,

        _viewerScrollPane : null,

        _viewerBody : null,

        _commonActions : null,
        
        _actionButtons : null,



        getCommonAction : function(actionId) {
            return this._commonActions[actionId] || null;
        },
        
        setCommonAction : function(actionId, action) {
            this._commonActions[actionId] = action;
        },



        end : function() {
            this.fireEvent("end");
        },



        cancel : function() {
            this.fireEvent("cancel");
        },



        _createChildControlImpl: function (id, hash) {
            var control;
            switch (id) {
                case "header" :
                    control = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                    break;
                    
                case "description" :
                    control = new qx.ui.basic.Label();
                    this.getChildControl("header").add(control);
                    break;
                    
                case "step-list" :
                    control = new qx.ui.container.Composite(new qx.ui.layout.VBox(8).set({ alignX : "center" }));
                    break;
                    
                case "footer" :
                    control = new qx.ui.container.Composite(new qx.ui.layout.HBox(8, "right"));
                    break;
                    
                case "view-pane" :
                    control = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
                    control.addListener("resize", function(e) {
                        var bounds = e.getCurrentTarget().getBounds();
                        this._viewerScrollPane.setUserBounds(0, 0, bounds.width, bounds.height);
                        this._viewerBody.setUserBounds(0, 0, bounds.width, bounds.height*this.getSteps().length);
                        this._fitViewPanes();
                        this._viewerScrollPane.scrollToY( (this.getIndex()!==null) ? (this.getIndex() * bounds.height) : 0);
                    }, this);
                    this._viewerScrollPane = new qx.ui.core.scroll.ScrollPane().set({ backgroundColor : null, zIndex : 5 });
                    this._viewerBody = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                    this._viewerScrollPane.add(this._viewerBody);
                    control.add(this._viewerScrollPane, { left:0, top:0 });
                    break;

                default:
                    break;
            }
            return control || this.base(arguments, id);
        },
        
        
        
        _fitViewPanes : function() {
            var viewPane = this.getChildControl("view-pane");
            var bounds = viewPane.getBounds();
            if(bounds!==null) {
                this._viewerScrollPane.setUserBounds(0, 0, bounds.width, bounds.height);
                this._viewerBody.setUserBounds(0, 0, bounds.width, bounds.height*this.getSteps().length);
                var panes = this._viewerBody.getChildren();
                for(var i=0; i<panes.length; i++) {
                    panes[i].set({
                        minWidth : bounds.width,
                        maxWidth : bounds.width,
                        minHeight : bounds.height,
                        maxHeight : bounds.height
                    });
                }
                this._viewerScrollPane.scrollToY( (this.getIndex()!==null) ? (this.getIndex() * bounds.height) : 0);
            }
        },
        
        
        
        _getAction : function(step, actionId) {
            var action = step.getAction(actionId);
            if(!action) {
                action = this._commonActions[actionId];
            }
            if(action) {
                return action;
            } else {
                return null;
            };
        },

        
        
        _initCommonActions : function() {
            this._commonActions = new Object();
            this._createCommonNextAction();
            this._createCommonEndAction();
            this._createCommonCancelAction();
        },
        
        
        
        _createCommonNextAction : function() {
            this._commonActions["next"] = new wizard.WizardAction(
                "next", "next",
                qx.lang.Function.bind(this._isCurrentStepDone, this),
                qx.lang.Function.bind(this._moveNext, this)
            );
        },
        
        
        
        _createCommonEndAction : function() {
            this._commonActions["end"] = new wizard.WizardAction(
                "end", "end",
                function() { return true; },
                qx.lang.Function.bind(this.end, this)
            );
        },
        
        
        
        _createCommonCancelAction : function() {
            this._commonActions["cancel"] = new wizard.WizardAction(
                "cancel", "cancel",
                function() { return true; },
                qx.lang.Function.bind(this.cancel, this)
            );
        },
        
        
        
        _isCurrentStepDone : function() {
            try {
                if(this.getIndex()!==null) {
                    var currentStep = this.getSteps().getItem(this.getIndex());
                    return ( currentStep.isDone() || currentStep.isCommitted() );
                } else {
                    return false;
                }
            } catch(err) {
                this.warn("error while evaluating predicate");
                return false;
            }
        },
        
        
        
        _moveNext : function() {
            if( (this.getIndex()!==null) && (this.getIndex()<(this.getSteps().length-1)) ) {
                this.setIndex(this.getIndex()+1);
            }
        },
        
        
        
        _onStepsChange : function(e) {
            this._stepStateListenerIds = new qx.data.Array();
            for(var i=0; i<this.getSteps().length; i++) {
                var step = this.getSteps().getItem(i);
                this._stepStateListenerIds.push(step.addListener("changeState", function(e) {
                    this._onStepChangeState(e);
                }, this));
            }
            this._update();
        },
        
        
        
        _onStepChangeState : function(e) {
            this._update();
            this._evaluateActionPredicates(true);
        },



        _update : function() {
            this._updateStepList();
            this._updateFooter();
            this._updateViewPanes();
            this._applyIndex(this.getIndex());
        },
        
        
        
        _updateHeader : function() {
            var description = this.getChildControl("description");
            if(
                (this.getSteps()!==null)  &&
                (this.getIndex()!==null) &&
                (this.getSteps().getItem(this.getIndex())!==null) &&
                (this.getSteps().getItem(this.getIndex()).getDescription()!==null)
            ) {
                description.setValue(this.tr(this.getSteps().getItem(this.getIndex()).getDescription()));
            } else {
                description.setValue(null);
            }
        },



        _updateFooter : function() {
            var footer = this.getChildControl("footer");
            footer.removeAll();
            if(this.getIndex()!==null) {
                var step = this.getSteps().getItem(this.getIndex());
                if(step) {
                    var actionIds = step.getActionIds();
                    for(var i=0; i<actionIds.length; i++) {
                        var actionId = actionIds[i];
                        var button = this._getActionButton(step, actionId);
                        if(button!==null) {
                            footer.add(button);
                        }
                    }
                    this._evaluateActionPredicates(false);
                }
            }
        },



        _updateStepList : function() {
            var stepList = this.getChildControl("step-list");
            stepList.removeAll();
            for(var i=0; i<this.getSteps().length; i++) {
                var step = this.getSteps().getItem(i);
                var row = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                    allowGrowX : true,
                    appearance : "wizard-step-item"
                });
                row.addListener("mouseover", function(e) {
                    e.getCurrentTarget().addState("hovered");
                }, this);
                row.addListener("mouseout", function(e) {
                    e.getCurrentTarget().removeState("hovered");
                }, this);
                var label = new qx.ui.basic.Label((i+1) + ". " + this.tr(step.getTitle()));
                row.add(label);
                row.setUserData("index", i);
                row.addListener("click", function(e) {
                    if(e.getCurrentTarget().hasState("accesible")) {
                        this.setIndex(e.getCurrentTarget().getUserData("index"));
                    }
                }, this);
                stepList.add(row);
            }
            this._updateStepListStates();
        },
        
        
        
        _updateStepListStates : function() {
            var futureZone = false;
            var stepList = this.getChildControl("step-list");
            for(var i=0; i<this.getSteps().length; i++) {
                var step = this.getSteps().getItem(i);
                var row = stepList.getChildren()[i];
                if(row) {
                    row.removeState("selected");
                    row.removeState("committed");
                    row.removeState("done");
                    row.removeState("future");
                    row.removeState("accesible");
                    if(this.getIndex()===i) {
                        row.addState("selected");
                    };
                    if(step.isCommitted()) {
                        row.addState("committed");
                    } else if(step.isDone()) {
                        row.addState("done");
                    }
                    if(futureZone) {
                        row.addState("future");
                    } else {
                        if(!step.isCommitted()) {
                            row.addState("accesible");
                        }
                        if(step.isToBeDone()) {
                            futureZone = true;
                        }
                    }
                }
            }
        },



        _updateViewPanes : function() {
            if(this._viewerBody!==null) {
                this._viewerBody.removeAll();
                for(var p=0; p<this.getSteps().length; p++) {
                    var pane = new qx.ui.container.Composite(new qx.ui.layout.Dock());
                    pane.add(this.getSteps().getItem(p).getView(), { edge : "center" });
                    this._viewerBody.add(pane);
                }
                this._fitViewPanes();
            }
        },



        _evaluateActionPredicates : function(useAnimations) {
            if(this.getIndex()===null) {
                return;
            }
            var step = this.getSteps().getItem(this.getIndex());
            var actionIds = step.getActionIds();
            var focusedWidget = qx.ui.core.FocusHandler.getInstance().getFocusedWidget();
            for(var i=0; i<actionIds.length; i++) {
                var actionId = actionIds[i];
                var button = this._getActionButton(step, actionId);
                if(button!==null) {
                    var action = this._getAction(step, actionId);
                    if(action && action.getPredicate()) {
                        var enabled = action.getPredicate()();
                        button.setEnabled(enabled);
                        if( (button.isSeeable()) && (button.getUserData("highlightWhenAvailable")) && (enabled) ) {
                            if(useAnimations) {
                                var deferred = new qx.util.DeferredCall(qx.lang.Function.bind(function(button) {
                                    var tada = {
                                        duration: 200,
                                        keyFrames : {
                                            50 : { scale : [1.4,1.4], translate: "-128px", backgroundColor : "raymond-orange" }
                                        }
                                    };
                                    var el = button.getContentElement().getDomElement();
                                    var theButton = button;
                                    var theFocusedWidget = focusedWidget;
                                    focusedWidget = null;
                                    button.getChildControl("label").removeState("selected");
                                    var animationHandle = qx.bom.element.Animation.animate( el, tada );
                                    animationHandle.addListener("end", function() {
                                        theButton.getChildControl("label").addState("selected");
                                        var viewPane = this.getChildControl("view-pane");
                                        var bounds = viewPane.getBounds();
                                        this._viewerScrollPane.scrollToY(this.getIndex() * bounds.height, 0);
                                        theFocusedWidget.focus();
                                        var glow = {
                                            duration : 200,
                                            keyFrames : {
                                                0 : { opacity : .7 },
                                                100 : { opacity : 1 }
                                            },
                                            keep : 100,
                                            repeat : 17,
                                            alternate : true
                                        };
                                        var el = theButton.getContentElement().getDomElement();
                                        new qx.util.DeferredCall(function() {
                                            var glowHandle = qx.bom.element.Animation.animate( el, glow );
                                            theButton.setUserData("animationHandle", glowHandle);
                                        }, this).schedule();
                                    }, this);
                                }, this, button));
                                deferred.schedule();
                            } else {
                                button.getChildControl("label").addState("selected");
                            }
                        } else {
                            var animationHandle = button.getUserData("animationHandle");
                            if(animationHandle) {
                                animationHandle.stop();
                            }
                            button.getChildControl("label").removeState("selected");

                        }
                    }
                }
            }
            if(focusedWidget!==null) {
                focusedWidget.focus();
            }
        },



        _getActionButton : function(step, actionId) {
            var button = this._actionButtons[step.getId() + "#" + actionId];
            if(button===undefined) {
                button = this._createButton(step, actionId);
                if(button!==null) {
                    this._actionButtons[step.getId() + "#" + actionId] = button;
                }
            }
            return button;
        },
        
        
        
        _createButton : function(step, actionId) {
            var action = this._getAction(step, actionId);
            if(action) {
                var button = new qx.ui.form.Button(this.tr(action.getName()));
                button.setUserData("action", action);
                button.setUserData("highlightWhenAvailable", action.getHighlightWhenAvailable());
                button.addListener("execute", function(e) {
                    var action = e.getCurrentTarget().getUserData("action");
                    if(action && action.getAction()) {
                        action.getAction()();
                    }
                }, this);
                action.addListener("changeHighlightWhenAvailable", function(e) {
                    button.setUserData("highlightWhenAvailable", e.getCurrentTarget().getHighlightWhenAvailable());
                }, this);
                return button;
            } else {
                this.warn("action with id '" + actionId + "' not found");
            }
            return null;
        },



        _applySteps : function(value, old) {
            if( (this._stepStateListenerIds!==null) && (old!==null) ) {
                if(this._stepsChangeListenerId!==null) {
                    old.removeListenerById(this._stepsChangeListenerId);
                }
                for(var i=0; i<old.length; i++) {
                    var step = old.getItem(i);
                    step.removeListenerById(this._stepStateListenerIds.getItem(i));
                }
            }
            this._stepStateListenerIds = new qx.data.Array();
            this._stepsChangeListenerId = value.addListener("change", function(e){
                this._onStepsChange(e);
            }, this);
            if(value!==null) {
                for(var i=0; i<value.length; i++) {
                    var step = value.getItem(i);
                    this._stepStateListenerIds.push(step.addListener("changeState", function(e) {
                        this._onStepChangeState(e);
                    }, this));
                }
                this.setIndex((value.length>0) ? 0 : null);
            } else {
                this.setIndex(null);
            }
            this._update();
//            if( (this.getIndex()!==null) && (this.getIndex()>0) && (this.getIndex()>=value.length) ) {
//                this.setIndex(value.length -1);
//            }
        },
        
        
        
        _applyIndex : function(value, old) {
            this._updateStepListStates();
            var viewPane = this.getChildControl("view-pane");
            var bounds = viewPane.getBounds();
            if(bounds!==null) {
                this._viewerScrollPane.scrollToY(value * bounds.height, 100);
            }
            this._updateHeader();
            this._updateFooter();
            var stepList = this.getChildControl("step-list");
            if( (this.getIndex()!==null) && (this.getSteps().getItem(this.getIndex()).isFinalStep()) ) {
                stepList.fadeOut(200);
            } else {
                stepList.fadeIn(200);
            }
        }
        
    }
    
});