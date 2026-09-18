---
title: "AbstractChestHorse"
description: "public abstract class AbstractChestHorse extends AbstractHorse"
package: "net/minecraft/entity/passive"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/passive/AbstractChestHorse.html"
sourceType: javadoc
---

# AbstractChestHorse

## Class signature

```java
public abstract class AbstractChestHorse extends AbstractHorse
```

## Constructors

- `public AbstractChestHorse( World worldIn)`

## Methods

- `protected void entityInit()`
- `protected void applyEntityAttributes()`
- `public boolean hasChest()`
- `public void setChested(boolean chested)`
- `protected int getInventorySize()`
- `public double getMountedYOffset()`
- `protected SoundEvent getAngrySound()`
- `public void onDeath( DamageSource cause)`
- `public static void registerFixesAbstractChestHorse( DataFixer fixer, java.lang.Class<?> entityClass)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `public boolean processInteract( EntityPlayer player, EnumHand hand)`
- `protected void playChestEquipSound()`
- `public int getInventoryColumns()`
