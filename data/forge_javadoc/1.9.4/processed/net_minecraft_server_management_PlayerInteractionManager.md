# PlayerInteractionManager

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerInteractionManager

## Class signature

```java
public class PlayerInteractionManager extends java.lang.Object
```

## Constructors

- `PlayerInteractionManager(World worldIn)`

## Methods

- `void blockRemoving(BlockPos pos)`
- `void cancelDestroyingBlock()`
- `double getBlockReachDistance()`
- `WorldSettings.GameType getGameType()`
- `void initializeGameType(WorldSettings.GameType type)`
- `boolean isCreative()`
- `void onBlockClicked(BlockPos pos, EnumFacing side)`
- `EnumActionResult processRightClick(EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand)`
- `EnumActionResult processRightClickBlock(EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void setBlockReachDistance(double distance)`
- `void setGameType(WorldSettings.GameType type)`
- `void setWorld(WorldServer serverWorld)`
- `boolean survivalOrAdventure()`
- `boolean tryHarvestBlock(BlockPos pos)`
- `void updateBlockRemoving()`

## Fields

- `World theWorld`
- `EntityPlayerMP thisPlayerMP`