---
title: "AnvilUpdateEvent"
description: "AnvilUpdateEvent is fired when a player places items in both the left and right slots of a anvil. If the event is canceled, vanilla behavior will not run, and the output will be set to null. If the ev"
package: "net/minecraftforge/event"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/AnvilUpdateEvent.html"
sourceType: javadoc
---

# AnvilUpdateEvent

## Class signature

```java
public class AnvilUpdateEvent extends Event
```

## Constructors

- `public AnvilUpdateEvent( ItemStack left, ItemStack right, java.lang.String name, int cost)`

## Methods

- `public ItemStack getLeft()`
- `public ItemStack getRight()`
- `public java.lang.String getName()`
- `public ItemStack getOutput()`
- `public void setOutput( ItemStack output)`
- `public int getCost()`
- `public void setCost(int cost)`
- `public int getMaterialCost()`
- `public void setMaterialCost(int materialCost)`

## Description

AnvilUpdateEvent is fired when a player places items in both the left and right slots of a anvil. If the event is canceled, vanilla behavior will not run, and the output will be set to null. If the ev
