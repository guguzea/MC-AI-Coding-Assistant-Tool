# GuiSlider

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiButton → net.minecraft.client.gui.GuiSlider

## Class signature

```java
public class GuiSlider extends GuiButton
```

## Constructors

- `GuiSlider(GuiPageButtonList.GuiResponder guiResponder, int idIn, int x, int y, java.lang.String nameIn, float minIn, float maxIn, float defaultValue, GuiSlider.FormatHelper formatter)`

## Methods

- `protected int getHoverState(boolean mouseOver)`
- `float getSliderPosition()`
- `float getSliderValue()`
- `protected void mouseDragged(Minecraft mc, int mouseX, int mouseY)`
- `boolean mousePressed(Minecraft mc, int mouseX, int mouseY)`
- `void mouseReleased(int mouseX, int mouseY)`
- `void setSliderPosition(float position)`
- `void setSliderValue(float value, boolean notifyResponder)`

## Fields

- `boolean isMouseDown`