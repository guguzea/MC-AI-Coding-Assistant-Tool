# PlayerEvent.BreakSpeed

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerEvent.BreakSpeed

## Class signature

```java
public static class PlayerEvent.BreakSpeed extends PlayerEvent
```

## Constructors

- `BreakSpeed(EntityPlayer player, IBlockState state, float original, BlockPos pos)`

## Methods

- `float getNewSpeed()`
- `float getOriginalSpeed()`
- `BlockPos getPos()`
- `IBlockState getState()`
- `void setNewSpeed(float newSpeed)`