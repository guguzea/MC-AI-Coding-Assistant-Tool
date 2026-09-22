---
title: "EntityMinecartContainer"
description: "public abstract class EntityMinecartContainer extends EntityMinecart implements ILockableContainer, ILootContainer"
package: "net/minecraft/entity/item"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/item/EntityMinecartContainer.html"
sourceType: javadoc
---

# EntityMinecartContainer

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityMinecart → net.minecraft.entity.item.EntityMinecartContainer

## Class signature

```java
public abstract class EntityMinecartContainer extends EntityMinecart implements ILockableContainer, ILootContainer
```

## Constructors

- `EntityMinecartContainer(World worldIn)`
- `EntityMinecartContainer(World worldIn, double x, double y, double z)`

## Methods

- `static void addDataFixers(DataFixer p_190574_0_, java.lang.Class<?> p_190574_1_)`
- `void addLoot(EntityPlayer player)`
- `protected void applyDrag()`
- `Entity changeDimension(int dimensionIn, ITeleporter teleporter)`
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `ItemStack decrStackSize(int index, int count)`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `int getField(int id)`
- `int getFieldCount()`
- `int getInventoryStackLimit()`
- `LockCode getLockCode()`
- `ResourceLocation getLootTable()`
- `ItemStack getStackInSlot(int index)`
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean isEmpty()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isLocked()`
- `boolean isUsableByPlayer(EntityPlayer player)`
- `void killMinecart(DamageSource source)`
- `void markDirty()`
- `void openInventory(EntityPlayer player)`
- `boolean processInitialInteract(EntityPlayer player, EnumHand hand)`
- `protected void readEntityFromNBT(NBTTagCompound compound)`
- `ItemStack removeStackFromSlot(int index)`
- `void setDead()`
- `void setDropItemsWhenDead(boolean dropWhenDead)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `void setLockCode(LockCode code)`
- `void setLootTable(ResourceLocation lootTableIn, long lootTableSeedIn)`
- `protected void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `boolean dropContentsWhenDead`
- `IItemHandler itemHandler`
