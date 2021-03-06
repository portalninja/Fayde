﻿/// <reference path="RefObject.js"/>
/// <reference path="PropertyPath.js"/>
/// CODE
/// <reference path="Primitives.js"/>
/// <reference path="RelativeSource.js"/>

//#region BindingBase

function BindingBase() {
    RefObject.call(this);
}
BindingBase.InheritFrom(RefObject);

BindingBase.prototype.CheckSealed = function () {
    if (this.GetSealed())
        throw new InvalidOperationException("The Binding cannot be changed after it has been used.");
};
BindingBase.prototype.Seal = function () {
    this.SetSealed(true);
};

//#region PROPERTIES

BindingBase.prototype.GetFallbackValue = function () {
    return this._FallbackValue;
};
BindingBase.prototype.SetFallbackValue = function (/* Object */value) {
    this.CheckSealed();
    this._FallbackValue = value;
};

BindingBase.prototype.GetSealed = function () {
    return this._Sealed;
};
BindingBase.prototype.SetSealed = function (/* Boolean */value) {
    this._Sealed = value;
};

BindingBase.prototype.GetStringFormat = function () {
    return this._StringFormat;
};
BindingBase.prototype.SetStringFormat = function (/* String */value) {
    this.CheckSealed();
    this._StringFormat = value;
};

BindingBase.prototype.GetTargetNullValue = function () {
    return this._TargetNullValue;
};
BindingBase.prototype.SetTargetNullValue = function (/* Object */value) {
    this.CheckSealed();
    this._TargetNullValue = value;
};

//#endregion

//#endregion

//#region Binding

function Binding(path) {
    BindingBase.call(this);

    if (!path)
        path = "";

    this.SetMode(BindingMode.OneWay);

    this.SetPath(new _PropertyPath(path));
    this.SetValidatesOnNotifyDataErrors(true);
    this.SetUpdateSourceTrigger(UpdateSourceTrigger.Default);
}
Binding.InheritFrom(BindingBase);

//#region PROPERTIES

Binding.prototype.GetBindsDirectlyToSource = function () { return this._BindsDirectlyToSource; };
Binding.prototype.SetBindsDirectlyToSource = function (/* Boolean */value) { this.CheckSealed(); this._BindsDirectlyToSource = value; };

Binding.prototype.GetConverter = function () { return this._Converter; };
Binding.prototype.SetConverter = function (/* IValueConverter */value) { this.CheckSealed(); this._Converter = value; };

Binding.prototype.GetConverterCulture = function () { return this._ConverterCulture; };
Binding.prototype.SetConverterCulture = function (/* Culture */value) { this.CheckSealed(); this._ConverterCulture = value; };

Binding.prototype.GetConverterParameter = function () { return this._ConverterParameter; };
Binding.prototype.SetConverterParameter = function (/* Object */value) { this.CheckSealed(); this._ConverterParameter = value; };

Binding.prototype.GetElementName = function () { return this._ElementName; };
Binding.prototype.SetElementName = function (/* String */value) {
    this.CheckSealed();
    if (this.GetSource() != null || this.GetRelativeSource() != null)
        throw new InvalidOperationException("ElementName cannot be set if either RelativeSource or Source is set");
    this._ElementName = value;
};

Binding.prototype.GetMode = function () { return this._Mode; };
Binding.prototype.SetMode = function (/* Number */value) { this.CheckSealed(); this._Mode = value; };

Binding.prototype.GetNotifyOnValidationError = function () { return this._NotifyOnValidationError; };
Binding.prototype.SetNotifyOnValidationError = function (/* Boolean */value) { this.CheckSealed(); this._NotifyOnValidationError = value; };

Binding.prototype.GetRelativeSource = function () {
    ///<returns type="RelativeSource"></returns>
    return this._RelativeSource; 
 };
Binding.prototype.SetRelativeSource = function (/* RelativeSource */value) {
    this.CheckSealed();
    if (this.GetSource() != null || this.GetElementName() != null)
        throw new InvalidOperationException("RelativeSource cannot be set if either ElementName or Source is set");
    this._RelativeSource = value;
};

Binding.prototype.GetPath = function () { return this._Path; };
//TODO: TypeConverter(PropertyPathConverter)
Binding.prototype.SetPath = function (/* PropertyPath */value) {
    this.CheckSealed();
    if (value.HasDependencyProperty())
        throw new ArgumentException("PropertyPaths which are instantiated with a DependencyProperty are not supported");
    this._Path = value;
};

Binding.prototype.GetSource = function () { return this._Source; };
Binding.prototype.SetSource = function (/* RefObject */value) {
    this.CheckSealed();
    if (this.GetElementName() != null || this.GetRelativeSource() != null)
        throw new InvalidOperationException("Source cannot be set if either ElementName or RelativeSource is set");
    this._Source = value; 
};

Binding.prototype.GetUpdateSourceTrigger = function () { return this._UpdateSourceTrigger; };
Binding.prototype.SetUpdateSourceTrigger = function (/* Number */value) { this.CheckSealed(); this._UpdateSourceTrigger = value; };

Binding.prototype.GetValidatesOnExceptions = function () { return this._ValidatesOnExceptions; };
Binding.prototype.SetValidatesOnExceptions = function (/* Boolean */value) { this.CheckSealed(); this._ValidatesOnExceptions = value; };

Binding.prototype.GetValidatesOnDataErrors = function () { return this._ValidatesOnDataErrors; };
Binding.prototype.SetValidatesOnDataErrors = function (/* Boolean */value) { this.CheckSealed(); this._ValidatesOnDataErrors = value; };

Binding.prototype.GetValidatesOnNotifyDataErrors = function () { return this._ValidatesOnNotifyDataErrors; };
Binding.prototype.SetValidatesOnNotifyDataErrors = function (/* Boolean */value) { this.CheckSealed(); this._ValidatesOnNotifyDataErrors = value; };

//#endregion

//#endregion