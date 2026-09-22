# GuiSelectStringEntries.ListEntry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.config.GuiSelectStringEntries.ListEntry

## Class signature

```java
public static class GuiSelectStringEntries.ListEntry extends java.lang.Object implements GuiSelectStringEntries.IGuiSelectStringListEntry
```

## Constructors

- `ListEntry(GuiSelectStringEntries owningList, java.util.Map.Entry<java.lang.Object, java.lang.String> value)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected, float partial)`
- `java.lang.Object getValue()`
- `boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void updatePosition(int slotIndex, int x, int y, float partialTicks)`

## Fields

- `protected GuiSelectStringEntries owningList`
- `protected java.util.Map.Entry<java.lang.Object, java.lang.String> value`