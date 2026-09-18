---
title: "FMLMissingMappingsEvent.MissingMapping"
description: "Prevent the world from loading due to the missing item."
package: "net/minecraftforge/fml/common/event"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/event/FMLMissingMappingsEvent.MissingMapping.html"
sourceType: javadoc
---

# FMLMissingMappingsEvent.MissingMapping

## Constructors

- `public MissingMapping( GameRegistry.Type type, ResourceLocation name, int id)`

## Methods

- `public void ignore()`
- `public void warn()`
- `public void fail()`
- `public void remap( Block target)`
- `public void remap( Item target)`
- `public void skipItemBlock()`
- `public FMLMissingMappingsEvent.Action getAction()`
- `public java.lang.Object getTarget()`

## Description

Prevent the world from loading due to the missing item.
