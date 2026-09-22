# GuiSelectStringEntries.ListEntry

**Inheritance:** java.lang.Object → cpw.mods.fml.client.config.GuiSelectStringEntries.ListEntry

## Class signature

```java
public static class GuiSelectStringEntries.ListEntry extends java.lang.Object implements GuiSelectStringEntries.IGuiSelectStringListEntry
```

## Constructors

- `ListEntry(GuiSelectStringEntries owningList, java.util.Map.Entry<java.lang.Object, java.lang.String> value)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, Tessellator tessellator, int mouseX, int mouseY, boolean isSelected)`
- `java.lang.Object getValue()`
- `boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`

## Fields

- `protected GuiSelectStringEntries owningList`
- `protected java.util.Map.Entry<java.lang.Object, java.lang.String> value`