# BlockDispenser

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockDispenser

## Class signature

```java
public class BlockDispenser extends BlockContainer
```

## Constructors

- `BlockDispenser()`

## Methods

- `void breakBlock(World p_149749_1_, int p_149749_2_, int p_149749_3_, int p_149749_4_, Block p_149749_5_, int p_149749_6_)`
- `TileEntity createNewTileEntity(World p_149915_1_, int p_149915_2_)`
- `static EnumFacing func_149937_b(int p_149937_0_)`
- `static IPosition func_149939_a(IBlockSource p_149939_0_)`
- `protected IBehaviorDispenseItem func_149940_a(ItemStack p_149940_1_)`
- `protected void func_149941_e(World p_149941_1_, int p_149941_2_, int p_149941_3_, int p_149941_4_)`
- `int getComparatorInputOverride(World p_149736_1_, int p_149736_2_, int p_149736_3_, int p_149736_4_, int p_149736_5_)`
- `IIcon getIcon(int p_149691_1_, int p_149691_2_)`
- `boolean hasComparatorInputOverride()`
- `boolean onBlockActivated(World p_149727_1_, int p_149727_2_, int p_149727_3_, int p_149727_4_, EntityPlayer p_149727_5_, int p_149727_6_, float p_149727_7_, float p_149727_8_, float p_149727_9_)`
- `void onBlockAdded(World p_149726_1_, int p_149726_2_, int p_149726_3_, int p_149726_4_)`
- `void onBlockPlacedBy(World p_149689_1_, int p_149689_2_, int p_149689_3_, int p_149689_4_, EntityLivingBase p_149689_5_, ItemStack p_149689_6_)`
- `void onNeighborBlockChange(World p_149695_1_, int p_149695_2_, int p_149695_3_, int p_149695_4_, Block p_149695_5_)`
- `void registerBlockIcons(IIconRegister p_149651_1_)`
- `int tickRate(World p_149738_1_)`
- `void updateTick(World p_149674_1_, int p_149674_2_, int p_149674_3_, int p_149674_4_, java.util.Random p_149674_5_)`

## Fields

- `static IRegistry dispenseBehaviorRegistry`
- `protected java.util.Random field_149942_b`
- `protected IIcon field_149944_M`
- `protected IIcon field_149945_N`
- `protected IIcon field_149946_O`