# GuiScreen

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen

## Class signature

```java
public class GuiScreen extends Gui
```

## Constructors

- `GuiScreen()`

## Methods

- `protected void actionPerformed(GuiButton p_146284_1_)`
- `void confirmClicked(boolean p_73878_1_, int p_73878_2_)`
- `boolean doesGuiPauseGame()`
- `void drawBackground(int p_146278_1_)`
- `protected void drawCreativeTabHoveringText(java.lang.String p_146279_1_, int p_146279_2_, int p_146279_3_)`
- `void drawDefaultBackground()`
- `void drawScreen(int p_73863_1_, int p_73863_2_, float p_73863_3_)`
- `void drawWorldBackground(int p_146270_1_)`
- `protected void func_146283_a(java.util.List p_146283_1_, int p_146283_2_, int p_146283_3_)`
- `static java.lang.String getClipboardString()`
- `void handleInput()`
- `void handleKeyboardInput()`
- `void handleMouseInput()`
- `void initGui()`
- `static boolean isCtrlKeyDown()`
- `static boolean isShiftKeyDown()`
- `protected void keyTyped(char p_73869_1_, int p_73869_2_)`
- `protected void mouseClicked(int p_73864_1_, int p_73864_2_, int p_73864_3_)`
- `protected void mouseClickMove(int p_146273_1_, int p_146273_2_, int p_146273_3_, long p_146273_4_)`
- `protected void mouseMovedOrUp(int p_146286_1_, int p_146286_2_, int p_146286_3_)`
- `void onGuiClosed()`
- `protected void renderToolTip(ItemStack p_146285_1_, int p_146285_2_, int p_146285_3_)`
- `static void setClipboardString(java.lang.String p_146275_0_)`
- `void setWorldAndResolution(Minecraft p_146280_1_, int p_146280_2_, int p_146280_3_)`
- `void updateScreen()`

## Fields

- `boolean allowUserInput`
- `protected java.util.List buttonList`
- `protected FontRenderer fontRendererObj`
- `int height`
- `protected static RenderItem itemRender`
- `protected java.util.List labelList`
- `Minecraft mc`
- `int width`