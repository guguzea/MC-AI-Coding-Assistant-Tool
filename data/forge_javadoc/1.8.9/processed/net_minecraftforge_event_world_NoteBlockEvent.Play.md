# NoteBlockEvent.Play

## Constructors

- `public Play( World world, BlockPos pos, IBlockState state, int note, int instrument)`

## Description

Fired when a Noteblock plays it's note. You can override the note and instrument Canceling this event will stop the note from playing.