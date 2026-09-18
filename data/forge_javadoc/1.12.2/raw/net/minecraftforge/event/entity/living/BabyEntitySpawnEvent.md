---
title: "BabyEntitySpawnEvent"
description: "BabyEntitySpawnEvent is fired just before a baby entity is about to be spawned. Parents will have disengaged their relationship. @Cancelable It is possible to change the child completely by using setC"
package: "net/minecraftforge/event/entity/living"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/living/BabyEntitySpawnEvent.html"
sourceType: javadoc
---

# BabyEntitySpawnEvent

## Class signature

```java
public class BabyEntitySpawnEvent extends Event
```

## Constructors

- `public BabyEntitySpawnEvent( EntityLiving parentA, EntityLiving parentB, EntityAgeable proposedChild)`

## Methods

- `public EntityLiving getParentA()`
- `public EntityLiving getParentB()`
- `public EntityPlayer getCausedByPlayer()`
- `public EntityAgeable getChild()`
- `public void setChild( EntityAgeable proposedChild)`

## Description

BabyEntitySpawnEvent is fired just before a baby entity is about to be spawned. Parents will have disengaged their relationship. @Cancelable It is possible to change the child completely by using setC
