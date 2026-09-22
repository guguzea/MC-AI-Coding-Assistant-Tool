# ResourcePackListEntry

**Inheritance:** java.lang.Object → net.minecraft.client.resources.ResourcePackListEntry

## Class signature

```java
public abstract class ResourcePackListEntry extends java.lang.Object implements GuiListExtended.IGuiListEntry
```

## Constructors

- `ResourcePackListEntry(GuiScreenResourcePacks resourcePacksGUIIn)`

## Methods

- `protected abstract void bindResourcePackIcon()`
- `protected boolean canMoveDown()`
- `protected boolean canMoveLeft()`
- `protected boolean canMoveRight()`
- `protected boolean canMoveUp()`
- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected, float partialTicks)`
- `protected abstract java.lang.String getResourcePackDescription()`
- `protected abstract int getResourcePackFormat()`
- `protected abstract java.lang.String getResourcePackName()`
- `boolean isServerPack()`
- `boolean mousePressed(int slotIndex, int mouseX, int mouseY, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int slotIndex, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `protected boolean showHoverOverlay()`
- `void updatePosition(int slotIndex, int x, int y, float partialTicks)`

## Fields

- `protected Minecraft mc`
- `protected GuiScreenResourcePacks resourcePacksGUI`