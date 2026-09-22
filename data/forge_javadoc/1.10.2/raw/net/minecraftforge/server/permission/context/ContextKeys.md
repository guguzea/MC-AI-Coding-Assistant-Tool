---
title: "ContextKeys"
description: "public class ContextKeys extends java.lang.Object"
package: "net/minecraftforge/server/permission/context"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/server/permission/context/ContextKeys.html"
sourceType: javadoc
---

# ContextKeys

**Inheritance:** java.lang.Object → net.minecraftforge.server.permission.context.ContextKeys

## Class signature

```java
public class ContextKeys extends java.lang.Object
```

## Constructors

- `ContextKeys()`

## Fields

- `static ContextKey<AxisAlignedBB> AREA`
- `static ContextKey<IBlockState> BLOCK_STATE`
- `static ContextKey<EnumFacing> FACING`
- `static ContextKey<BlockPos> POS` — BlockPos for interacting, breaking and other permissions
- `static ContextKey<Entity> TARGET` — The entity can be anything that gets interacted with - a sheep when you try to dye it, skeleton that you attack, etc.
