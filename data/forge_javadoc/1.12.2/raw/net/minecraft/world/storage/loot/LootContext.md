---
title: "LootContext"
description: "public class LootContext extends java.lang.Object"
package: "net/minecraft/world/storage/loot"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/LootContext.html"
sourceType: javadoc
---

# LootContext

## Class signature

```java
public class LootContext extends java.lang.Object
```

## Constructors

- `public LootContext(float luckIn, WorldServer worldIn, LootTableManager lootTableManagerIn, Entity lootedEntityIn, EntityPlayer playerIn, DamageSource damageSourceIn)`

## Methods

- `public Entity getLootedEntity()`
- `public Entity getKillerPlayer()`
- `public Entity getKiller()`
- `public boolean addLootTable( LootTable lootTableIn)`
- `public void removeLootTable( LootTable lootTableIn)`
- `public LootTableManager getLootTableManager()`
- `public float getLuck()`
- `public Entity getEntity( LootContext.EntityTarget target)`
- `public WorldServer getWorld()`
- `public int getLootingModifier()`
