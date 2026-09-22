# BlockSand

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockFalling → net.minecraft.block.BlockSand

## Class signature

```java
public class BlockSand extends BlockFalling
```

## Constructors

- `BlockSand()`

## Methods

- `protected BlockState createBlockState()`
- `int damageDropped(IBlockState state)` — Gets the metadata of the item this Block can drop.
- `MapColor getMapColor(IBlockState state)` — Get the MapColor for this Block and the given BlockState
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)` — returns a list of blocks with the same ID, but different meta (eg: wood returns 4 blocks)

## Fields

- `static PropertyEnum<BlockSand.EnumType> VARIANT`