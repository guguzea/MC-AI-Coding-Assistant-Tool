---
title: "EntityMinecartContainer"
description: "Retrieves the handler for the capability requested on the specific side."
package: "net/minecraft/entity/item"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/item/EntityMinecartContainer.html"
sourceType: javadoc
---

# EntityMinecartContainer

## Class signature

```java
public abstract class EntityMinecartContainer extends EntityMinecart implements ILockableContainer , ILootContainer
```

## Constructors

- `public EntityMinecartContainer( World worldIn)`
- `public EntityMinecartContainer( World worldIn, double x, double y, double z)`

## Methods

- `public void killMinecart( DamageSource source)`
- `public boolean isEmpty()`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public void markDirty()`
- `public boolean isUsableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public int getInventoryStackLimit()`
- `@Nullable public Entity changeDimension(int dimensionIn)`
- `public void setDead()`
- `public void setDropItemsWhenDead(boolean dropWhenDead)`
- `public static void addDataFixers( DataFixer p_190574_0_, java.lang.Class<?> p_190574_1_)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean processInitialInteract( EntityPlayer player, EnumHand hand)`
- `protected void applyDrag()`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public boolean isLocked()`
- `public void setLockCode( LockCode code)`
- `public LockCode getLockCode()`
- `public void addLoot(@Nullable EntityPlayer player)`
- `@Nullable public <T> T getCapability( Capability <T> capability, @Nullable EnumFacing facing)`
- `public boolean hasCapability( Capability <?> capability, @Nullable EnumFacing facing)`
- `public void clear()`
- `public void setLootTable( ResourceLocation lootTableIn, long lootTableSeedIn)`
- `public ResourceLocation getLootTable()`

## Description

Retrieves the handler for the capability requested on the specific side.
