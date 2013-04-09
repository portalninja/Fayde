/// CODE
/// <reference path="Style.ts" />

module Fayde {

    export interface IWalker {
        Step(): any;
    }
    export interface IStyleWalker extends IWalker {
        Step(): Setter;
    }
    
    function setterSort(setter1: Setter, setter2: Setter) {
        var a = setter1.Property;
        var b = setter2.Property;
        return (a === b) ? 0 : ((a._ID > b._ID) ? 1 : -1);
    }
    function mergeSetters(arr: any[], dps: any[], style: Style) {
        var enumerator = style.Setters.GetEnumerator(true);
        var setter: Setter;
        while (enumerator.MoveNext()) {
            setter = <Setter>enumerator.Current;
            if (!(setter instanceof Fayde.Setter))
                continue;
            var propd = setter.Property;
            if (!propd)
                continue;
            if (dps[propd._ID])
                continue;
            dps[propd._ID] = setter;
            arr.push(setter);
        }
    }
    export function SingleStyleWalker(style: Style): IStyleWalker {
        var dps = [];
        var flattenedSetters = [];
        var cur = style;
        while (cur) {
            mergeSetters(flattenedSetters, dps, cur);
            cur = cur.BasedOn;
        }
        flattenedSetters.sort(setterSort);
        
        return {
            Step: function () {
                return flattenedSetters.shift();
            }
        };
    }
    export function MultipleStylesWalker(styles: Style[]): IStyleWalker {
        var flattenedSetters = [];
        if (styles) {
            var dps = [];
            var stylesSeen = [];
            var len = styles.length;
            for (var i = 0; i < length; i++) {
                var style = styles[i];
                while (style) {
                    if (stylesSeen.indexOf(style) > -1)
                        continue;
                    mergeSetters(flattenedSetters, dps, style);
                    stylesSeen.push(style);
                    style = style.BasedOn;
                }
            }
            flattenedSetters.sort(setterSort);
        }
        
        return {
            Step: function () {
                return flattenedSetters.shift();
            }
        };
    }
}