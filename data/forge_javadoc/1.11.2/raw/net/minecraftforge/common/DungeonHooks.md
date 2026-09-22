---
title: "DungeonHooks"
description: "public class DungeonHooks extends java.lang.Object"
package: "net/minecraftforge/common"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/DungeonHooks.html"
sourceType: javadoc
---

# DungeonHooks

**Inheritance:** java.lang.Object → net.minecraftforge.common.DungeonHooks

## Class signature

```java
public class DungeonHooks extends java.lang.Object
```

## Constructors

- `DungeonHooks()`

## Methods

- `static float addDungeonMob(ResourceLocation name, int rarity)` — Adds a mob to the possible list of creatures the spawner will create.
- `static ResourceLocation getRandomDungeonMob(java.util.Random rand)` — Gets a random mob name from the list.
- `static int removeDungeonMob(ResourceLocation name)` — Will completely remove a Mob from the dungeon spawn list.
- `@Deprecated static int removeDungeonMob(java.lang.String name)` — Deprecated. use removeDungeonMob(ResourceLocation)
