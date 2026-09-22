---
title: "WorldSettings.GameType"
description: "public static enum WorldSettings.GameType extends java.lang.Enum<WorldSettings.GameType>"
package: "net/minecraft/world"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/WorldSettings.GameType.html"
sourceType: javadoc
---

# WorldSettings.GameType

**Inheritance:** java.lang.Object → java.lang.Enum<WorldSettings.GameType> → net.minecraft.world.WorldSettings.GameType

## Class signature

```java
public static enum WorldSettings.GameType extends java.lang.Enum<WorldSettings.GameType>
```

## Methods

- `void configurePlayerCapabilities(PlayerCapabilities capabilities)`
- `static WorldSettings.GameType getByID(int idIn)`
- `static WorldSettings.GameType getByName(java.lang.String gamemodeName)`
- `int getID()`
- `java.lang.String getName()`
- `boolean isAdventure()`
- `boolean isCreative()`
- `boolean isSurvivalOrAdventure()`
- `static WorldSettings.GameType parseGameTypeWithDefault(int targetId, WorldSettings.GameType fallback)`
- `static WorldSettings.GameType parseGameTypeWithDefault(java.lang.String targetName, WorldSettings.GameType fallback)`
- `static WorldSettings.GameType valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static WorldSettings.GameType [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.
