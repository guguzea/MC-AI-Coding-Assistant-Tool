---
title: "IEntityAdditionalSpawnData"
description: "public interface IEntityAdditionalSpawnData"
package: "net/minecraftforge/fml/common/registry"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/registry/IEntityAdditionalSpawnData.html"
sourceType: javadoc
---

# IEntityAdditionalSpawnData

## Class signature

```java
public interface IEntityAdditionalSpawnData
```

## Methods

- `void readSpawnData(ByteBuf additionalData)` — Called by the client when it receives a Entity spawn packet.
- `void writeSpawnData(ByteBuf buffer)` — Called by the server when constructing the spawn packet.
