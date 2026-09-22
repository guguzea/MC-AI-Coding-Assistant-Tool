---
title: "NoteBlockEvent"
description: "public class NoteBlockEvent extends BlockEvent"
package: "net/minecraftforge/event/world"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/world/NoteBlockEvent.html"
sourceType: javadoc
---

# NoteBlockEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.NoteBlockEvent

## Class signature

```java
public class NoteBlockEvent extends BlockEvent
```

## Constructors

- `NoteBlockEvent(World world, BlockPos pos, IBlockState state, int note)`

## Methods

- `NoteBlockEvent.Note getNote()` — Get the Note the Noteblock is tuned to
- `NoteBlockEvent.Octave getOctave()` — Get the Octave of the note this Noteblock is tuned to
- `int getVanillaNoteId()` — get the vanilla note-id, which contains information about both Note and Octave.
- `void setNote(NoteBlockEvent.Note note, NoteBlockEvent.Octave octave)` — Set Note and Octave for this event.
