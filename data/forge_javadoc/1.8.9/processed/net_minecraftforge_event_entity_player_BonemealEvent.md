# BonemealEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.BonemealEvent

## Class signature

```java
public class BonemealEvent extends PlayerEvent
```

## Constructors

- `BonemealEvent(EntityPlayer player, World world, BlockPos pos, IBlockState block)`

## Fields

- `IBlockState block`
- `BlockPos pos`
- `World world` — This event is called when a player attempts to use Bonemeal on a block.