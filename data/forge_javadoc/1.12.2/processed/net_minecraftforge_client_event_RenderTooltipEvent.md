# RenderTooltipEvent

## Class signature

```java
public abstract class RenderTooltipEvent extends Event
```

## Constructors

- `public RenderTooltipEvent( ItemStack stack, java.util.List<java.lang.String> lines, int x, int y, FontRenderer fr)`

## Methods

- `public ItemStack getStack()`
- `public java.util.List<java.lang.String> getLines()`
- `public int getX()`
- `public int getY()`
- `public FontRenderer getFontRenderer()`

## Description

A set of events which are fired at various points during tooltip rendering. Can be used to change the rendering parameters, draw something extra, etc. Do not use this event directly, use one of the su