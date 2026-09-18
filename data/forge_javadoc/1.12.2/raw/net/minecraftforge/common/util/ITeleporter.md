---
title: "ITeleporter"
description: "Interface for handling the placement of entities during dimension change. An implementation of this interface can be used to place the entity in a safe location, or generate a return portal, for insta"
package: "net/minecraftforge/common/util"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/util/ITeleporter.html"
sourceType: javadoc
---

# ITeleporter

## Class signature

```java
public interface ITeleporter
```

## Methods

- `void placeEntity( World world, Entity entity, float yaw)`
- `default boolean isVanilla()`

## Description

Interface for handling the placement of entities during dimension change. An implementation of this interface can be used to place the entity in a safe location, or generate a return portal, for insta
