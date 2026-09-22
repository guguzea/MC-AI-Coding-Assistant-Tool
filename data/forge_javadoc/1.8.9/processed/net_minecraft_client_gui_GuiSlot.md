# GuiSlot

**Inheritance:** java.lang.Object → net.minecraft.client.gui.GuiSlot

## Class signature

```java
public abstract class GuiSlot extends java.lang.Object
```

## Constructors

- `GuiSlot(Minecraft mcIn, int width, int height, int topIn, int bottomIn, int slotHeightIn)`

## Methods

- `void actionPerformed(GuiButton button)`
- `protected void bindAmountScrolled()` — Stop the thing from scrolling out of bounds
- `protected abstract void drawBackground()`
- `protected void drawContainerBackground(Tessellator tessellator)`
- `protected void drawListHeader(int p_148129_1_, int p_148129_2_, Tessellator p_148129_3_)` — Handles drawing a list's header row.
- `void drawScreen(int mouseXIn, int mouseYIn, float p_148128_3_)`
- `protected void drawSelectionBox(int p_148120_1_, int p_148120_2_, int mouseXIn, int mouseYIn)` — Draws the selection box around the selected slot element.
- `protected abstract void drawSlot(int entryID, int p_180791_2_, int p_180791_3_, int p_180791_4_, int mouseXIn, int mouseYIn)`
- `protected abstract void elementClicked(int slotIndex, boolean isDoubleClick, int mouseX, int mouseY)` — The element in the slot that was clicked, boolean for whether it was double clicked or not
- `protected void func_148132_a(int p_148132_1_, int p_148132_2_)`
- `int func_148135_f()`
- `protected void func_148142_b(int p_148142_1_, int p_148142_2_)`
- `protected void func_178040_a(int p_178040_1_, int p_178040_2_, int p_178040_3_)`
- `int getAmountScrolled()` — Returns the amountScrolled field as an integer.
- `protected int getContentHeight()` — Return the height of the content being scrolled
- `boolean getEnabled()`
- `int getListWidth()` — Gets the width of the list
- `protected int getScrollBarX()`
- `protected abstract int getSize()`
- `int getSlotHeight()`
- `int getSlotIndexFromScreenCoords(int p_148124_1_, int p_148124_2_)`
- `void handleMouseInput()`
- `boolean isMouseYWithinSlotBounds(int p_148141_1_)`
- `protected abstract boolean isSelected(int slotIndex)` — Returns true if the element passed in is currently selected
- `protected void overlayBackground(int startY, int endY, int startAlpha, int endAlpha)` — Overlays the background to hide scrolled items
- `void registerScrollButtons(int scrollUpButtonIDIn, int scrollDownButtonIDIn)` — Registers the IDs that can be used for the scrollbar's up/down buttons.
- `void scrollBy(int amount)` — Scrolls the slot by the given amount.
- `void setDimensions(int widthIn, int heightIn, int topIn, int bottomIn)`
- `void setEnabled(boolean enabledIn)`
- `protected void setHasListHeader(boolean hasListHeaderIn, int headerPaddingIn)` — Sets hasListHeader and headerHeight.
- `void setShowSelectionBox(boolean showSelectionBoxIn)`
- `void setSlotXBoundsFromLeft(int leftIn)` — Sets the left and right bounds of the slot.

## Fields

- `protected float amountScrolled` — How far down this slot has been scrolled
- `int bottom` — The bottom of the slot container.
- `protected boolean field_148163_i`
- `protected boolean field_178041_q`
- `protected boolean hasListHeader`
- `int headerPadding`
- `int height`
- `protected int initialClickY` — Where the mouse was in the window when you first clicked to scroll
- `protected long lastClicked` — The time when this button was last clicked.
- `int left`
- `protected Minecraft mc`
- `protected int mouseX`
- `protected int mouseY`
- `int right`
- `protected float scrollMultiplier` — What to multiply the amount you moved your mouse by (used for slowing down scrolling when over the items and not on the scroll bar)
- `protected int selectedElement` — The element in the list that was selected
- `protected boolean showSelectionBox` — Set to true if a selected element in this gui will show an outline box
- `int slotHeight` — The height of a slot.
- `int top` — The top of the slot container.
- `int width`