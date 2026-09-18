---
title: "GameType"
description: "Returns the enum constant of this type with the specified name."
package: "net/minecraft/world"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/GameType.html"
sourceType: javadoc
---

# GameType

## Class signature

```java
public enum GameType extends java.lang.Enum< GameType >
```

## Methods

- `public static GameType [] values()`
- `public static GameType valueOf(java.lang.String name)`
- `public int getID()`
- `public java.lang.String getName()`
- `public void configurePlayerCapabilities( PlayerCapabilities capabilities)`
- `public boolean isAdventure()`
- `public boolean isCreative()`
- `public boolean isSurvivalOrAdventure()`
- `public static GameType getByID(int idIn)`
- `public static GameType parseGameTypeWithDefault(int targetId, GameType fallback)`
- `public static GameType getByName(java.lang.String gamemodeName)`
- `public static GameType parseGameTypeWithDefault(java.lang.String targetName, GameType fallback)`

## Description

Returns the enum constant of this type with the specified name.
