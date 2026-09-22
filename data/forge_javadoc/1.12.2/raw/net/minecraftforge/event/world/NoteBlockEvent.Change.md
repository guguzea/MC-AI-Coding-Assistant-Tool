---
title: "NoteBlockEvent.Change"
description: "public static class NoteBlockEvent.Change extends NoteBlockEvent"
package: "net/minecraftforge/event/world"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/world/NoteBlockEvent.Change.html"
sourceType: javadoc
---

# NoteBlockEvent.Change

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.NoteBlockEvent → net.minecraftforge.event.world.NoteBlockEvent.Change

## Class signature

```java
public static class NoteBlockEvent.Change extends NoteBlockEvent
```

## Constructors

- `Change(World world, BlockPos pos, IBlockState state, int oldNote, int newNote)`

## Methods

- `NoteBlockEvent.Note getOldNote()`
- `NoteBlockEvent.Octave getOldOctave()`
