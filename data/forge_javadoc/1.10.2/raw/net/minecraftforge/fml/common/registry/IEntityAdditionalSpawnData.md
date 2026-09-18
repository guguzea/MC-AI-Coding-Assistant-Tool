---
title: "IEntityAdditionalSpawnData"
description: "A interface for Entities that need extra information to be communicated between the server and client when they are spawned."
package: "net/minecraftforge/fml/common/registry"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/registry/IEntityAdditionalSpawnData.html"
sourceType: javadoc
---

# IEntityAdditionalSpawnData

## Class signature

```java
public interface IEntityAdditionalSpawnData
```

## Methods

- `void writeSpawnData(io.netty.buffer.ByteBuf buffer)`
- `void readSpawnData(io.netty.buffer.ByteBuf additionalData)`

## Description

A interface for Entities that need extra information to be communicated between the server and client when they are spawned.
