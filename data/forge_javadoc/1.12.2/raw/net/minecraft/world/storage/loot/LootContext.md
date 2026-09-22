---
title: "LootContext"
description: "public class LootContext extends java.lang.Object"
package: "net/minecraft/world/storage/loot"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/LootContext.html"
sourceType: javadoc
---

# LootContext

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.LootContext

## Class signature

```java
public class LootContext extends java.lang.Object
```

## Constructors

- `LootContext(float luckIn, WorldServer worldIn, LootTableManager lootTableManagerIn, Entity lootedEntityIn, EntityPlayer playerIn, DamageSource damageSourceIn)`

## Methods

- `boolean addLootTable(LootTable lootTableIn)`
- `Entity getEntity(LootContext.EntityTarget target)`
- `Entity getKiller()`
- `Entity getKillerPlayer()`
- `Entity getLootedEntity()`
- `int getLootingModifier()`
- `LootTableManager getLootTableManager()`
- `float getLuck()`
- `WorldServer getWorld()`
- `void removeLootTable(LootTable lootTableIn)`
