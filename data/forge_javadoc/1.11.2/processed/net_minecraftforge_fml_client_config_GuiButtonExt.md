# GuiButtonExt

## Class signature

```java
public class GuiButtonExt extends GuiButton
```

## Constructors

- `public GuiButtonExt(int id, int xPos, int yPos, java.lang.String displayString)`
- `public GuiButtonExt(int id, int xPos, int yPos, int width, int height, java.lang.String displayString)`

## Methods

- `public void drawButton( Minecraft mc, int mouseX, int mouseY)`

## Description

This class provides a button that fixes several bugs present in the vanilla GuiButton drawing code. The gist of it is that it allows buttons of any size without gaps in the graphics and with the borde