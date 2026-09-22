---
title: "GuiScreen"
description: "public abstract class GuiScreen extends Gui implements GuiYesNoCallback"
package: "net/minecraft/client/gui"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiScreen.html"
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

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void confirmClicked(boolean result, int id)`
- `boolean doesGuiPauseGame()` — Returns true if this GUI should pause the game when it is displayed in single-player
- `void drawBackground(int tint)` — Draws the background (i is always 0 as of 1.2.2)
- `protected void drawCreativeTabHoveringText(java.lang.String tabName, int mouseX, int mouseY)` — Draws the text when mouse is over creative inventory tab.
- `void drawDefaultBackground()` — Draws either a gradient over the background screen (when it exists) or a flat gradient over background.png
- `protected void drawHoveringText(java.util.List<java.lang.String> textLines, int x, int y)` — Draws a List of strings as a tooltip.
- `protected void drawHoveringText(java.util.List<java.lang.String> textLines, int x, int y, FontRenderer font)`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void drawWorldBackground(int tint)`
- `void func_183500_a(int p_183500_1_, int p_183500_2_)`
- `static java.lang.String getClipboardString()` — Returns a string stored in the system clipboard.
- `protected boolean handleComponentClick(IChatComponent p_175276_1_)` — Executes the click event specified by the given chat component
- `protected void handleComponentHover(IChatComponent p_175272_1_, int p_175272_2_, int p_175272_3_)` — Draws the hover event specified by the given chat component
- `void handleInput()` — Delegates mouse and keyboard input.
- `void handleKeyboardInput()` — Handles keyboard input.
- `void handleMouseInput()` — Handles mouse input.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `static boolean isAltKeyDown()` — Returns true if either alt key is down
- `static boolean isCtrlKeyDown()` — Returns true if either windows ctrl key is down or if either mac meta key is down
- `static boolean isKeyComboCtrlA(int p_175278_0_)`
- `static boolean isKeyComboCtrlC(int p_175280_0_)`
- `static boolean isKeyComboCtrlV(int p_175279_0_)`
- `static boolean isKeyComboCtrlX(int p_175277_0_)`
- `static boolean isShiftKeyDown()` — Returns true if either shift key is down
- `protected void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `protected void mouseClickMove(int mouseX, int mouseY, int clickedMouseButton, long timeSinceLastClick)` — Called when a mouse button is pressed and the mouse is moved around.
- `protected void mouseReleased(int mouseX, int mouseY, int state)` — Called when a mouse button is released.
- `void onGuiClosed()` — Called when the screen is unloaded.
- `void onResize(Minecraft mcIn, int p_175273_2_, int p_175273_3_)` — Called when the GUI is resized in order to update the world and the resolution
- `protected void renderToolTip(ItemStack stack, int x, int y)`
- `void sendChatMessage(java.lang.String msg)`
- `void sendChatMessage(java.lang.String msg, boolean addToChat)`
- `static void setClipboardString(java.lang.String copyText)` — Stores the given string in the system clipboard
- `protected void setText(java.lang.String newChatText, boolean shouldOverwrite)` — Sets the text of the chat
- `void setWorldAndResolution(Minecraft mc, int width, int height)` — Causes the screen to lay out its subcomponents again.
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `boolean allowUserInput`
- `protected java.util.List<GuiButton> buttonList`
- `protected FontRenderer fontRendererObj` — The FontRenderer used by GuiScreen
- `int height` — The height of the screen object.
- `protected RenderItem itemRender` — Holds a instance of RenderItem, used to draw the achievement icons on screen (is based on ItemStack)
- `protected java.util.List<GuiLabel> labelList`
- `Minecraft mc` — Reference to the Minecraft object.
- `int width` — The width of the screen object.
