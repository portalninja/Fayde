﻿/// <reference path="ButtonBase.js"/>
/// CODE

//#region HyperlinkButton

function HyperlinkButton() {
    ButtonBase.call(this);
}
HyperlinkButton.InheritFrom(ButtonBase);

HyperlinkButton.StateDisabled = "Disabled";
HyperlinkButton.StatePressed = "Pressed";
HyperlinkButton.StateMouseOver = "MouseOver";
HyperlinkButton.StateNormal = "Normal";
HyperlinkButton.StateFocused = "Focused";
HyperlinkButton.StateUnfocused = "Unfocused";

//#region DEPENDENCY PROPERTIES

HyperlinkButton.NavigateUriProperty = DependencyProperty.Register("NavigateUri", function() { return Uri; }, HyperlinkButton, null);
HyperlinkButton.prototype.GetNavigateUri = function () {
	///<returns type="Uri"></returns>
	return this.GetValue(HyperlinkButton.NavigateUriProperty);
};
HyperlinkButton.prototype.SetNavigateUri = function (value) {
	///<param name="value" type="Uri"></param>
	this.SetValue(HyperlinkButton.NavigateUriProperty, value);
};

HyperlinkButton.TargetNameProperty = DependencyProperty.Register("TargetName", function() { return String; }, HyperlinkButton, null);
HyperlinkButton.prototype.GetTargetName = function () {
	///<returns type="String"></returns>
	return this.GetValue(HyperlinkButton.TargetNameProperty);
};
HyperlinkButton.prototype.SetTargetName = function (value) {
	///<param name="value" type="String"></param>
	this.SetValue(HyperlinkButton.TargetNameProperty, value);
};

//#endregion

HyperlinkButton.prototype.OnApplyTemplate = function () {
    ButtonBase.prototype.OnApplyTemplate.call(this);
    this.UpdateVisualState(false);
};

HyperlinkButton.prototype.OnClick = function () {
    ButtonBase.prototype.OnClick.call(this);
    if (this.GetNavigateUri() != null) {
        this._Navigate();
    }
};

HyperlinkButton.prototype._GetAbsoluteUri = function () {
    /// <returns type="Uri" />
    var destination = this.GetNavigateUri();
    if (!destination.IsAbsoluteUri) {
        var original = destination.OriginalString;
        if (original && original.charAt(0) !== '/')
            throw new NotSupportedException();
        destination = new Uri(App.Instance.GetHost().GetSource(), destination);
    }
    return destination;
};
HyperlinkButton.prototype._ChangeVisualState = function (useTransitions) {
    if (!this.GetIsEnabled()) {
        this._GoToState(useTransitions, HyperlinkButton.StateDisabled);
    } else if (this.GetIsPressed()) {
        this._GoToState(useTransitions, HyperlinkButton.StatePressed);
    } else if (this.GetIsMouseOver()) {
        this._GoToState(useTransitions, HyperlinkButton.StateMouseOver);
    } else {
        this._GoToState(useTransitions, HyperlinkButton.StateNormal);
    }

    if (this.GetIsFocused() && this.GetIsEnabled()) {
        this._GoToState(useTransitions, HyperlinkButton.StateFocused);
    } else {
        this._GoToState(useTransitions, HyperlinkButton.StateUnfocused);
    }
};
HyperlinkButton.prototype._Navigate = function () {
    document.location = this.GetNavigateUri().toString();
    //NotImplemented("HyperlinkButton._Navigate (" + this.GetNavigateUri().toString() + ")");
};

//#region DEFAULT STYLE

HyperlinkButton.prototype.GetDefaultStyle = function () {
    var styleJson = {
        Type: Style,
        Props: {
            TargetType: HyperlinkButton
        },
        Children: [
            {
                Type: Setter,
                Props: {
                    Property: DependencyProperty.GetDependencyProperty(HyperlinkButton, "Foreground"),
                    Value: new SolidColorBrush(Color.FromHex("#FF73A9D8"))
                }
            },
            {
                Type: Setter,
                Props: {
                    Property: DependencyProperty.GetDependencyProperty(HyperlinkButton, "Padding"),
                    Value: new Thickness(2, 0, 2, 0)
                }
            },
            {
                Type: Setter,
                Props: {
                    Property: DependencyProperty.GetDependencyProperty(HyperlinkButton, "HorizontalContentAlignment"),
                    Value: HorizontalAlignment.Left
                }
            },
            {
                Type: Setter,
                Props: {
                    Property: DependencyProperty.GetDependencyProperty(HyperlinkButton, "VerticalContentAlignment"),
                    Value: VerticalAlignment.Top
                }
            },
            {
                Type: Setter,
                Props: {
                    Property: DependencyProperty.GetDependencyProperty(HyperlinkButton, "Background"),
                    Value: new SolidColorBrush(Color.FromHex("#00FFFFFF"))
                }
            },
            {
                Type: Setter,
                Props: {
                    Property: DependencyProperty.GetDependencyProperty(HyperlinkButton, "Template"),
                    Value: new ControlTemplate(HyperlinkButton, {
                        Type: Grid,
                        Name: "RootElement",
                        Props: {
                            Cursor: new TemplateBindingMarkup("Cursor"),
                            Background: new TemplateBindingMarkup("Background")
                        },
                        Children: [
                            {
                                Type: TextBlock,
                                Name: "UnderlineTextBlock",
                                Props: {
                                    Text: new TemplateBindingMarkup("Content"),
                                    HorizontalAlignment: new TemplateBindingMarkup("HorizontalContentAlignment"),
                                    VerticalAlignment: new TemplateBindingMarkup("VerticalContentAlignment"),
                                    Margin: new TemplateBindingMarkup("Padding"),
                                    TextDecorations: TextDecorations.Underline,
                                    Visibility: Visibility.Collapsed
                                }
                            },
                            {
                                Type: TextBlock,
                                Name: "DisabledOverlay",
                                Props: {
                                    Text: new TemplateBindingMarkup("Content"),
                                    Foreground: new SolidColorBrush(Color.FromHex("#FFAAAAAA")),
                                    HorizontalAlignment: new TemplateBindingMarkup("HorizontalContentAlignment"),
                                    VerticalAlignment: new TemplateBindingMarkup("VerticalContentAlignment"),
                                    Margin: new TemplateBindingMarkup("Padding"),
                                    Visibility: Visibility.Collapsed
                                }
                            },
                            {
                                Type: ContentPresenter,
                                Name: "Normal",
                                Props: {
                                    Content: new TemplateBindingMarkup("Content"),
                                    ContentTemplate: new TemplateBindingMarkup("ContentTemplate"),
                                    HorizontalAlignment: new TemplateBindingMarkup("HorizontalContentAlignment"),
                                    VerticalAlignment: new TemplateBindingMarkup("VerticalContentAlignment"),
                                    Margin: new TemplateBindingMarkup("Padding")
                                }
                            },
                            {
                                Type: Border,
                                Name: "FocusVisualElement",
                                Props: {
                                    BorderBrush: new SolidColorBrush(Color.FromHex("#FF6DBDD1")),
                                    BorderThickness: new Thickness(1, 1, 1, 1),
                                    Opacity: 0.0,
                                    IsHitTestVisible: false
                                }
                            }
                        ]
                    })
                }
            }
        ]
    };
    var parser = new JsonParser();
    return parser.CreateObject(styleJson, new NameScope());
};

//#endregion

//#endregion