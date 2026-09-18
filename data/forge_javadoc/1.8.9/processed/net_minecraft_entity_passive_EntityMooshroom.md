# EntityMooshroom

## Class signature

```java
public class EntityMooshroom extends EntityCow implements IShearable
```

## Constructors

- `public EntityMooshroom( World worldIn)`

## Methods

- `public boolean interact( EntityPlayer player)`
- `public EntityMooshroom createChild( EntityAgeable ageable)`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.