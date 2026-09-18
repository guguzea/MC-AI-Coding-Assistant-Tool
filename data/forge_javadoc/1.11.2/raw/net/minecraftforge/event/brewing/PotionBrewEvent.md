---
title: "PotionBrewEvent"
description: "PotionBrewEvent.Post is fired when a potion is brewed in the brewing stand."
package: "net/minecraftforge/event/brewing"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/brewing/PotionBrewEvent.html"
sourceType: javadoc
---

# PotionBrewEvent

## Class signature

```java
public class PotionBrewEvent extends Event
```

## Constructors

- `protected PotionBrewEvent( NonNullList < ItemStack > stacks)`

## Methods

- `@Nonnull public ItemStack getItem(int index)`
- `public void setItem(int index, @Nonnull ItemStack stack)`
- `public int getLength()`

## Description

PotionBrewEvent.Post is fired when a potion is brewed in the brewing stand.
