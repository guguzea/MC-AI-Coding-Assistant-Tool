---
title: "EntityMinecartContainer"
description: "Retrieves the handler for the capability requested on the specific side."
package: "net/minecraft/entity/item"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/item/EntityMinecartContainer.html"
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
- `@Nullable public ItemStack getStackInSlot(int index)`
- `@Nullable public ItemStack decrStackSize(int index, int count)`
- `@Nullable public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, @Nullable ItemStack stack)`
- `public void markDirty()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public int getInventoryStackLimit()`
- `@Nullable public Entity changeDimension(int dimensionIn)`
- `public void setDead()`
- `public void setDropItemsWhenDead(boolean dropWhenDead)`
- `public static void registerFixesMinecartContainer( DataFixer fixer, java.lang.String name)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean processInitialInteract( EntityPlayer player, @Nullable ItemStack stack, EnumHand hand)`
- `protected void applyDrag()`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public boolean isLocked()`
- `public void setLockCode( LockCode code)`
- `public LockCode getLockCode()`
- `public void addLoot(@Nullable EntityPlayer player)`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`
- `public void clear()`
- `public void setLootTable( ResourceLocation lootTableIn, long lootTableSeedIn)`
- `public ResourceLocation getLootTable()`

## Description

Retrieves the handler for the capability requested on the specific side.
