---
title: "FMLMissingMappingsEvent.MissingMapping"
description: "Prevent the world from loading due to the missing item."
package: "cpw/mods/fml/common/event"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/event/FMLMissingMappingsEvent.MissingMapping.html"
sourceType: javadoc
---

# FMLMissingMappingsEvent.MissingMapping

## Constructors

- `public MissingMapping(java.lang.String name, int id)`

## Methods

- `@Deprecated public void setAction( FMLMissingMappingsEvent.Action target)`
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
