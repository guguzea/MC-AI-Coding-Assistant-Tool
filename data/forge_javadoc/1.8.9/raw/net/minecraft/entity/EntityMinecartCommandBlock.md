---
title: "EntityMinecartCommandBlock"
description: "public class EntityMinecartCommandBlock extends EntityMinecart"
package: "net/minecraft/entity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityMinecartCommandBlock.html"
sourceType: javadoc
---

# EntityMinecartCommandBlock

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityMinecart → net.minecraft.entity.EntityMinecartCommandBlock

## Class signature

```java
public class EntityMinecartCommandBlock extends EntityMinecart
```

## Methods

- `protected void entityInit()`
- `CommandBlockLogic getCommandBlockLogic()`
- `IBlockState getDefaultDisplayTile()`
- `EntityMinecart.EnumMinecartType getMinecartType()`
- `boolean interactFirst(EntityPlayer playerIn)` — First layer of player interaction
- `void onActivatorRailPass(int x, int y, int z, boolean receivingPower)` — Called every tick the minecart is on an activator rail.
- `void onDataWatcherUpdate(int dataID)`
- `protected void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `protected void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityMinecartCommandBlock`
- `EntityMinecartCommandBlock`
