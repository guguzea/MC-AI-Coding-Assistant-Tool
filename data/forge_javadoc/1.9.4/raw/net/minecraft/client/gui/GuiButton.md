---
title: "GuiButton"
description: "public class GuiButton extends Gui"
package: "net/minecraft/client/gui"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/gui/GuiButton.html"
sourceType: javadoc
---

# GuiButton

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiButton

## Class signature

```java
public class GuiButton extends Gui
```

## Constructors

- `GuiButton(int buttonId, int x, int y, int widthIn, int heightIn, java.lang.String buttonText)`
- `GuiButton(int buttonId, int x, int y, java.lang.String buttonText)`

## Methods

- `void drawButton(Minecraft mc, int mouseX, int mouseY)`
- `void drawButtonForegroundLayer(int mouseX, int mouseY)`
- `int getButtonWidth()`
- `protected int getHoverState(boolean mouseOver)`
- `boolean isMouseOver()`
- `protected void mouseDragged(Minecraft mc, int mouseX, int mouseY)`
- `boolean mousePressed(Minecraft mc, int mouseX, int mouseY)`
- `void mouseReleased(int mouseX, int mouseY)`
- `void playPressSound(SoundHandler soundHandlerIn)`
- `void setWidth(int width)`

## Fields

- `protected static ResourceLocation BUTTON_TEXTURES`
- `java.lang.String displayString`
- `boolean enabled`
- `int height`
- `protected boolean hovered`
- `int id`
- `int packedFGColour`
- `boolean visible`
- `int width`
- `int xPosition`
- `int yPosition`
