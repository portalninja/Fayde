/// <reference path="../Runtime/Nullstone.js" />
/// <reference path="../Runtime/LinkedList.js"/>
/// CODE

//#region LayoutPass
var LayoutPass = Nullstone.Create("LayoutPass");

LayoutPass.Instance.Init = function () {
    this._MeasureList = [];
    this._ArrangeList = [];
    this._SizeList = [];
    this._Count = 0;
    this._Updated = false;
};

LayoutPass.MaxCount = 250;

Nullstone.FinishCreate(LayoutPass);
//#endregion