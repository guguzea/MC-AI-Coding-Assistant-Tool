---
title: "LootTableLoadEvent"
description: "Event fired when a LootTable json is loaded from json. This event is fired whenever resources are loaded, or when the server starts. This event will NOT be fired for LootTables loaded from the world f"
package: "net/minecraftforge/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/LootTableLoadEvent.html"
sourceType: javadoc
---

# LootTableLoadEvent

## Class signature

```java
public class LootTableLoadEvent extends Event
```

## Constructors

- `public LootTableLoadEvent( ResourceLocation name, LootTable table, LootTableManager lootTableManager)`

## Methods

- `public ResourceLocation getName()`
- `public LootTable getTable()`
- `public LootTableManager getLootTableManager()`
- `public void setTable( LootTable table)`

## Description

Event fired when a LootTable json is loaded from json. This event is fired whenever resources are loaded, or when the server starts. This event will NOT be fired for LootTables loaded from the world f
