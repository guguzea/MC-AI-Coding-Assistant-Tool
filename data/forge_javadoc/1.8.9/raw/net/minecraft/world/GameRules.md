---
title: "GameRules"
description: "public class GameRules extends java.lang.Object"
package: "net/minecraft/world"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/GameRules.html"
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
- `boolean getBoolean(java.lang.String name)` — Gets the boolean Game Rule value.
- `int getInt(java.lang.String name)`
- `java.lang.String[] getRules()` — Return the defined game rules.
- `java.lang.String getString(java.lang.String name)` — Gets the string Game Rule value.
- `boolean hasRule(java.lang.String name)` — Return whether the specified game rule is defined.
- `void readFromNBT(NBTTagCompound nbt)` — Set defined game rules from NBT.
- `void setOrCreateGameRule(java.lang.String key, java.lang.String ruleValue)`
- `NBTTagCompound writeToNBT()` — Return the defined game rules as NBT.
