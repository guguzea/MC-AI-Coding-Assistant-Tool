# GuiScreenEvent.ActionPerformedEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.GuiScreenEvent → net.minecraftforge.client.event.GuiScreenEvent.ActionPerformedEvent

## Class signature

```java
public static class GuiScreenEvent.ActionPerformedEvent extends GuiScreenEvent
```

## Constructors

- `ActionPerformedEvent(GuiScreen gui, GuiButton button, java.util.List<GuiButton> buttonList)`

## Methods

- `GuiButton getButton()` — The button that was clicked.
- `java.util.List<GuiButton> getButtonList()` — A COPY of the buttonList field from the GuiScreen referenced by GuiScreenEvent.gui .
- `void setButton(GuiButton button)`
- `void setButtonList(java.util.List<GuiButton> buttonList)`