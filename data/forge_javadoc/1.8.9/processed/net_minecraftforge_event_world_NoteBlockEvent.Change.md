# NoteBlockEvent.Change

## Constructors

- `public Change( World world, BlockPos pos, IBlockState state, int oldNote, int newNote)`

## Description

Fired when a Noteblock is changed. You can adjust the note it will change to via NoteBlockEvent.setNote(Note, Octave) . Canceling this event will not change the note and also stop the Noteblock from p