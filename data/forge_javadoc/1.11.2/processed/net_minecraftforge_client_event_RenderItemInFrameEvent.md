# RenderItemInFrameEvent

## Class signature

```java
public class RenderItemInFrameEvent extends Event
```

## Constructors

- `public RenderItemInFrameEvent( EntityItemFrame itemFrame, RenderItemFrame renderItemFrame)`

## Methods

- `@Nonnull public ItemStack getItem()`
- `public EntityItemFrame getEntityItemFrame()`
- `public RenderItemFrame getRenderer()`

## Description

This event is called when an item is rendered in an item frame. You can set canceled to do no further vanilla processing.