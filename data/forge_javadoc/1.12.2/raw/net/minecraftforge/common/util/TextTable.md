---
title: "TextTable"
description: "Utility to format data into a textual (markdown-compliant) table."
package: "net/minecraftforge/common/util"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/util/TextTable.html"
sourceType: javadoc
---

# TextTable

## Class signature

```java
public class TextTable extends java.lang.Object
```

## Constructors

- `public TextTable(java.util.List< TextTable.Column > columns)`

## Methods

- `public static TextTable.Column column(java.lang.String header)`
- `public static TextTable.Column column(java.lang.String header, TextTable.Alignment alignment)`
- `public java.lang.String build(java.lang.String lineEnding)`
- `public void append(java.lang.StringBuilder destination, java.lang.String lineEnding)`
- `public void add(java.lang.Object... values)`
- `public void clear()`
- `public java.util.List< TextTable.Column > getColumns()`

## Description

Utility to format data into a textual (markdown-compliant) table.
