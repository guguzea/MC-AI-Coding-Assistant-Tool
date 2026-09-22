# BlockFlower

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockFlower

## Class signature

```java
public abstract class BlockFlower extends BlockBush
```

## Constructors

- `BlockFlower()`

## Methods

- `protected BlockState createBlockState()`
- `int damageDropped(IBlockState state)` — Gets the metadata of the item this Block can drop.
- `abstract BlockFlower.EnumFlowerColor getBlockType()` — Get the Type of this flower (Yellow/Red)
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `Block.EnumOffsetType getOffsetType()` — Get the OffsetType for this Block.
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)` — returns a list of blocks with the same ID, but different meta (eg: wood returns 4 blocks)
- `IProperty<BlockFlower.EnumFlowerType> getTypeProperty()`

## Fields

- `protected PropertyEnum<BlockFlower.EnumFlowerType> type`