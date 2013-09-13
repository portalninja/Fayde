/// <reference path="ContentControl.ts" />
/// CODE
/// <reference path="Primitives/Selector.ts" />

module Fayde.Controls {
    export class ListBoxItem extends ContentControl {
        private _ParentSelector: Primitives.Selector;
        get ParentSelector(): Primitives.Selector { return this._ParentSelector; }
        set ParentSelector(value: Primitives.Selector) {
            if (this._ParentSelector === value)
                return;
            this._ParentSelector = value;
            this.ParentSelectorChanged.Raise(this, EventArgs.Empty);
        }
        ParentSelectorChanged: MulticastEvent<EventArgs> = new MulticastEvent<EventArgs>();

        static IsSelectedProperty: DependencyProperty = DependencyProperty.RegisterCore("IsSelected", () => Boolean, ListBoxItem, null, (d, args) => (<ListBoxItem>d).OnIsSelectedChanged(args));
        IsSelected: boolean;

        constructor() {
            super();
            this.DefaultStyleKey = (<any>this).constructor;
        }

        OnApplyTemplate() {
            super.OnApplyTemplate();
            this.UpdateVisualState(false);
        }

        OnMouseLeftButtonDown(e: Input.MouseButtonEventArgs) {
            if (e.Handled)
                return;
            e.Handled = true;
            if (!this.XamlNode.Focus(true))
                return;
            if (this._ParentSelector != null)
                this._ParentSelector.NotifyListItemClicked(this);
        }
        OnMouseEnter(e: Input.MouseEventArgs) {
            super.OnMouseEnter(e);
            this.UpdateVisualState();
        }
        OnMouseLeave(e: Input.MouseEventArgs) {
            super.OnMouseLeave(e);
            this.UpdateVisualState();
        }
        OnGotFocus(e: RoutedEventArgs) {
            super.OnGotFocus(e);
            this.UpdateVisualState();
            if (this._ParentSelector != null) {
                this._ParentSelector.NotifyListItemGotFocus(this);
            }
        }
        OnLostFocus(e: RoutedEventArgs) {
            super.OnLostFocus(e);
            this.UpdateVisualState();
            if (this._ParentSelector != null) {
                this._ParentSelector.NotifyListItemLostFocus(this);
            }
        }

        GetVisualStateNamesToActivate(): string[] {
            var arr = super.GetVisualStateNamesToActivate();
            arr.push(this.GetVisualStateSelection());
            return arr;
        }
        GetVisualStateCommon(): string {
            if (!this.IsEnabled) {
                return this.Content instanceof Control ? "Normal" : "Disabled";
            } else if (this.IsMouseOver) {
                return "MouseOver";
            } else {
                return "Normal";
            }
        }
        GetVisualStateSelection(): string {
            if (this.IsSelected) {
                return this.IsFocused ? "Selected" : "SelectedUnfocused";
            } else {
                return "Unselected";
            }
        }
        
        private OnIsSelectedChanged(args: IDependencyPropertyChangedEventArgs) {
            this.UpdateVisualState();
        }
    }
    Fayde.RegisterType(ListBoxItem, {
    	Name: "ListBoxItem",
    	Namespace: "Fayde.Controls",
    	XmlNamespace: Fayde.XMLNS
    });
}