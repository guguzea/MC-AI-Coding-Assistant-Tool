---
title: "IEntityAdditionalSpawnData"
description: "public interface IEntityAdditionalSpawnData"
package: "net/minecraftforge/fml/common/registry"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/registry/IEntityAdditionalSpawnData.html"
sourceType: javadoc
---

# IEntityAdditionalSpawnData

## Class signature

```java
public interface IEntityAdditionalSpawnData
```

## Methods

- `void readSpawnData(io.netty.buffer.ByteBuf additionalData)` — Called by the client when it receives a Entity spawn packet.
- `void writeSpawnData(io.netty.buffer.ByteBuf buffer)` — Called by the server when constructing the spawn packet.
