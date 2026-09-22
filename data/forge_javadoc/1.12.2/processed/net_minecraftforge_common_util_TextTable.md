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