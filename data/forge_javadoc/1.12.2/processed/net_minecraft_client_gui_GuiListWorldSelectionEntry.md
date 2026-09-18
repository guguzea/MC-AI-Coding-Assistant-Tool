# GuiListWorldSelectionEntry

## Class signature

```java
public class GuiListWorldSelectionEntry extends java.lang.Object implements GuiListExtended.IGuiListEntry
```

## Constructors

- `public GuiListWorldSelectionEntry( GuiListWorldSelection listWorldSelIn, WorldSummary worldSummaryIn, ISaveFormat saveFormat)`

## Methods

- `public void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected, float partialTicks)`
- `public boolean mousePressed(int slotIndex, int mouseX, int mouseY, int mouseEvent, int relativeX, int relativeY)`
- `public void joinWorld()`
- `public void deleteWorld()`
- `public void editWorld()`
- `public void recreateWorld()`
- `public void mouseReleased(int slotIndex, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `public void updatePosition(int slotIndex, int x, int y, float partialTicks)`