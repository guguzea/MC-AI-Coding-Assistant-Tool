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