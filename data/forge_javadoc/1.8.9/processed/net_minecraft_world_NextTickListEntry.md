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