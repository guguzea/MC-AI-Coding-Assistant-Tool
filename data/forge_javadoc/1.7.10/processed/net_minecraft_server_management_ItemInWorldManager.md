# ItemInWorldManager

**Inheritance:** java.lang.Object → net.minecraft.server.management.ItemInWorldManager

## Class signature

```java
public class ItemInWorldManager extends java.lang.Object
```

## Constructors

- `ItemInWorldManager(World p_i1524_1_)`

## Methods

- `boolean activateBlockOrUseItem(EntityPlayer p_73078_1_, World p_73078_2_, ItemStack p_73078_3_, int p_73078_4_, int p_73078_5_, int p_73078_6_, int p_73078_7_, float p_73078_8_, float p_73078_9_, float p_73078_10_)`
- `void cancelDestroyingBlock(int p_73073_1_, int p_73073_2_, int p_73073_3_)`
- `WorldSettings.GameType getGameType()`
- `void initializeGameType(WorldSettings.GameType p_73077_1_)`
- `boolean isCreative()`
- `void onBlockClicked(int p_73074_1_, int p_73074_2_, int p_73074_3_, int p_73074_4_)`
- `void setGameType(WorldSettings.GameType p_73076_1_)`
- `void setWorld(WorldServer p_73080_1_)`
- `boolean tryHarvestBlock(int p_73084_1_, int p_73084_2_, int p_73084_3_)`
- `boolean tryUseItem(EntityPlayer p_73085_1_, World p_73085_2_, ItemStack p_73085_3_)`
- `void uncheckedTryHarvestBlock(int p_73082_1_, int p_73082_2_, int p_73082_3_)`
- `void updateBlockRemoving()`

## Fields

- `World theWorld`
- `EntityPlayerMP thisPlayerMP`