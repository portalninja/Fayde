﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Parser.Elements;
using Parser;

namespace Parser.TypeConverters
{
    internal enum HorizontalAlignmentEnum
    {
        Left,
        Center,
        Right,
        Stretch
    }

    public class HorizontalAlignment: IJsonSerializable
    {
        private HorizontalAlignmentEnum _alignment;

        internal HorizontalAlignment(HorizontalAlignmentEnum alignment)
        {
            _alignment = alignment;
        }

        public string  toJson(int tabIndents)
        {
            return string.Format("{0}.{1}", this.GetType().Name, _alignment.ToString());
        }
    }

    public class HorizontalAlignmentConverter: TypeConverterAttribute
    {
        public override object Convert(string from)
        {
            return new HorizontalAlignment((HorizontalAlignmentEnum)Enum.Parse(typeof(HorizontalAlignmentEnum), from));
        }
    }
}
