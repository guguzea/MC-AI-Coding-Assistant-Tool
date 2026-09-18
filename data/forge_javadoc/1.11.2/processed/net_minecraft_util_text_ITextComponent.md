# ITextComponent

## Class signature

```java
public interface ITextComponent extends java.lang.Iterable< ITextComponent >
```

## Methods

- `ITextComponent setStyle( Style style)`
- `Style getStyle()`
- `ITextComponent appendText(java.lang.String text)`
- `ITextComponent appendSibling( ITextComponent component)`
- `java.lang.String getUnformattedComponentText()`
- `java.lang.String getUnformattedText()`
- `java.lang.String getFormattedText()`
- `java.util.List< ITextComponent > getSiblings()`
- `ITextComponent createCopy()`