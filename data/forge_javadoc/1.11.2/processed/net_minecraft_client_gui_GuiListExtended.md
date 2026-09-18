# GuiListExtended

## Class signature

```java
public abstract class GuiListExtended extends GuiSlot
```

## Constructors

- `public GuiListExtended( Minecraft mcIn, int widthIn, int heightIn, int topIn, int bottomIn, int slotHeightIn)`

## Methods

- `protected void elementClicked(int slotIndex, boolean isDoubleClick, int mouseX, int mouseY)`
- `protected boolean isSelected(int slotIndex)`
- `protected void drawBackground()`
- `protected void drawSlot(int entryID, int insideLeft, int yPos, int insideSlotHeight, int mouseXIn, int mouseYIn)`
- `protected void updateItemPos(int entryID, int insideLeft, int yPos)`
- `public boolean mouseClicked(int mouseX, int mouseY, int mouseEvent)`
- `public boolean mouseReleased(int x, int y, int mouseEvent)`
- `public abstract GuiListExtended.IGuiListEntry getListEntry(int index)`