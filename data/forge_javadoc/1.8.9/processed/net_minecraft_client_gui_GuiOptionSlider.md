# GuiOptionSlider

## Class signature

```java
public class GuiOptionSlider extends GuiButton
```

## Constructors

- `public GuiOptionSlider(int p_i45016_1_, int p_i45016_2_, int p_i45016_3_, GameSettings.Options p_i45016_4_)`
- `public GuiOptionSlider(int p_i45017_1_, int p_i45017_2_, int p_i45017_3_, GameSettings.Options p_i45017_4_, float p_i45017_5_, float p_i45017_6_)`

## Methods

- `protected int getHoverState(boolean mouseOver)`
- `protected void mouseDragged( Minecraft mc, int mouseX, int mouseY)`
- `public boolean mousePressed( Minecraft mc, int mouseX, int mouseY)`
- `public void mouseReleased(int mouseX, int mouseY)`

## Description

Returns 0 if the button is disabled, 1 if the mouse is NOT hovering over this button and 2 if it IS hovering over this button.