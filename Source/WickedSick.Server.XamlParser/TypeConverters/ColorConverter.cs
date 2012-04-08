﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WickedSick.Server.XamlParser.Elements;
using System.Reflection;

namespace WickedSick.Server.XamlParser.TypeConverters
{
    public class Color : IJsonSerializable
    {
        public static Color FromHex(string hexString)
        {
            return new Color() { HexString = hexString };
        }

        public static Color FromUInt32(UInt32 uint32)
        {
            return new Color() { HexString = string.Format("#{0:x2}", uint32).ToUpper() };
        }

        private string HexString { get; set; }

        public string toJson(int tabIndents)
        {
            return string.Format("Color.FromHex(\"{0}\")", HexString);
        }
    }

    public class ColorConverter: ITypeConverter
    {
        public object Convert(string from)
        {
            return Color.FromHex(from);
        }

        public Type ConversionType
        {
            get { return typeof(Color); }
        }
    }
}
