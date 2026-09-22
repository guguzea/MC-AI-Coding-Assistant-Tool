---
title: "RandomPositionGenerator"
description: "public class RandomPositionGenerator extends java.lang.Object"
package: "net/minecraft/entity/ai"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/RandomPositionGenerator.html"
sourceType: javadoc
---

# RandomPositionGenerator

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.RandomPositionGenerator

## Class signature

```java
public class RandomPositionGenerator extends java.lang.Object
```

## Constructors

- `RandomPositionGenerator()`

## Methods

- `static Vec3 findRandomTarget(EntityCreature entitycreatureIn, int xz, int y)` — finds a random target within par1(x,z) and par2 (y) blocks
- `static Vec3 findRandomTargetBlockAwayFrom(EntityCreature entitycreatureIn, int xz, int y, Vec3 targetVec3)` — finds a random target within par1(x,z) and par2 (y) blocks in the reverse direction of the point par3
- `static Vec3 findRandomTargetBlockTowards(EntityCreature entitycreatureIn, int xz, int y, Vec3 targetVec3)` — finds a random target within par1(x,z) and par2 (y) blocks in the direction of the point par3
