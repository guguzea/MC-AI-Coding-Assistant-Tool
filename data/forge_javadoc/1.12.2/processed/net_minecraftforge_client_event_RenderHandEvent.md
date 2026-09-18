# RenderHandEvent

## Class signature

```java
public class RenderHandEvent extends Event
```

## Constructors

- `public RenderHandEvent( RenderGlobal context, float partialTicks, int renderPass)`

## Methods

- `public RenderGlobal getContext()`
- `public float getPartialTicks()`
- `public int getRenderPass()`

## Description

This event is fired on MinecraftForge.EVENT_BUS before both hands are rendered. Canceling this event prevents either hand from being rendered, and prevents RenderSpecificHandEvent from firing. TODO Th