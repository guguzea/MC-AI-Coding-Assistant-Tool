# GuiScreenEvent.DrawScreenEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.GuiScreenEvent → net.minecraftforge.client.event.GuiScreenEvent.DrawScreenEvent

## Class signature

```java
public static class GuiScreenEvent.DrawScreenEvent extends GuiScreenEvent
```

## Constructors

- `DrawScreenEvent(GuiScreen gui, int mouseX, int mouseY, float renderPartialTicks)`

## Methods

- `int getMouseX()` — The x coordinate of the mouse pointer on the screen.
- `int getMouseY()` — The y coordinate of the mouse pointer on the screen.
- `float getRenderPartialTicks()` — Partial render ticks elapsed.