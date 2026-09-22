# DrawBlockHighlightEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.DrawBlockHighlightEvent

## Class signature

```java
public class DrawBlockHighlightEvent extends Event
```

## Constructors

- `DrawBlockHighlightEvent(RenderGlobal context, EntityPlayer player, RayTraceResult target, int subID, float partialTicks)`

## Methods

- `RenderGlobal getContext()`
- `float getPartialTicks()`
- `EntityPlayer getPlayer()`
- `int getSubID()`
- `RayTraceResult getTarget()`