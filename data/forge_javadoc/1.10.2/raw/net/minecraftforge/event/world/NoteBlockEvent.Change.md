---
title: "NoteBlockEvent.Change"
description: "Fired when a Noteblock is changed. You can adjust the note it will change to via NoteBlockEvent.setNote(Note, Octave) . Canceling this event will not change the note and also stop the Noteblock from p"
package: "net/minecraftforge/event/world"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/world/NoteBlockEvent.Change.html"
sourceType: javadoc
---

# NoteBlockEvent.Change

## Constructors

- `public Change( World world, BlockPos pos, IBlockState state, int oldNote, int newNote)`

## Methods

- `public NoteBlockEvent.Note getOldNote()`
- `public NoteBlockEvent.Octave getOldOctave()`

## Description

Fired when a Noteblock is changed. You can adjust the note it will change to via NoteBlockEvent.setNote(Note, Octave) . Canceling this event will not change the note and also stop the Noteblock from p
