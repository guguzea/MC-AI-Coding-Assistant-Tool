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
- `protected void handleComponentHover( ITextComponent component, int x, int y)`
- `protected void setText(java.lang.String newChatText, boolean shouldOverwrite)`
- `protected boolean handleComponentClick( ITextComponent component)`
- `public void sendChatMessage(java.lang.String msg)`
- `public void sendChatMessage(java.lang.String msg, boolean addToChat)`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `protected void mouseReleased(int mouseX, int mouseY, int state)`
- `protected void mouseClickMove(int mouseX, int mouseY, int clickedMouseButton, long timeSinceLastClick)`
- `protected void actionPerformed( GuiButton button) throws java.io.IOException`
- `public void setWorldAndResolution( Minecraft mc, int width, int height)`
- `public void setGuiSize(int w, int h)`
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
- `public static boolean isKeyComboCtrlX(int keyID)`
- `public static boolean isKeyComboCtrlV(int keyID)`
- `public static boolean isKeyComboCtrlC(int keyID)`
- `public static boolean isKeyComboCtrlA(int keyID)`
- `public void onResize( Minecraft mcIn, int w, int h)`