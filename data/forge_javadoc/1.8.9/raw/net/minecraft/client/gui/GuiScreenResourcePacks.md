---
title: "GuiScreenResourcePacks"
description: "public class GuiScreenResourcePacks extends GuiScreen"
package: "net/minecraft/client/gui"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiScreenResourcePacks.html"
sourceType: javadoc
---

# GuiScreenResourcePacks

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiScreenResourcePacks

## Class signature

```java
public class GuiScreenResourcePacks extends GuiScreen
```

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `java.util.List<ResourcePackListEntry> getAvailableResourcePacks()`
- `java.util.List<ResourcePackListEntry> getListContaining(ResourcePackListEntry p_146962_1_)`
- `java.util.List<ResourcePackListEntry> getSelectedResourcePacks()`
- `void handleMouseInput()` — Handles mouse input.
- `boolean hasResourcePackEntry(ResourcePackListEntry p_146961_1_)`
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `void markChanged()` — Marks the selected resource packs list as changed to trigger a resource reload when the screen is closed
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `protected void mouseReleased(int mouseX, int mouseY, int state)` — Called when a mouse button is released.

## Fields

- `GuiScreenResourcePacks`
