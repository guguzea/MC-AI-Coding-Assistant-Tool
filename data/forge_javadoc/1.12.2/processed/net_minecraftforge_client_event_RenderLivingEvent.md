# RenderLivingEvent

## Class signature

```java
public abstract class RenderLivingEvent<T extends EntityLivingBase > extends Event
```

## Constructors

- `public RenderLivingEvent( EntityLivingBase entity, RenderLivingBase < T > renderer, float partialRenderTick, double x, double y, double z)`

## Methods

- `@Deprecated public RenderLivingEvent( EntityLivingBase entity, RenderLivingBase < T > renderer, double x, double y, double z)`
- `public EntityLivingBase getEntity()`
- `public RenderLivingBase < T > getRenderer()`
- `public float getPartialRenderTick()`
- `public double getX()`
- `public double getY()`
- `public double getZ()`

## Description

Deprecated.