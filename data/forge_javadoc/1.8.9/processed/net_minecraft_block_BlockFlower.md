# BlockFlower

## Class signature

```java
public abstract class BlockFlower extends BlockBush
```

## Constructors

- `protected BlockFlower()`

## Methods

- `public int damageDropped( IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public IBlockState getStateFromMeta(int meta)`
- `public abstract BlockFlower.EnumFlowerColor getBlockType()`
- `public IProperty < BlockFlower.EnumFlowerType > getTypeProperty()`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public Block.EnumOffsetType getOffsetType()`

## Description

Gets the metadata of the item this Block can drop.