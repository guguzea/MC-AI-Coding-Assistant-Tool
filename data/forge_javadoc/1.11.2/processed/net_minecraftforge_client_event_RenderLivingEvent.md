# RenderLivingEvent

## Class signature

```java
public abstract class RenderLivingEvent<T extends EntityLivingBase > extends Event
```

## Constructors

- `public RenderLivingEvent( EntityLivingBase entity, RenderLivingBase < T > renderer, double x, double y, double z)`

## Methods

- `public EntityLivingBase getEntity()`
- `public RenderLivingBase < T > getRenderer()`
- `public double getX()`
- `public double getY()`
- `public double getZ()`