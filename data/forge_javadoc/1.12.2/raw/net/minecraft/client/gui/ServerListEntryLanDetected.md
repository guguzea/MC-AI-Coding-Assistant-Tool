---
title: "ServerListEntryLanDetected"
description: "public class ServerListEntryLanDetected extends java.lang.Object implements GuiListExtended.IGuiListEntry"
package: "net/minecraft/client/gui"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/ServerListEntryLanDetected.html"
sourceType: javadoc
---

# ServerListEntryLanDetected

**Inheritance:** java.lang.Object → net.minecraft.client.gui.ServerListEntryLanDetected

## Class signature

```java
public class ServerListEntryLanDetected extends java.lang.Object implements GuiListExtended.IGuiListEntry
```

## Constructors

- `ServerListEntryLanDetected(GuiMultiplayer p_i47141_1_, LanServerInfo p_i47141_2_)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected, float partialTicks)`
- `LanServerInfo getServerData()`
- `boolean mousePressed(int slotIndex, int mouseX, int mouseY, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int slotIndex, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void updatePosition(int slotIndex, int x, int y, float partialTicks)`

## Fields

- `protected Minecraft mc`
- `protected LanServerInfo serverData`
