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