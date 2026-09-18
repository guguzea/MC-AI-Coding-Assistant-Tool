# EntitySheep

## Class signature

```java
public class EntitySheep extends EntityAnimal implements IShearable
```

## Constructors

- `public EntitySheep( World worldIn)`

## Methods

- `public static float[] func_175513_a( EnumDyeColor dyeColor)`
- `protected void updateAITasks()`
- `public void onLivingUpdate()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `protected Item getDropItem()`
- `public void handleStatusUpdate(byte id)`
- `public boolean interact( EntityPlayer player)`
- `public float getHeadRotationPointY(float p_70894_1_)`
- `public float getHeadRotationAngleX(float p_70890_1_)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public EnumDyeColor getFleeceColor()`
- `public void setFleeceColor( EnumDyeColor color)`
- `public boolean getSheared()`
- `public void setSheared(boolean sheared)`
- `public static EnumDyeColor getRandomSheepColor(java.util.Random random)`
- `public EntitySheep createChild( EntityAgeable ageable)`
- `public void eatGrassBonus()`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `public float getEyeHeight()`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

Drop 0-2 items of this living's type