---
title: "RegistryEvent.MissingMappings.Mapping"
description: "Prevent the world from loading due to the missing item."
package: "net/minecraftforge/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/RegistryEvent.MissingMappings.Mapping.html"
sourceType: javadoc
---

# RegistryEvent.MissingMappings.Mapping

## Constructors

- `public Mapping( IForgeRegistry < T > registry, IForgeRegistry < T > pool, ResourceLocation key, int id)`

## Methods

- `public void ignore()`
- `public void warn()`
- `public void fail()`
- `public void remap( T target)`
- `public RegistryEvent.MissingMappings.Action getAction()`
- `public T getTarget()`

## Description

Prevent the world from loading due to the missing item.
