# BlockSlime

## Class signature

```java
public class BlockSlime extends BlockBreakable
```

## Constructors

- `public BlockSlime()`

## Methods

- `public EnumWorldBlockLayer getBlockLayer()`
- `public void onFallenUpon( World worldIn, BlockPos pos, Entity entityIn, float fallDistance)`
- `public void onLanded( World worldIn, Entity entityIn)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, Entity entityIn)`

## Description

Triggered whenever an entity collides with this block (enters into the block)