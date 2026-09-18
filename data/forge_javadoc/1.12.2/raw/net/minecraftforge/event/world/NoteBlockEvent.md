---
title: "NoteBlockEvent"
description: "Base class for Noteblock Events"
package: "net/minecraftforge/event/world"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/world/NoteBlockEvent.html"
sourceType: javadoc
---

# NoteBlockEvent

## Class signature

```java
public class NoteBlockEvent extends BlockEvent
```

## Constructors

- `protected NoteBlockEvent( World world, BlockPos pos, IBlockState state, int note)`

## Methods

- `public NoteBlockEvent.Note getNote()`
- `public NoteBlockEvent.Octave getOctave()`
- `public int getVanillaNoteId()`
- `public void setNote( NoteBlockEvent.Note note, NoteBlockEvent.Octave octave)`

## Description

Base class for Noteblock Events
