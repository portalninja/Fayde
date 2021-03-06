/// <reference path="../ContentControl.ts" />
/// <reference path="../Enums.ts" />

module Fayde.Controls.Primitives {
    export class ButtonBase extends ContentControl {
        static ClickModeProperty = DependencyProperty.Register("ClickMode", () => new Enum(ClickMode), ButtonBase, ClickMode.Release);
        static IsPressedProperty = DependencyProperty.RegisterReadOnly("IsPressed", () => Boolean, ButtonBase, false, (d, args) => (<ButtonBase>d).OnIsPressedChanged(args));
        static IsFocusedProperty = DependencyProperty.RegisterReadOnly("IsFocused", () => Boolean, ButtonBase, false);
        static CommandProperty = DependencyProperty.RegisterCore("Command", () => Input.ICommand_, ButtonBase, undefined, (d, args) => (<ButtonBase>d).OnCommandChanged(args));
        static CommandParameterProperty = DependencyProperty.RegisterCore("CommandParameter", () => Object, ButtonBase, undefined, (d, args) => (<ButtonBase>d).OnCommandParameterChanged(args));
        ClickMode: ClickMode;
        IsPressed: boolean;
        IsFocused: boolean;
        Command: Input.ICommand;
        CommandParameter: any;
        Click = new RoutedEvent<RoutedEventArgs>();
            
        private _IsMouseCaptured: boolean = false;
        private _IsMouseLeftButtonDown: boolean = false;
        private _IsSpaceKeyDown: boolean = false;
        _MousePosition: Point = new Point();
        private _SuspendStateChanges: boolean = false;

        constructor() {
            super();
            this.IsTabStop = true;
        }

        OnIsPressedChanged(args: IDependencyPropertyChangedEventArgs) {
            this.UpdateVisualState();
        }

        OnIsEnabledChanged(e: IDependencyPropertyChangedEventArgs) {
            if (!!e.NewValue)
                return;
            this._DoWithSuspend(() => {
                this.SetValueInternal(ButtonBase.IsFocusedProperty, false);
                this.SetValueInternal(ButtonBase.IsPressedProperty, false);
                this._IsMouseCaptured = false;
                this._IsSpaceKeyDown = false;
                this._IsMouseLeftButtonDown = false;
            });
        }
        OnMouseEnter(e: Input.MouseEventArgs) {
            super.OnMouseEnter(e);
            this.UpdateVisualState();

            if (this.ClickMode !== ClickMode.Hover || !this.IsEnabled)
                return;

            this._DoWithSuspend(() => {
                this.SetValueInternal(ButtonBase.IsPressedProperty, true);
                this.OnClick();
            });
        }
        OnMouseLeave(e: Input.MouseEventArgs) {
            super.OnMouseLeave(e);
            this.UpdateVisualState();

            if (this.ClickMode !== ClickMode.Hover || !this.IsEnabled)
                return;

            this._DoWithSuspend(() => {
                this.SetValueInternal(ButtonBase.IsPressedProperty, false);
            });
        }
        OnMouseMove(e: Input.MouseEventArgs) {
            super.OnMouseMove(e);

            this._MousePosition = e.GetPosition(this);

            if (this._IsMouseLeftButtonDown && this.IsEnabled && this.ClickMode !== ClickMode.Hover && this._IsMouseCaptured && !this._IsSpaceKeyDown) {
                this.SetValueInternal(ButtonBase.IsPressedProperty, this._IsValidMousePosition());
            }
        }
        OnMouseLeftButtonDown(e: Input.MouseButtonEventArgs) {
            super.OnMouseLeftButtonDown(e);

            this._IsMouseLeftButtonDown = true;
            if (!this.IsEnabled)
                return;
            var clickMode = this.ClickMode;
            if (clickMode === ClickMode.Hover)
                return;

            e.Handled = true;
            this._DoWithSuspend(() => {
                this.Focus();
                this._CaptureMouseInternal();
                if (this._IsMouseCaptured)
                    this.SetValueInternal(ButtonBase.IsPressedProperty, true);
            });

            if (clickMode === ClickMode.Press)
                this.OnClick();
        }
        OnMouseLeftButtonUp(e: Input.MouseButtonEventArgs) {
            super.OnMouseLeftButtonDown(e);

            this._IsMouseLeftButtonDown = false;
            if (!this.IsEnabled)
                return;
            var clickMode = this.ClickMode;
            if (clickMode === ClickMode.Hover)
                return;

            e.Handled = true;
            if (!this._IsSpaceKeyDown && this.IsPressed && clickMode === ClickMode.Release)
                this.OnClick();

            if (!this._IsSpaceKeyDown) {
                this._ReleaseMouseCaptureInternal();
                this.SetValueInternal(ButtonBase.IsPressedProperty, false);
            }
        }

