# GuiSlider

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiButton → net.minecraft.client.gui.GuiSlider

## Class signature

```java
public class GuiSlider extends GuiButton
```

## Constructors

- `GuiSlider(GuiPageButtonList.GuiResponder guiResponder, int idIn, int x, int y, java.lang.String name, float min, float max, float defaultValue, GuiSlider.FormatHelper formatter)`

## Methods

- `float func_175217_d()`
- `void func_175218_a(float p_175218_1_, boolean p_175218_2_)`
- `void func_175219_a(float p_175219_1_)`
- `float func_175220_c()`
- `protected int getHoverState(boolean mouseOver)` — Returns 0 if the button is disabled, 1 if the mouse is NOT hovering over this button and 2 if it IS hovering over this button.
- `protected void mouseDragged(Minecraft mc, int mouseX, int mouseY)` — Fired when the mouse button is dragged.
- `boolean mousePressed(Minecraft mc, int mouseX, int mouseY)` — Returns true if the mouse has been pressed on this control.
- `void mouseReleased(int mouseX, int mouseY)` — Fired when the mouse button is released.

## Fields

- `boolean isMouseDown`