# GuiScreen

## Class signature

```java
public abstract class GuiScreen extends Gui implements GuiYesNoCallback
```

## Constructors

- `public GuiScreen()`

## Methods

- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `protected void keyTyped(char typedChar, int keyCode) throws java.io.IOException`
- `public static java.lang.String getClipboardString()`
- `public static void setClipboardString(java.lang.String copyText)`
- `protected void renderToolTip( ItemStack stack, int x, int y)`
- `protected void drawCreativeTabHoveringText(java.lang.String tabName, int mouseX, int mouseY)`
- `protected void drawHoveringText(java.util.List<java.lang.String> textLines, int x, int y)`
- `protected void drawHoveringText(java.util.List<java.lang.String> textLines, int x, int y, FontRenderer font)`
- `protected void handleComponentHover( IChatComponent p_175272_1_, int p_175272_2_, int p_175272_3_)`
- `protected void setText(java.lang.String newChatText, boolean shouldOverwrite)`
- `protected boolean handleComponentClick( IChatComponent p_175276_1_)`
- `public void sendChatMessage(java.lang.String msg)`
- `public void sendChatMessage(java.lang.String msg, boolean addToChat)`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `protected void mouseReleased(int mouseX, int mouseY, int state)`
- `protected void mouseClickMove(int mouseX, int mouseY, int clickedMouseButton, long timeSinceLastClick)`
- `protected void actionPerformed( GuiButton button) throws java.io.IOException`
- `public void setWorldAndResolution( Minecraft mc, int width, int height)`
- `public void func_183500_a(int p_183500_1_, int p_183500_2_)`
- `public void initGui()`
- `public void handleInput() throws java.io.IOException`
- `public void handleMouseInput() throws java.io.IOException`
- `public void handleKeyboardInput() throws java.io.IOException`
- `public void updateScreen()`
- `public void onGuiClosed()`
- `public void drawDefaultBackground()`
- `public void drawWorldBackground(int tint)`
- `public void drawBackground(int tint)`
- `public boolean doesGuiPauseGame()`
- `public void confirmClicked(boolean result, int id)`
- `public static boolean isCtrlKeyDown()`
- `public static boolean isShiftKeyDown()`
- `public static boolean isAltKeyDown()`
- `public static boolean isKeyComboCtrlX(int p_175277_0_)`
- `public static boolean isKeyComboCtrlV(int p_175279_0_)`
- `public static boolean isKeyComboCtrlC(int p_175280_0_)`
- `public static boolean isKeyComboCtrlA(int p_175278_0_)`
- `public void onResize( Minecraft mcIn, int p_175273_2_, int p_175273_3_)`

## Description

The FontRenderer used by GuiScreen