---
title: "IMinecartCollisionHandler"
description: "public interface IMinecartCollisionHandler"
package: "net/minecraftforge/common"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/IMinecartCollisionHandler.html"
sourceType: javadoc
---

# IMinecartCollisionHandler

## Class signature

```java
public interface IMinecartCollisionHandler
```

## Methods

- `AxisAlignedBB getBoundingBox(EntityMinecart cart)` — This function replaces the function of the same name in EntityMinecart.
- `AxisAlignedBB getCollisionBox(EntityMinecart cart, Entity other)` — This function replaced the function of the same name in EntityMinecart.
- `AxisAlignedBB getMinecartCollisionBox(EntityMinecart cart)` — This function is used to define the box used for detecting minecart collisions.
- `void onEntityCollision(EntityMinecart cart, Entity other)` — This basically replaces the function of the same name in EnityMinecart.
