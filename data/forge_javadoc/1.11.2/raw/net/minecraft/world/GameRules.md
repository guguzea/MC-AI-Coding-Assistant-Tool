---
title: "GameRules"
description: "public class GameRules extends java.lang.Object"
package: "net/minecraft/world"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/GameRules.html"
sourceType: javadoc
---

# GameRules

**Inheritance:** java.lang.Object → net.minecraft.world.GameRules

## Class signature

```java
public class GameRules extends java.lang.Object
```

## Constructors

- `GameRules()`

## Methods

- `void addGameRule(java.lang.String key, java.lang.String value, GameRules.ValueType type)`
- `boolean areSameType(java.lang.String key, GameRules.ValueType otherValue)`
- `boolean getBoolean(java.lang.String name)`
- `int getInt(java.lang.String name)`
- `java.lang.String[] getRules()`
- `java.lang.String getString(java.lang.String name)`
- `boolean hasRule(java.lang.String name)`
- `void readFromNBT(NBTTagCompound nbt)`
- `void setOrCreateGameRule(java.lang.String key, java.lang.String ruleValue)`
- `NBTTagCompound writeToNBT()`
