# RealmsScreen

**Inheritance:** java.lang.Object → net.minecraft.realms.RealmsScreen

## Class signature

```java
public class RealmsScreen extends java.lang.Object
```

## Constructors

- `RealmsScreen()`

## Methods

- `static void bind(java.lang.String p_bind_0_)`
- `static void bindFace(java.lang.String p_bindFace_0_)`
- `static void blit(int p_blit_0_, int p_blit_1_, float p_blit_2_, float p_blit_3_, int p_blit_4_, int p_blit_5_, float p_blit_6_, float p_blit_7_)`
- `static void blit(int p_blit_0_, int p_blit_1_, float p_blit_2_, float p_blit_3_, int p_blit_4_, int p_blit_5_, int p_blit_6_, int p_blit_7_, float p_blit_8_, float p_blit_9_)`
- `void blit(int p_blit_1_, int p_blit_2_, int p_blit_3_, int p_blit_4_, int p_blit_5_, int p_blit_6_)`
- `void buttonClicked(RealmsButton p_buttonClicked_1_)`
- `java.util.List buttons()`
- `void buttonsAdd(RealmsButton p_buttonsAdd_1_)`
- `void buttonsClear()`
- `void buttonsRemove(RealmsButton p_buttonsRemove_1_)`
- `void confirmResult(boolean p_confirmResult_1_, int p_confirmResult_2_)`
- `void drawCenteredString(java.lang.String p_drawCenteredString_1_, int p_drawCenteredString_2_, int p_drawCenteredString_3_, int p_drawCenteredString_4_)`
- `void drawString(java.lang.String p_drawString_1_, int p_drawString_2_, int p_drawString_3_, int p_drawString_4_)`
- `void fillGradient(int p_fillGradient_1_, int p_fillGradient_2_, int p_fillGradient_3_, int p_fillGradient_4_, int p_fillGradient_5_, int p_fillGradient_6_)`
- `void fontDrawShadow(java.lang.String p_fontDrawShadow_1_, int p_fontDrawShadow_2_, int p_fontDrawShadow_3_, int p_fontDrawShadow_4_)`
- `int fontLineHeight()`
- `java.util.List fontSplit(java.lang.String p_fontSplit_1_, int p_fontSplit_2_)`
- `int fontWidth(java.lang.String p_fontWidth_1_)`
- `RealmsAnvilLevelStorageSource getLevelStorageSource()`
- `static java.lang.String getLocalizedString(java.lang.String p_getLocalizedString_0_)`
- `static java.lang.String getLocalizedString(java.lang.String p_getLocalizedString_0_, java.lang.Object... p_getLocalizedString_1_)`
- `GuiScreenRealmsProxy getProxy()`
- `int height()`
- `void init()`
- `void init(Minecraft p_init_1_, int p_init_2_, int p_init_3_)`
- `boolean isPauseScreen()`
- `void keyboardEvent()`
- `void keyPressed(char p_keyPressed_1_, int p_keyPressed_2_)`
- `void mouseClicked(int p_mouseClicked_1_, int p_mouseClicked_2_, int p_mouseClicked_3_)`
- `void mouseDragged(int p_mouseDragged_1_, int p_mouseDragged_2_, int p_mouseDragged_3_, long p_mouseDragged_4_)`
- `void mouseEvent()`
- `void mouseReleased(int p_mouseReleased_1_, int p_mouseReleased_2_, int p_mouseReleased_3_)`
- `static RealmsButton newButton(int p_newButton_0_, int p_newButton_1_, int p_newButton_2_, int p_newButton_3_, int p_newButton_4_, java.lang.String p_newButton_5_)`
- `static RealmsButton newButton(int p_newButton_0_, int p_newButton_1_, int p_newButton_2_, java.lang.String p_newButton_3_)`
- `RealmsEditBox newEditBox(int p_newEditBox_1_, int p_newEditBox_2_, int p_newEditBox_3_, int p_newEditBox_4_)`
- `void removed()`
- `void render(int p_render_1_, int p_render_2_, float p_render_3_)`
- `void renderBackground()`
- `void renderBackground(int p_renderBackground_1_)`
- `void renderTooltip(ItemStack p_renderTooltip_1_, int p_renderTooltip_2_, int p_renderTooltip_3_)`
- `void renderTooltip(java.util.List p_renderTooltip_1_, int p_renderTooltip_2_, int p_renderTooltip_3_)`
- `void renderTooltip(java.lang.String p_renderTooltip_1_, int p_renderTooltip_2_, int p_renderTooltip_3_)`
- `void tick()`
- `int width()`

## Fields

- `int height`
- `protected Minecraft minecraft`
- `static int SKIN_HAT_HEIGHT`
- `static int SKIN_HAT_U`
- `static int SKIN_HAT_V`
- `static int SKIN_HAT_WIDTH`
- `static int SKIN_HEAD_HEIGHT`
- `static int SKIN_HEAD_U`
- `static int SKIN_HEAD_V`
- `static int SKIN_HEAD_WIDTH`
- `static int SKIN_TEX_HEIGHT`
- `static int SKIN_TEX_WIDTH`
- `int width`