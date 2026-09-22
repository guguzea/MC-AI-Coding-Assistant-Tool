---
title: "NextTickListEntry"
description: "public class NextTickListEntry extends java.lang.Object implements java.lang.Comparable<NextTickListEntry>"
package: "net/minecraft/world"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/NextTickListEntry.html"
sourceType: javadoc
---

# NextTickListEntry

**Inheritance:** java.lang.Object → net.minecraft.world.NextTickListEntry

## Class signature

```java
public class NextTickListEntry extends java.lang.Object implements java.lang.Comparable<NextTickListEntry>
```

## Constructors

- `NextTickListEntry(BlockPos p_i45745_1_, Block p_i45745_2_)`

## Methods

- `int compareTo(NextTickListEntry p_compareTo_1_)`
- `boolean equals(java.lang.Object p_equals_1_)`
- `Block getBlock()`
- `int hashCode()`
- `void setPriority(int p_82753_1_)`
- `NextTickListEntry setScheduledTime(long p_77176_1_)` — Sets the scheduled time for this tick entry
- `java.lang.String toString()`

## Fields

- `BlockPos position`
- `int priority`
- `long scheduledTime` — Time this tick is scheduled to occur at
