---
title: "ServerSelectionList"
description: "public class ServerSelectionList extends GuiListExtended"
package: "net/minecraft/client/gui"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/ServerSelectionList.html"
sourceType: javadoc
---

# ServerSelectionList

## Class signature

```java
public class ServerSelectionList extends GuiListExtended
```

## Constructors

- `public ServerSelectionList( GuiMultiplayer ownerIn, Minecraft mcIn, int widthIn, int heightIn, int topIn, int bottomIn, int slotHeightIn)`

## Methods

- `public GuiListExtended.IGuiListEntry getListEntry(int index)`
- `protected int getSize()`
- `public void setSelectedSlotIndex(int selectedSlotIndexIn)`
- `protected boolean isSelected(int slotIndex)`
- `public int getSelected()`
- `public void updateOnlineServers( ServerList p_148195_1_)`
- `public void updateNetworkServers(java.util.List< LanServerInfo > p_148194_1_)`
- `protected int getScrollBarX()`
- `public int getListWidth()`
