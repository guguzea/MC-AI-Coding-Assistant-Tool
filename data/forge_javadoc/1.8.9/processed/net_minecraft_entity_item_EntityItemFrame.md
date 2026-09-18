# EntityItemFrame

## Class signature

```java
public class EntityItemFrame extends EntityHanging
```

## Constructors

- `public EntityItemFrame( World worldIn)`
- `public EntityItemFrame( World worldIn, BlockPos p_i45852_2_, EnumFacing p_i45852_3_)`

## Methods

- `protected void entityInit()`
- `public float getCollisionBorderSize()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public int getWidthPixels()`
- `public int getHeightPixels()`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void onBroken( Entity brokenEntity)`
- `public void dropItemOrSelf( Entity p_146065_1_, boolean p_146065_2_)`
- `public ItemStack getDisplayedItem()`
- `public void setDisplayedItem( ItemStack p_82334_1_)`
- `public int getRotation()`
- `public void setItemRotation(int p_82336_1_)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public boolean interactFirst( EntityPlayer playerIn)`
- `public int func_174866_q()`

## Description

Called when the entity is attacked.