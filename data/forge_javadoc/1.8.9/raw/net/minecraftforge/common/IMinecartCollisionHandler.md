---
title: "IMinecartCollisionHandler"
description: "This class defines a replacement for the default minecart collision code. Only one handler can be registered at a time. It it registered with EntityMinecart.registerCollisionHandler(). If you use this"
package: "net/minecraftforge/common"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/IMinecartCollisionHandler.html"
sourceType: javadoc
---

# IMinecartCollisionHandler

## Class signature

```java
public interface IMinecartCollisionHandler
```

## Methods

- `void onEntityCollision( EntityMinecart cart, Entity other)`
- `AxisAlignedBB getCollisionBox( EntityMinecart cart, Entity other)`
- `AxisAlignedBB getMinecartCollisionBox( EntityMinecart cart)`
- `AxisAlignedBB getBoundingBox( EntityMinecart cart)`

## Description

This class defines a replacement for the default minecart collision code. Only one handler can be registered at a time. It it registered with EntityMinecart.registerCollisionHandler(). If you use this
