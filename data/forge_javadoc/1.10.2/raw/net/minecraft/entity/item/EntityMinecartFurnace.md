---
title: "EntityMinecartFurnace"
description: "public class EntityMinecartFurnace extends EntityMinecart"
package: "net/minecraft/entity/item"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/item/EntityMinecartFurnace.html"
sourceType: javadoc
---

# EntityMinecartFurnace

## Class signature

```java
public class EntityMinecartFurnace extends EntityMinecart
```

## Constructors

- `public EntityMinecartFurnace( World worldIn)`
- `public EntityMinecartFurnace( World worldIn, double x, double y, double z)`

## Methods

- `public static void registerFixesMinecartFurnace( DataFixer fixer)`
- `public EntityMinecart.Type getType()`
- `protected void entityInit()`
- `public void onUpdate()`
- `protected double getMaximumSpeed()`
- `public void killMinecart( DamageSource source)`
- `protected void moveAlongTrack( BlockPos pos, IBlockState state)`
- `protected void applyDrag()`
- `public boolean processInitialInteract( EntityPlayer player, @Nullable ItemStack stack, EnumHand hand)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `protected boolean isMinecartPowered()`
- `protected void setMinecartPowered(boolean p_94107_1_)`
- `public IBlockState getDefaultDisplayTile()`
