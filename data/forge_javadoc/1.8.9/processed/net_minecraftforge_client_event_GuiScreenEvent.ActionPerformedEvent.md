# GuiScreenEvent.ActionPerformedEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.GuiScreenEvent → net.minecraftforge.client.event.GuiScreenEvent.ActionPerformedEvent

## Class signature

```java
public static class GuiScreenEvent.ActionPerformedEvent extends GuiScreenEvent
```

## Constructors

- `ActionPerformedEvent(GuiScreen gui, GuiButton button, java.util.List<GuiButton> buttonList)`

## Fields

- `GuiButton button` — The button that was clicked.
- `java.util.List<GuiButton> buttonList` — A COPY of the buttonList field from the GuiScreen referenced by gui .