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