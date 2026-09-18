---
title: "EntitySelectorEvent"
description: "EntitySelectorEvent is fired whenever Minecraft collects entity selectors. This happens (one or multiple times) when you use something like @a[gamemode=1] in a command. This event is fired via ForgeEv"
package: "net/minecraftforge/event"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/EntitySelectorEvent.html"
sourceType: javadoc
---

# EntitySelectorEvent

## Class signature

```java
public class EntitySelectorEvent extends Event
```

## Constructors

- `public EntitySelectorEvent(java.util.Map<java.lang.String,java.lang.String> map, java.lang.String mainSelector, ICommandSender sender, Vec3d position)`

## Methods

- `public void addPredicate(com.google.common.base.Predicate< Entity > selector)`
- `public java.lang.String getMainSelector()`
- `public java.util.Map<java.lang.String,java.lang.String> getArgumentMap()`
- `public Vec3d getPosition()`
- `public ICommandSender getSender()`

## Description

EntitySelectorEvent is fired whenever Minecraft collects entity selectors. This happens (one or multiple times) when you use something like @a[gamemode=1] in a command. This event is fired via ForgeEv
