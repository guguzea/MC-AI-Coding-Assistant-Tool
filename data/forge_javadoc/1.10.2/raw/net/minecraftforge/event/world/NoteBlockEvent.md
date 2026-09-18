---
title: "NoteBlockEvent"
description: "Base class for Noteblock Events"
package: "net/minecraftforge/event/world"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/world/NoteBlockEvent.html"
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
