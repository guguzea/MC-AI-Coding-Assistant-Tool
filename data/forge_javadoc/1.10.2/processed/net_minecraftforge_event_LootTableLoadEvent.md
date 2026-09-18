# LootTableLoadEvent

## Class signature

```java
public class LootTableLoadEvent extends Event
```

## Constructors

- `public LootTableLoadEvent( ResourceLocation name, LootTable table)`

## Methods

- `public ResourceLocation getName()`
- `public LootTable getTable()`
- `public void setTable( LootTable table)`

## Description

Event fired when a LootTable json is loaded from json. This event is fired whenever resources are loaded, or when the server starts. This event will NOT be fired for LootTables loaded from the world f