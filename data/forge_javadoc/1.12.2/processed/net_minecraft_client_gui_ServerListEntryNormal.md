# ServerListEntryNormal

## Class signature

```java
public class ServerListEntryNormal extends java.lang.Object implements GuiListExtended.IGuiListEntry
```

## Constructors

- `protected ServerListEntryNormal( GuiMultiplayer ownerIn, ServerData serverIn)`

## Methods

- `public void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected, float partialTicks)`
- `protected void drawTextureAt(int p_178012_1_, int p_178012_2_, ResourceLocation p_178012_3_)`
- `public boolean mousePressed(int slotIndex, int mouseX, int mouseY, int mouseEvent, int relativeX, int relativeY)`
- `public void updatePosition(int slotIndex, int x, int y, float partialTicks)`
- `public void mouseReleased(int slotIndex, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `public ServerData getServerData()`