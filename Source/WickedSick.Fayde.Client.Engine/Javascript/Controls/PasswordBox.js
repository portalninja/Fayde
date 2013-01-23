/// <reference path="../Runtime/Nullstone.js" />
/// <reference path="TextBoxBase.js"/>
/// CODE
/// <reference path="../Core/PropertyValueProviders/Enums.js"/>
/// <reference path="PropertyValueProviders/PasswordBoxDynamicPropertyValueProvider.js"/>
/// <reference path="Enums.js"/>

(function (namespace) {
    var PasswordBox = Nullstone.Create("PasswordBox", TextBoxBase);

    PasswordBox.Instance.Init = function () {
        this.Init$TextBoxBase();
        this.AddProvider(new _PasswordBoxDynamicPropertyValueProvider(this, _PropertyPrecedence.DynamicValue));
        this._EventsMask = _TextBoxEmitChanged.TEXT;
    };

    //#region Properties

    PasswordBox.SelectionBackgroundProperty = DependencyProperty.RegisterCore("SelectionBackground", function () { return Fayde.Media.Brush; }, PasswordBox);
    PasswordBox.SelectionForegroundProperty = DependencyProperty.RegisterCore("SelectionForeground", function () { return Fayde.Media.Brush; }, PasswordBox);
    PasswordBox.BaselineOffsetProperty = DependencyProperty.RegisterCore("BaselineOffset", function () { return Number; }, PasswordBox);

    Nullstone.AutoProperties(PasswordBox, [
        PasswordBox.SelectionBackgroundProperty,
        PasswordBox.SelectionForegroundProperty,
        "SelectionStart",
        "SelectionLength"
    ]);

    //#endregion

    namespace.PasswordBox = Nullstone.FinishCreate(PasswordBox);
})(window);