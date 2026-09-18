# GuiSlider

## Class signature

```java
public class GuiSlider extends GuiButton
```

## Constructors

- `public GuiSlider( GuiPageButtonList.GuiResponder guiResponder, int idIn, int x, int y, java.lang.String nameIn, float minIn, float maxIn, float defaultValue, GuiSlider.FormatHelper formatter)`

## Methods

- `public float getSliderValue()`
- `public void setSliderValue(float value, boolean notifyResponder)`
- `public float getSliderPosition()`
- `protected int getHoverState(boolean mouseOver)`
- `protected void mouseDragged( Minecraft mc, int mouseX, int mouseY)`
- `public void setSliderPosition(float position)`
- `public boolean mousePressed( Minecraft mc, int mouseX, int mouseY)`
- `public void mouseReleased(int mouseX, int mouseY)`