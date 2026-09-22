# NoteBlockEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.NoteBlockEvent

## Class signature

```java
public class NoteBlockEvent extends BlockEvent
```

## Fields

- `NoteBlockEvent.Note getNote` — Get the Note the Noteblock is tuned to
- `NoteBlockEvent.Octave getOctave` — Get the Octave of the note this Noteblock is tuned to
- `int getVanillaNoteId` — get the vanilla note-id, which contains information about both Note and Octave.
- `void setNote` — Set Note and Octave for this event.