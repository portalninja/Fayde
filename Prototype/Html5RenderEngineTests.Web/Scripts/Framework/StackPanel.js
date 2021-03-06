﻿/// <reference path="Panel.js" />
/// CODE
/// <reference path="Primitives.js" />
/// <reference path="DependencyObject.js" />

//#region StackPanel

function StackPanel() {
    Panel.call(this);
}
StackPanel.InheritFrom(Panel);

//#region DEPENDENCY PROPERTIES

StackPanel._OrientationChanged = function (d, args) {
    var sp = RefObject.As(d, StackPanel);
    if (sp == null)
        return;
    d._InvalidateMeasure();
    d._InvalidateArrange();
};
StackPanel.OrientationProperty = DependencyProperty.Register("Orientation", function () { return Number; }, StackPanel, Orientation.Vertical, StackPanel._OrientationChanged);
StackPanel.prototype.GetOrientation = function () {
    return this.GetValue(StackPanel.OrientationProperty);
};
StackPanel.prototype.SetOrientation = function (value) {
    this.SetValue(StackPanel.OrientationProperty, value);
};

//#endregion

//#region INSTANCE METHODS

StackPanel.prototype.MeasureOverride = function (constraint) {
    Info("StackPanel.MeasureOverride [" + this._TypeName + "]");
    var childAvailable = new Size(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    var measured = new Size(0, 0);

    if (this.GetOrientation() === Orientation.Vertical) {
        childAvailable.Width = constraint.Width;
        if (!isNaN(this.GetWidth()))
            childAvailable.Width = this.GetWidth();
        childAvailable.Width = Math.min(childAvailable.Width, this.GetMaxWidth());
        childAvailable.Width = Math.max(childAvailable.Width, this.GetMinWidth());
    } else {
        childAvailable.Height = constraint.Height;
        if (!isNaN(this.GetHeight()))
            childAvailable.Height = this.GetHeight();
        childAvailable.Height = Math.min(childAvailable.Height, this.GetMaxHeight());
        childAvailable.Height = Math.max(childAvailable.Height, this.GetMinHeight());
    }

    var children = this.GetChildren();
    for (var i = 0; i < children.GetCount(); i++) {
        var child = children.GetValueAt(i);
        child.Measure(childAvailable);
        var size = child._DesiredSize;

        if (this.GetOrientation() === Orientation.Vertical) {
            measured.Height += size.Height;
            measured.Width = Math.max(measured.Width, size.Width);
        } else {
            measured.Width += size.Width;
            measured.Height = Math.max(measured.Height, size.Height);
        }
    }

    return measured;
};
StackPanel.prototype.ArrangeOverride = function (arrangeSize) {
    Info("StackPanel.ArrangeOverride [" + this._TypeName + "]");
    var arranged = arrangeSize;

    if (this.GetOrientation() === Orientation.Vertical)
        arranged.Height = 0;
    else
        arranged.Width = 0;

    var children = this.GetChildren();
    for (var i = 0; i < children.GetCount(); i++) {
        var child = children.GetValueAt(i);
        var size = child._DesiredSize;
        var childFinal;
        if (this.GetOrientation() === Orientation.Vertical) {
            size.Width = arrangeSize.Width;

            childFinal = new Rect(0, arranged.Height, size.Width, size.Height);

            if (childFinal.IsEmpty())
                child.Arrange(new Rect());
            else
                child.Arrange(childFinal);

            arranged.Width = Math.max(arranged.Width, size.Width);
            arranged.Height += size.Height;
        } else {
            size.Height = arrangeSize.Height;

            childFinal = new Rect(arranged.Width, 0, size.Width, size.Height);
            if (childFinal.IsEmpty())
                child.Arrange(new Rect());
            else
                child.Arrange(childFinal);

            arranged.Width += size.Width;
            arranged.Height = Math.max(arranged.Height, size.Height);
        }
    }

    if (this.GetOrientation() === Orientation.Vertical)
        arranged.Height = Math.max(arranged.Height, arrangeSize.Height);
    else
        arranged.Width = Math.max(arranged.Width, arrangeSize.Width);

    return arranged;

};

//#endregion

//#endregion