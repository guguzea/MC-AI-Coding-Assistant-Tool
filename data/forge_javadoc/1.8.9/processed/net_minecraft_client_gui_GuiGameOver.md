# GuiGameOver

## Class signature

```java
public class GuiGameOver extends GuiScreen implements GuiYesNoCallback
```

## Constructors

- `public GuiGameOver()`

## Methods

- `public void initGui()`
- `protected void keyTyped(char typedChar, int keyCode) throws java.io.IOException`
- `protected void actionPerformed( GuiButton button) throws java.io.IOException`
- `public void confirmClicked(boolean result, int id)`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `public boolean doesGuiPauseGame()`
- `public void updateScreen()`

## Description

Called by the controls from the buttonList when activated.