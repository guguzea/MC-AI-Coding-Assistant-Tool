# EntityViewRenderEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.EntityViewRenderEvent

## Class signature

```java
public abstract class EntityViewRenderEvent extends Event
```

## Constructors

- `EntityViewRenderEvent(EntityRenderer renderer, Entity entity, IBlockState state, double renderPartialTicks)`

## Methods

- `Entity getEntity()`
- `EntityRenderer getRenderer()`
- `double getRenderPartialTicks()`
- `IBlockState getState()`