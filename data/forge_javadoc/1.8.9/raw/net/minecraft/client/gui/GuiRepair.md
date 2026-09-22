---
title: "GuiRepair"
description: "public class GuiRepair extends GuiContainer implements ICrafting"
package: "net/minecraft/client/gui"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiRepair.html"
sourceType: javadoc
---

# GuiRepair

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.inventory.GuiContainer → net.minecraft.client.gui.GuiRepair

## Class signature

```java
public class GuiRepair extends GuiContainer implements ICrafting
```

## Methods

- `protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY)` — Args : renderPartialTicks, mouseX, mouseY
- `protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY)` — Draw the foreground layer for the GuiContainer (everything in front of the items).
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `void onGuiClosed()` — Called when the screen is unloaded.
- `void sendAllWindowProperties(Container p_175173_1_, IInventory p_175173_2_)`
- `void sendProgressBarUpdate(Container containerIn, int varToUpdate, int newValue)` — Sends two ints to the client-side Container.
- `void sendSlotContents(Container containerToSend, int slotInd, ItemStack stack)` — Sends the contents of an inventory slot to the client-side Container.
- `void updateCraftingInventory(Container containerToSend, java.util.List<ItemStack> itemsList)` — update the crafting window inventory with the items in the list

## Fields

- `GuiRepair`
