---
title: "Teleporter"
description: "called periodically to remove out-of-date portal locations from the cache list."
package: "net/minecraft/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/Teleporter.html"
sourceType: javadoc
---

# Teleporter

## Class signature

```java
public class Teleporter extends java.lang.Object
```

## Constructors

- `public Teleporter( WorldServer worldIn)`

## Methods

- `public void placeInPortal( Entity entityIn, float rotationYaw)`
- `public boolean placeInExistingPortal( Entity entityIn, float rotationYaw)`
- `public boolean makePortal( Entity p_85188_1_)`
- `public void removeStalePortalLocations(long worldTime)`

## Description

called periodically to remove out-of-date portal locations from the cache list.