        OnGotFocus(e: RoutedEventArgs) {
            super.OnGotFocus(e);
            this.SetValueInternal(ButtonBase.IsFocusedProperty, true);
            this.UpdateVisualState();
        }
        OnLostFocus(e: RoutedEventArgs) {
            super.OnLostFocus(e);
            this.SetValueInternal(ButtonBase.IsFocusedProperty, false);

            if (this.ClickMode === ClickMode.Hover)
                return;

            this._DoWithSuspend(() => {
                this.SetValueInternal(ButtonBase.IsPressedProperty, false);
                this._ReleaseMouseCaptureInternal();
                this._IsSpaceKeyDown = false;
            });
        }

        OnClick() {
            var cmd = this.Command;
            var par = this.CommandParameter;
            if (cmd != null) {
                var canf = cmd.CanExecute;
                if ((canf == null || typeof canf !== "function" || canf(par)) && (cmd.Execute && typeof cmd.Execute === "function"))
                    cmd.Execute(par);
            }

            this.Click.Raise(this, new RoutedEventArgs());
        }

        private _DoWithSuspend(action: () => void) {
            this._SuspendStateChanges = true;
            try {
                action();
            } finally {
                this._SuspendStateChanges = false;
                this.UpdateVisualState();
            }
        }

        UpdateVisualState(useTransitions?: boolean) {
            if (this._SuspendStateChanges)
                return;
            super.UpdateVisualState(useTransitions);
        }
        GoToStateCommon(gotoFunc: (state: string) => boolean): boolean {
            if (!this.IsEnabled)
                return gotoFunc("Disabled");
            if (this.IsPressed)
                return gotoFunc("Pressed");
            if (this.IsMouseOver)
                return gotoFunc("MouseOver");
            return gotoFunc("Normal");
        }

        private _CaptureMouseInternal() {
            if (!this._IsMouseCaptured)
                this._IsMouseCaptured = this.CaptureMouse();
        }
        private _ReleaseMouseCaptureInternal() {
            this.ReleaseMouseCapture();
            this._IsMouseCaptured = false;
        }
        private _IsValidMousePosition(): boolean {
            var pos = this._MousePosition;
            return pos.X >= 0.0 && pos.X <= this.ActualWidth
                && pos.Y >= 0.0 && pos.Y <= this.ActualHeight;
        }

        private OnCommandChanged(args: IDependencyPropertyChangedEventArgs) {
            var cmd = Input.ICommand_.As(args.OldValue);
            if (cmd)
                cmd.CanExecuteChanged.Unsubscribe(this.OnCommandCanExecuteChanged, this);

            cmd = Input.ICommand_.As(args.NewValue);
            if (cmd) {
                cmd.CanExecuteChanged.Subscribe(this.OnCommandCanExecuteChanged, this);
                this.IsEnabled = cmd.CanExecute(this.CommandParameter);
            }
        }
        private OnCommandCanExecuteChanged(sender, e) {
            this.IsEnabled = this.Command.CanExecute(this.CommandParameter);
        }
        private OnCommandParameterChanged(args: IDependencyPropertyChangedEventArgs) {
            var cmd = this.Command;
            if (cmd)
                this.IsEnabled = cmd.CanExecute(args.NewValue);
        }
    }
    Fayde.RegisterType(ButtonBase, "Fayde.Controls.Primitives", Fayde.XMLNS);
}