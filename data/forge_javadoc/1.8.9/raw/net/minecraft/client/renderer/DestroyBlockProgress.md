---
title: "DestroyBlockProgress"
description: "public class DestroyBlockProgress extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/DestroyBlockProgress.html"
sourceType: javadoc
---

# DestroyBlockProgress

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.DestroyBlockProgress

## Class signature

```java
public class DestroyBlockProgress extends java.lang.Object
```

## Constructors

- `DestroyBlockProgress(int miningPlayerEntIdIn, BlockPos positionIn)`

## Methods

- `int getCreationCloudUpdateTick()` — retrieves the 'date' at which the PartiallyDestroyedBlock was created
- `int getPartialBlockDamage()`
- `BlockPos getPosition()`
- `void setCloudUpdateTick(int createdAtCloudUpdateTickIn)` — saves the current Cloud update tick into the PartiallyDestroyedBlock
- `void setPartialBlockDamage(int damage)` — inserts damage value into this partially destroyed Block. -1 causes client renderer to delete it, otherwise ranges from 1 to 10
