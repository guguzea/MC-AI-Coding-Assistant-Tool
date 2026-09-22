---
title: "WorldSettings.GameType"
description: "public static enum WorldSettings.GameType extends java.lang.Enum<WorldSettings.GameType>"
package: "net/minecraft/world"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/WorldSettings.GameType.html"
sourceType: javadoc
---

# WorldSettings.GameType

**Inheritance:** java.lang.Object → java.lang.Enum<WorldSettings.GameType> → net.minecraft.world.WorldSettings.GameType

## Class signature

```java
public static enum WorldSettings.GameType extends java.lang.Enum<WorldSettings.GameType>
```

## Methods

- `void configurePlayerCapabilities(PlayerCapabilities capabilities)` — Configures the player capabilities based on the game type
- `static WorldSettings.GameType getByID(int idIn)` — Returns the game type with the specified ID, or SURVIVAL if none found.
- `static WorldSettings.GameType getByName(java.lang.String p_77142_0_)` — Returns the game type with the specified name, or SURVIVAL if none found.
- `int getID()` — Returns the ID of this game type
- `java.lang.String getName()` — Returns the name of this game type
- `boolean isAdventure()` — Returns true if this is the ADVENTURE game type
- `boolean isCreative()` — Returns true if this is the CREATIVE game type
- `boolean isSurvivalOrAdventure()` — Returns true if this is the SURVIVAL or ADVENTURE game type
- `static WorldSettings.GameType valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static WorldSettings.GameType [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.
