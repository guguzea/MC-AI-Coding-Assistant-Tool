---
title: "IEntityAdditionalSpawnData"
description: "public interface IEntityAdditionalSpawnData"
package: "cpw/mods/fml/common/registry"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/registry/IEntityAdditionalSpawnData.html"
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
