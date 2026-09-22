# RenderSpecificHandEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.RenderSpecificHandEvent

## Class signature

```java
public class RenderSpecificHandEvent extends Event
```

## Constructors

- `RenderSpecificHandEvent(EnumHand hand, float partialTicks, float interpolatedPitch, float swingProgress, float equipProgress, ItemStack stack)`

## Methods

- `float getEquipProgress()`
- `EnumHand getHand()`
- `float getInterpolatedPitch()`
- `ItemStack getItemStack()`
- `float getPartialTicks()`
- `float getSwingProgress()`