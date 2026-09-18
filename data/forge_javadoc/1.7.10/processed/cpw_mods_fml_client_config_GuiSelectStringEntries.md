# GuiSelectStringEntries

## Class signature

```java
public class GuiSelectStringEntries extends GuiListExtended
```

## Constructors

- `public GuiSelectStringEntries( GuiSelectString owningScreen, Minecraft mc, IConfigElement configElement, java.util.Map<java.lang.Object,java.lang.String> selectableValues)`

## Methods

- `protected void elementClicked(int index, boolean doubleClick, int mouseX, int mouseY)`
- `protected boolean isSelected(int index)`
- `protected int getScrollBarX()`
- `public int getListWidth()`
- `public GuiSelectStringEntries.IGuiSelectStringListEntry getListEntry(int index)`
- `protected int getSize()`
- `public boolean isChanged()`
- `public boolean isDefault()`
- `public void saveChanges()`

## Description

This class implements the scrolling list functionality of the GuiSelectString screen.