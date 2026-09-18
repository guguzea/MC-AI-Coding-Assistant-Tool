---
title: "NoteBlockEvent.Play"
description: "Fired when a Noteblock plays it's note. You can override the note and instrument Canceling this event will stop the note from playing."
package: "net/minecraftforge/event/world"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/world/NoteBlockEvent.Play.html"
sourceType: javadoc
---

# NoteBlockEvent.Play

## Constructors

- `public Play( World world, BlockPos pos, IBlockState state, int note, int instrument)`

## Methods

- `public NoteBlockEvent.Instrument getInstrument()`
- `public void setInstrument( NoteBlockEvent.Instrument instrument)`

## Description

Fired when a Noteblock plays it's note. You can override the note and instrument Canceling this event will stop the note from playing.
