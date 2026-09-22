# GuiScreenRealmsProxy

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiScreenRealmsProxy

## Class signature

```java
public class GuiScreenRealmsProxy extends GuiScreen
```

## Methods

- `void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void confirmClicked(boolean result, int id)`
- `boolean doesGuiPauseGame()` — Returns true if this GUI should pause the game when it is displayed in single-player
- `void drawCreativeTabHoveringText(java.lang.String tabName, int mouseX, int mouseY)` — Draws the text when mouse is over creative inventory tab.
- `void drawDefaultBackground()` — Draws either a gradient over the background screen (when it exists) or a flat gradient over background.png
- `void drawGradientRect(int left, int top, int right, int bottom, int startColor, int endColor)` — Draws a rectangle with a vertical gradient between the specified colors (ARGB format).
- `void drawHoveringText(java.util.List<java.lang.String> textLines, int x, int y)` — Draws a List of strings as a tooltip.
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void drawTexturedModalRect(int x, int y, int textureX, int textureY, int width, int height)` — Draws a textured rectangle at the stored z-value.
- `void drawWorldBackground(int tint)`
- `void func_154319_c(java.lang.String p_154319_1_, int p_154319_2_, int p_154319_3_, int p_154319_4_)`
- `java.util.List<RealmsButton> func_154320_j()`
- `RealmsScreen func_154321_a()`
- `void func_154322_b(java.lang.String p_154322_1_, int p_154322_2_, int p_154322_3_, int p_154322_4_, boolean p_154322_5_)`
- `java.util.List<java.lang.String> func_154323_a(java.lang.String p_154323_1_, int p_154323_2_)`
- `void func_154324_i()`
- `void func_154325_a(java.lang.String p_154325_1_, int p_154325_2_, int p_154325_3_, int p_154325_4_)`
- `int func_154326_c(java.lang.String p_154326_1_)`
- `void func_154327_a(RealmsButton p_154327_1_)`
- `void func_154328_b(RealmsButton p_154328_1_)`
- `int func_154329_h()`
- `void handleKeyboardInput()` — Handles keyboard input.
- `void handleMouseInput()` — Handles mouse input.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `void mouseClickMove(int mouseX, int mouseY, int clickedMouseButton, long timeSinceLastClick)` — Called when a mouse button is pressed and the mouse is moved around.
- `void mouseReleased(int mouseX, int mouseY, int state)` — Called when a mouse button is released.
- `void onGuiClosed()` — Called when the screen is unloaded.
- `void renderToolTip(ItemStack stack, int x, int y)`
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `GuiScreenRealmsProxy`