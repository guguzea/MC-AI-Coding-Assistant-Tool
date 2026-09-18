---
title: "FakePlayerFactory"
description: "Get a fake player with a given username, Mods should either hold weak references to the return value, or listen for a WorldEvent.Unload and kill all references to prevent worlds staying in memory."
package: "net/minecraftforge/common/util"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/util/FakePlayerFactory.html"
sourceType: javadoc
---

# FakePlayerFactory

## Class signature

```java
public class FakePlayerFactory extends java.lang.Object
```

## Constructors

- `public FakePlayerFactory()`

## Methods

- `public static FakePlayer getMinecraft( WorldServer world)`
- `public static FakePlayer get( WorldServer world, GameProfile username)`
- `public static void unloadWorld( WorldServer world)`

## Description

Get a fake player with a given username, Mods should either hold weak references to the return value, or listen for a WorldEvent.Unload and kill all references to prevent worlds staying in memory.
