# ITextComponent

## Class signature

```java
public interface ITextComponent extends java.lang.Iterable<ITextComponent>
```

## Methods

- `ITextComponent appendSibling(ITextComponent component)`
- `ITextComponent appendText(java.lang.String text)`
- `ITextComponent createCopy()`
- `java.lang.String getFormattedText()`
- `java.util.List<ITextComponent> getSiblings()`
- `Style getStyle()`
- `java.lang.String getUnformattedComponentText()`
- `java.lang.String getUnformattedText()`
- `ITextComponent setStyle(Style style)`