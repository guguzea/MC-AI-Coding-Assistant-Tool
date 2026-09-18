---
title: "EntityItemFrame"
description: "public class EntityItemFrame extends EntityHanging"
package: "net/minecraft/entity/item"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/item/EntityItemFrame.html"
sourceType: javadoc
---

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
- `public void onBroken(@Nullable Entity brokenEntity)`
- `public void playPlaceSound()`
- `public void dropItemOrSelf(@Nullable Entity entityIn, boolean p_146065_2_)`
- `public ItemStack getDisplayedItem()`
- `public void setDisplayedItem( ItemStack stack)`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public int getRotation()`
- `public void setItemRotation(int rotationIn)`
- `public static void registerFixesItemFrame( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean processInitialInteract( EntityPlayer player, EnumHand hand)`
- `public int getAnalogOutput()`
