# GuiScreenEvent.InitGuiEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.GuiScreenEvent → net.minecraftforge.client.event.GuiScreenEvent.InitGuiEvent

## Class signature

```java
public static class GuiScreenEvent.InitGuiEvent extends GuiScreenEvent
```

## Constructors

- `InitGuiEvent(GuiScreen gui, java.util.List<GuiButton> buttonList)`

## Methods

- `java.util.List<GuiButton> getButtonList()` — The buttonList field from the GuiScreen object referenced by gui .
- `void setButtonList(java.util.List<GuiButton> buttonList)`