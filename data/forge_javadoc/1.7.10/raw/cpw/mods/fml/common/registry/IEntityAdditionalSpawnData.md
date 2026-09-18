---
title: "IEntityAdditionalSpawnData"
description: "A interface for Entities that need extra information to be communicated between the server and client when they are spawned."
package: "cpw/mods/fml/common/registry"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/registry/IEntityAdditionalSpawnData.html"
sourceType: javadoc
---

# IEntityAdditionalSpawnData

## Class signature

```java
public interface IEntityAdditionalSpawnData
```

## Methods

- `void writeSpawnData(ByteBuf buffer)`
- `void readSpawnData(ByteBuf additionalData)`

## Description

A interface for Entities that need extra information to be communicated between the server and client when they are spawned.
