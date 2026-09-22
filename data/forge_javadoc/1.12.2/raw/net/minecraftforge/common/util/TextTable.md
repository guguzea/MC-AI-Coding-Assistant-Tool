---
title: "TextTable"
description: "public class TextTable extends java.lang.Object"
package: "net/minecraftforge/common/util"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/util/TextTable.html"
sourceType: javadoc
---

# TextTable

**Inheritance:** java.lang.Object → net.minecraftforge.common.util.TextTable

## Class signature

```java
public class TextTable extends java.lang.Object
```

## Constructors

- `TextTable(java.util.List<TextTable.Column> columns)`

## Methods

- `void add(java.lang.Object... values)`
- `void append(java.lang.StringBuilder destination, java.lang.String lineEnding)` — Appends the data formatted as a table to the given string builder.
- `java.lang.String build(java.lang.String lineEnding)`
- `void clear()`
- `static TextTable.Column column(java.lang.String header)`
- `static TextTable.Column column(java.lang.String header, TextTable.Alignment alignment)`
- `java.util.List<TextTable.Column> getColumns()`
