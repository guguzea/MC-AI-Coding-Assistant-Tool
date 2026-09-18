---
title: "EntityMinecartCommandBlock"
description: "public class EntityMinecartCommandBlock extends EntityMinecart"
package: "net/minecraft/entity/item"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/item/EntityMinecartCommandBlock.html"
sourceType: javadoc
---

# EntityMinecartCommandBlock

## Class signature

```java
public class EntityMinecartCommandBlock extends EntityMinecart
```

## Constructors

- `public EntityMinecartCommandBlock( World worldIn)`
- `public EntityMinecartCommandBlock( World worldIn, double x, double y, double z)`

## Methods

- `protected void entityInit()`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `public EntityMinecart.Type getType()`
- `public IBlockState getDefaultDisplayTile()`
- `public CommandBlockBaseLogic getCommandBlockLogic()`
- `public void onActivatorRailPass(int x, int y, int z, boolean receivingPower)`
- `public boolean processInitialInteract( EntityPlayer player, @Nullable ItemStack stack, EnumHand hand)`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public boolean ignoreItemEntityData()`
