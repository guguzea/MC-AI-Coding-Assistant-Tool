# EntityFallingBlock

## Class signature

```java
public class EntityFallingBlock extends Entity
```

## Constructors

- `public EntityFallingBlock( World worldIn)`
- `public EntityFallingBlock( World worldIn, double x, double y, double z, IBlockState fallingBlockState)`

## Methods

- `public void setOrigin( BlockPos p_184530_1_)`
- `public BlockPos getOrigin()`
- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `public boolean canBeCollidedWith()`
- `public void onUpdate()`
- `public void fall(float distance, float damageMultiplier)`
- `public static void registerFixesFallingBlock( DataFixer fixer)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `public void setHurtEntities(boolean p_145806_1_)`
- `public void addEntityCrashInfo( CrashReportCategory category)`
- `public World getWorldObj()`
- `public boolean canRenderOnFire()`
- `@Nullable public IBlockState getBlock()`
- `public boolean ignoreItemEntityData()`