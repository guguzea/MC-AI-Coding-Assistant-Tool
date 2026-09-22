# RenderLivingEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.RenderLivingEvent<T>

## Class signature

```java
public abstract class RenderLivingEvent<T extends EntityLivingBase> extends Event
```

## Constructors

- `RenderLivingEvent(EntityLivingBase entity, RenderLivingBase<T> renderer, double x, double y, double z)`

## Methods

- `EntityLivingBase getEntity()`
- `RenderLivingBase<T> getRenderer()`
- `double getX()`
- `double getY()`
- `double getZ()`