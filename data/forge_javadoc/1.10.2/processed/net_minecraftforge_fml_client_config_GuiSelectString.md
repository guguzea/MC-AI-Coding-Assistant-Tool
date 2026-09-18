# GuiSelectString

## Class signature

```java
public class GuiSelectString extends GuiScreen
```

## Constructors

- `public GuiSelectString( GuiScreen parentScreen, IConfigElement configElement, int slotIndex, java.util.Map<java.lang.Object,java.lang.String> selectableValues, java.lang.Object currentValue, boolean enabled)`

## Methods

- `public void initGui()`
- `protected void actionPerformed( GuiButton button)`
- `public void handleMouseInput() throws java.io.IOException`
- `protected void mouseReleased(int x, int y, int mouseEvent)`
- `public void drawScreen(int par1, int par2, float par3)`
- `public void drawToolTip(java.util.List<java.lang.String> stringList, int x, int y)`

## Description

This class provides a screen that allows the user to select a value from a list.