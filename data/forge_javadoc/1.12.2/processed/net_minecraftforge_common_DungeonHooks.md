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