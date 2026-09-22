---
title: "NextTickListEntry"
description: "public class NextTickListEntry extends java.lang.Object implements java.lang.Comparable<NextTickListEntry>"
package: "net/minecraft/world"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/NextTickListEntry.html"
sourceType: javadoc
---

# NextTickListEntry

**Inheritance:** java.lang.Object → net.minecraft.world.NextTickListEntry

## Class signature

```java
public class NextTickListEntry extends java.lang.Object implements java.lang.Comparable<NextTickListEntry>
```

## Constructors

- `NextTickListEntry(BlockPos positionIn, Block blockIn)`

## Methods

- `int compareTo(NextTickListEntry p_compareTo_1_)`
- `boolean equals(java.lang.Object p_equals_1_)`
- `Block getBlock()`
- `int hashCode()`
- `void setPriority(int priorityIn)`
- `NextTickListEntry setScheduledTime(long scheduledTimeIn)`
- `java.lang.String toString()`

## Fields

- `BlockPos position`
- `int priority`
- `long scheduledTime`
