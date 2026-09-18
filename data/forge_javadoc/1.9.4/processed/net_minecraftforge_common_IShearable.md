# IShearable

## Class signature

```java
public interface IShearable
```

## Methods

- `boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

This allows for mods to create there own Shear-like items and have them interact with Blocks/Entities without extra work. Also, if your block/entity supports the Shears, this allows you to support mod