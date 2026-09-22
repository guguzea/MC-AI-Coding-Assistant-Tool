# GuiButton

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiButton

## Class signature

```java
public class GuiButton extends Gui
```

## Constructors

- `GuiButton(int buttonId, int x, int y, int widthIn, int heightIn, java.lang.String buttonText)`
- `GuiButton(int buttonId, int x, int y, java.lang.String buttonText)`

## Methods

- `void drawButton(Minecraft mc, int mouseX, int mouseY)` — Draws this button to the screen.
- `void drawButtonForegroundLayer(int mouseX, int mouseY)`
- `int getButtonWidth()`
- `protected int getHoverState(boolean mouseOver)` — Returns 0 if the button is disabled, 1 if the mouse is NOT hovering over this button and 2 if it IS hovering over this button.
- `boolean isMouseOver()` — Whether the mouse cursor is currently over the button.
- `protected void mouseDragged(Minecraft mc, int mouseX, int mouseY)` — Fired when the mouse button is dragged.
- `boolean mousePressed(Minecraft mc, int mouseX, int mouseY)` — Returns true if the mouse has been pressed on this control.
- `void mouseReleased(int mouseX, int mouseY)` — Fired when the mouse button is released.
- `void playPressSound(SoundHandler soundHandlerIn)`
- `void setWidth(int width)`

## Fields

- `protected static ResourceLocation buttonTextures`
- `java.lang.String displayString` — The string displayed on this control.
- `boolean enabled` — True if this control is enabled, false to disable.
- `int height` — Button height in pixels
- `protected boolean hovered`
- `int id`
- `int packedFGColour`
- `boolean visible` — Hides the button completely if false.
- `int width` — Button width in pixels
- `int xPosition` — The x position of this control.
- `int yPosition` — The y position of this control.