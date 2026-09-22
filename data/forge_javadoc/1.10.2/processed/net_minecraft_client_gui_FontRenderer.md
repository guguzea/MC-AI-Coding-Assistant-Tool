# FontRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.gui.FontRenderer

## Class signature

```java
public class FontRenderer extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `FontRenderer(GameSettings gameSettingsIn, ResourceLocation location, TextureManager textureManagerIn, boolean unicode)`

## Methods

- `protected void bindTexture(ResourceLocation location)`
- `protected void doDraw(float f)`
- `void drawSplitString(java.lang.String str, int x, int y, int wrapWidth, int textColor)`
- `int drawString(java.lang.String text, float x, float y, int color, boolean dropShadow)`
- `int drawString(java.lang.String text, int x, int y, int color)`
- `int drawStringWithShadow(java.lang.String text, float x, float y, int color)`
- `protected void enableAlpha()`
- `boolean getBidiFlag()`
- `int getCharWidth(char character)`
- `int getColorCode(char character)`
- `static java.lang.String getFormatFromString(java.lang.String text)`
- `protected IResource getResource(ResourceLocation location)`
- `int getStringWidth(java.lang.String text)`
- `boolean getUnicodeFlag()`
- `java.util.List<java.lang.String> listFormattedStringToWidth(java.lang.String str, int wrapWidth)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `protected float renderDefaultChar(int ch, boolean italic)`
- `protected float renderUnicodeChar(char ch, boolean italic)`
- `void setBidiFlag(boolean bidiFlagIn)`
- `protected void setColor(float r, float g, float b, float a)`
- `void setUnicodeFlag(boolean unicodeFlagIn)`
- `int splitStringWidth(java.lang.String str, int maxLength)`
- `java.lang.String trimStringToWidth(java.lang.String text, int width)`
- `java.lang.String trimStringToWidth(java.lang.String text, int width, boolean reverse)`

## Fields

- `protected int[] charWidth`
- `int FONT_HEIGHT`
- `java.util.Random fontRandom`
- `protected byte[] glyphWidth`
- `protected ResourceLocation locationFontTexture`
- `protected float posX`
- `protected float posY`