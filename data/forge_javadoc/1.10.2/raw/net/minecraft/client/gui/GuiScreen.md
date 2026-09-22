---
title: "GuiScreen"
description: "public abstract class GuiScreen extends Gui implements GuiYesNoCallback"
package: "net/minecraft/client/gui"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/gui/GuiScreen.html"
sourceType: javadoc
---

# GuiScreen

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen

## Class signature

```java
public abstract class GuiScreen extends Gui implements GuiYesNoCallback
```

## Constructors

- `GuiScreen()`

## Methods

- `protected void actionPerformed(GuiButton button)`
- `protected<T extends GuiButton> T addButton(T p_189646_1_)`
- `void confirmClicked(boolean result, int id)`
- `boolean doesGuiPauseGame()`
- `void drawBackground(int tint)`
- `protected void drawCreativeTabHoveringText(java.lang.String tabName, int mouseX, int mouseY)`
- `void drawDefaultBackground()`
- `protected void drawHoveringText(java.util.List<java.lang.String> textLines, int x, int y)`
- `protected void drawHoveringText(java.util.List<java.lang.String> textLines, int x, int y, FontRenderer font)`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `void drawWorldBackground(int tint)`
- `static java.lang.String getClipboardString()`
- `protected boolean handleComponentClick(ITextComponent component)`
- `protected void handleComponentHover(ITextComponent component, int x, int y)`
- `void handleInput()`
- `void handleKeyboardInput()`
- `void handleMouseInput()`
- `void initGui()`
- `static boolean isAltKeyDown()`
- `static boolean isCtrlKeyDown()`
- `static boolean isKeyComboCtrlA(int keyID)`
- `static boolean isKeyComboCtrlC(int keyID)`
- `static boolean isKeyComboCtrlV(int keyID)`
- `static boolean isKeyComboCtrlX(int keyID)`
- `static boolean isShiftKeyDown()`
- `protected void keyTyped(char typedChar, int keyCode)`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)`
- `protected void mouseClickMove(int mouseX, int mouseY, int clickedMouseButton, long timeSinceLastClick)`
- `protected void mouseReleased(int mouseX, int mouseY, int state)`
- `void onGuiClosed()`
- `void onResize(Minecraft mcIn, int w, int h)`
- `protected void renderToolTip(ItemStack stack, int x, int y)`
- `void sendChatMessage(java.lang.String msg)`
- `void sendChatMessage(java.lang.String msg, boolean addToChat)`
- `static void setClipboardString(java.lang.String copyText)`
- `void setGuiSize(int w, int h)`
- `protected void setText(java.lang.String newChatText, boolean shouldOverwrite)`
- `void setWorldAndResolution(Minecraft mc, int width, int height)`
- `void updateScreen()`

## Fields

- `boolean allowUserInput`
- `protected java.util.List<GuiButton> buttonList`
- `protected FontRenderer fontRendererObj`
- `int height`
- `protected RenderItem itemRender`
- `protected java.util.List<GuiLabel> labelList`
- `Minecraft mc`
- `int width`
