# GuiCommandBlock

## Class signature

```java
public class GuiCommandBlock extends GuiScreen implements ITabCompleter
```

## Constructors

- `public GuiCommandBlock( TileEntityCommandBlock commandBlockIn)`

## Methods

- `public void updateScreen()`
- `public void initGui()`
- `public void updateGui()`
- `public void onGuiClosed()`
- `protected void actionPerformed( GuiButton button) throws java.io.IOException`
- `protected void keyTyped(char typedChar, int keyCode) throws java.io.IOException`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `public void setCompletions(java.lang.String... newCompletions)`