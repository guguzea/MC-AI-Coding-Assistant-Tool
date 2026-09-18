---
title: "LootContext"
description: "public class LootContext extends java.lang.Object"
package: "net/minecraft/world/storage/loot"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/storage/loot/LootContext.html"
sourceType: javadoc
---

# LootContext

## Class signature

```java
public class LootContext extends java.lang.Object
```

## Constructors

- `public LootContext(float luckIn, WorldServer worldIn, LootTableManager lootTableManagerIn, @Nullable Entity lootedEntityIn, @Nullable EntityPlayer playerIn, @Nullable DamageSource damageSourceIn)`

## Methods

- `@Nullable public Entity getLootedEntity()`
- `@Nullable public Entity getKillerPlayer()`
- `@Nullable public Entity getKiller()`
- `public boolean addLootTable( LootTable lootTableIn)`
- `public void removeLootTable( LootTable lootTableIn)`
- `public LootTableManager getLootTableManager()`
- `public float getLuck()`
- `@Nullable public Entity getEntity( LootContext.EntityTarget target)`
- `public WorldServer getWorld()`
- `public int getLootingModifier()`
