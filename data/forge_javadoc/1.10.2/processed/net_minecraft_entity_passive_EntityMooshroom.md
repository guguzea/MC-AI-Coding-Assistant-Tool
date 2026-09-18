# EntityMooshroom

## Class signature

```java
public class EntityMooshroom extends EntityCow implements IShearable
```

## Constructors

- `public EntityMooshroom( World worldIn)`

## Methods

- `public static void registerFixesMooshroom( DataFixer fixer)`
- `public boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `public EntityMooshroom createChild( EntityAgeable ageable)`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`
- `@Nullable protected ResourceLocation getLootTable()`

## Description

Checks if the object is currently shearable Example: Sheep return false when they have no wool