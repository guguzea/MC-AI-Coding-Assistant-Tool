# PlayerEvent.HarvestCheck

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerEvent.HarvestCheck

## Class signature

```java
public static class PlayerEvent.HarvestCheck extends PlayerEvent
```

## Constructors

- `HarvestCheck(EntityPlayer player, IBlockState state, boolean success)`

## Methods

- `boolean canHarvest()`
- `IBlockState getTargetBlock()`
- `void setCanHarvest(boolean success)`