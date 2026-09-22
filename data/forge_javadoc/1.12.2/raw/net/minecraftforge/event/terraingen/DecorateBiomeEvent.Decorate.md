---
title: "DecorateBiomeEvent.Decorate"
description: "public static class DecorateBiomeEvent.Decorate extends DecorateBiomeEvent"
package: "net/minecraftforge/event/terraingen"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/terraingen/DecorateBiomeEvent.Decorate.html"
sourceType: javadoc
---

# DecorateBiomeEvent.Decorate

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.terraingen.DecorateBiomeEvent → net.minecraftforge.event.terraingen.DecorateBiomeEvent.Decorate

## Class signature

```java
public static class DecorateBiomeEvent.Decorate extends DecorateBiomeEvent
```

## Constructors

- `@Deprecated Decorate(World world, java.util.Random rand, BlockPos pos, DecorateBiomeEvent.Decorate.EventType type)`
- `Decorate(World world, java.util.Random rand, ChunkPos chunkPos, BlockPos placementPos, DecorateBiomeEvent.Decorate.EventType type)`

## Methods

- `BlockPos getPlacementPos()` — This may be anywhere inside the 2x2 chunk area for generation.
- `DecorateBiomeEvent.Decorate.EventType getType()`
