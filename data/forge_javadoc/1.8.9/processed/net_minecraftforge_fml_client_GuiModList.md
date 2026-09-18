# GuiModList

## Class signature

```java
public class GuiModList extends GuiScreen
```

## Constructors

- `public GuiModList( GuiScreen mainMenu)`

## Methods

- `public void initGui()`
- `protected void mouseClicked(int x, int y, int button) throws java.io.IOException`
- `protected void keyTyped(char c, int keyCode) throws java.io.IOException`
- `public void updateScreen()`
- `protected void actionPerformed( GuiButton button) throws java.io.IOException`
- `public int drawLine(java.lang.String line, int offset, int shifty)`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `public void selectModIndex(int index)`
- `public boolean modIndexSelected(int index)`

## Description

Called by the controls from the buttonList when activated.