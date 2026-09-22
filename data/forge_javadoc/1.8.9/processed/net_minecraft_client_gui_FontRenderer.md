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
- `void drawSplitString(java.lang.String str, int x, int y, int wrapWidth, int textColor)` — Splits and draws a String with wordwrap (maximum length is parameter k)
- `int drawString(java.lang.String text, float x, float y, int color, boolean dropShadow)` — Draws the specified string.
- `int drawString(java.lang.String text, int x, int y, int color)` — Draws the specified string.
- `int drawStringWithShadow(java.lang.String text, float x, float y, int color)` — Draws the specified string with a shadow.
- `protected void enableAlpha()`
- `boolean getBidiFlag()` — Get bidiFlag that controls if the Unicode Bidirectional Algorithm should be run before rendering any string
- `int getCharWidth(char character)` — Returns the width of this character as rendered.
- `int getColorCode(char character)`
- `static java.lang.String getFormatFromString(java.lang.String text)` — Digests a string for nonprinting formatting characters then returns a string containing only that formatting.
- `protected java.io.InputStream getResourceInputStream(ResourceLocation location)`
- `int getStringWidth(java.lang.String text)` — Returns the width of this string.
- `boolean getUnicodeFlag()` — Get unicodeFlag controlling whether strings should be rendered with Unicode fonts instead of the default.png font.
- `java.util.List<java.lang.String> listFormattedStringToWidth(java.lang.String str, int wrapWidth)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `protected float renderDefaultChar(int ch, boolean italic)` — Render a single character with the default.png font at current (posX,posY) location...
- `protected float renderUnicodeChar(char ch, boolean italic)` — Render a single Unicode character at current (posX,posY) location using one of the /font/glyph_XX.png files...
- `void setBidiFlag(boolean bidiFlagIn)` — Set bidiFlag to control if the Unicode Bidirectional Algorithm should be run before rendering any string.
- `protected void setColor(float r, float g, float b, float a)`
- `void setUnicodeFlag(boolean unicodeFlagIn)` — Set unicodeFlag controlling whether strings should be rendered with Unicode fonts instead of the default.png font.
- `int splitStringWidth(java.lang.String p_78267_1_, int p_78267_2_)` — Returns the width of the wordwrapped String (maximum length is parameter k)
- `java.lang.String trimStringToWidth(java.lang.String text, int width)` — Trims a string to fit a specified Width.
- `java.lang.String trimStringToWidth(java.lang.String text, int width, boolean reverse)` — Trims a string to a specified width, and will reverse it if par3 is set.

## Fields

- `protected int[] charWidth` — Array of width of all the characters in default.png
- `int FONT_HEIGHT` — the height in pixels of default text
- `java.util.Random fontRandom`
- `protected byte[] glyphWidth` — Array of the start/end column (in upper/lower nibble) for every glyph in the /font directory.
- `protected ResourceLocation locationFontTexture`
- `protected float posX` — Current X coordinate at which to draw the next character.
- `protected float posY` — Current Y coordinate at which to draw the next character.