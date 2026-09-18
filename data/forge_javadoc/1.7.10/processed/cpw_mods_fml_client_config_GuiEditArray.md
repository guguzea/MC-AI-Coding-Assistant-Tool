# GuiEditArray

## Class signature

```java
public class GuiEditArray extends GuiScreen
```

## Constructors

- `public GuiEditArray( GuiScreen parentScreen, IConfigElement configElement, int slotIndex, java.lang.Object[] currentValues, boolean enabled)`

## Methods

- `public void initGui()`
- `protected void actionPerformed( GuiButton button)`
- `protected void mouseClicked(int x, int y, int mouseEvent)`
- `protected void mouseMovedOrUp(int x, int y, int mouseEvent)`
- `protected void keyTyped(char eventChar, int eventKey)`
- `public void updateScreen()`
- `public void drawScreen(int par1, int par2, float par3)`
- `public void drawToolTip(java.util.List stringList, int x, int y)`

## Description

This class is the base screen used for editing an array-type property. It provides a list of array entries for the user to edit. This screen is invoked from a GuiConfig screen by controls that use the