---
title: "EntityMinecart"
description: "public abstract class EntityMinecart extends Entity"
package: "net/minecraft/entity/item"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/item/EntityMinecart.html"
sourceType: javadoc
---

# EntityMinecart

## Class signature

```java
public abstract class EntityMinecart extends Entity
```

## Constructors

- `public EntityMinecart( World p_i1712_1_)`
- `public EntityMinecart( World p_i1713_1_, double p_i1713_2_, double p_i1713_4_, double p_i1713_6_)`

## Methods

- `public static EntityMinecart createMinecart( World p_94090_0_, double p_94090_1_, double p_94090_3_, double p_94090_5_, int p_94090_7_)`
- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `public AxisAlignedBB getCollisionBox( Entity p_70114_1_)`
- `public AxisAlignedBB getBoundingBox()`
- `public boolean canBePushed()`
- `public double getMountedYOffset()`
- `public boolean attackEntityFrom( DamageSource p_70097_1_, float p_70097_2_)`
- `public void killMinecart( DamageSource p_94095_1_)`
- `public void performHurtAnimation()`
- `public boolean canBeCollidedWith()`
- `public void setDead()`
- `public void onUpdate()`
- `public void onActivatorRailPass(int p_96095_1_, int p_96095_2_, int p_96095_3_, boolean p_96095_4_)`
- `protected void func_94088_b(double p_94088_1_)`
- `protected void func_145821_a(int p_145821_1_, int p_145821_2_, int p_145821_3_, double p_145821_4_, double p_145821_6_, Block p_145821_8_, int p_145821_9_)`
- `protected void applyDrag()`
- `public Vec3 func_70495_a(double p_70495_1_, double p_70495_3_, double p_70495_5_, double p_70495_7_)`
- `public Vec3 func_70489_a(double p_70489_1_, double p_70489_3_, double p_70489_5_)`
- `protected void readEntityFromNBT( NBTTagCompound p_70037_1_)`
- `protected void writeEntityToNBT( NBTTagCompound p_70014_1_)`
- `public float getShadowSize()`
- `public void applyEntityCollision( Entity p_70108_1_)`
- `public void setPositionAndRotation2(double p_70056_1_, double p_70056_3_, double p_70056_5_, float p_70056_7_, float p_70056_8_, int p_70056_9_)`
- `public void setDamage(float p_70492_1_)`
- `public void setVelocity(double p_70016_1_, double p_70016_3_, double p_70016_5_)`
- `public float getDamage()`
- `public void setRollingAmplitude(int p_70497_1_)`
- `public int getRollingAmplitude()`
- `public void setRollingDirection(int p_70494_1_)`
- `public int getRollingDirection()`
- `public abstract int getMinecartType()`
- `public Block func_145820_n()`
- `public Block func_145817_o()`
- `public int getDisplayTileData()`
- `public int getDefaultDisplayTileData()`
- `public int getDisplayTileOffset()`
- `public int getDefaultDisplayTileOffset()`
- `public void func_145819_k(int p_145819_1_)`
- `public void setDisplayTileData(int p_94092_1_)`
- `public void setDisplayTileOffset(int p_94086_1_)`
- `public boolean hasDisplayTile()`
- `public void setHasDisplayTile(boolean p_94096_1_)`
- `public void setMinecartName(java.lang.String p_96094_1_)`
- `public java.lang.String getCommandSenderName()`
- `public boolean hasCustomInventoryName()`
- `public java.lang.String func_95999_t()`
