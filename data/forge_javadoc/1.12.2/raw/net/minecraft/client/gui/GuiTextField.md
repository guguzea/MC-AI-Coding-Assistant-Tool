---
title: "GuiTextField"
description: "public class GuiTextField extends Gui"
package: "net/minecraft/client/gui"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/GuiTextField.html"
sourceType: javadoc
---

# GuiTextField

## Class signature

```java
public class GuiTextField extends Gui
```

## Constructors

- `public GuiTextField(int componentId, FontRenderer fontrendererObj, int x, int y, int par5Width, int par6Height)`

## Methods

- `public void setGuiResponder( GuiPageButtonList.GuiResponder guiResponderIn)`
- `public void updateCursorCounter()`
- `public void setText(java.lang.String textIn)`
- `public java.lang.String getText()`
- `public java.lang.String getSelectedText()`
- `public void setValidator(<any> theValidator)`
- `public void writeText(java.lang.String textToWrite)`
- `public void setResponderEntryValue(int idIn, java.lang.String textIn)`
- `public void deleteWords(int num)`
- `public void deleteFromCursor(int num)`
- `public int getId()`
- `public int getNthWordFromCursor(int numWords)`
- `public int getNthWordFromPos(int n, int pos)`
- `public int getNthWordFromPosWS(int n, int pos, boolean skipWs)`
- `public void moveCursorBy(int num)`
- `public void setCursorPosition(int pos)`
- `public void setCursorPositionZero()`
- `public void setCursorPositionEnd()`
- `public boolean textboxKeyTyped(char typedChar, int keyCode)`
- `public boolean mouseClicked(int mouseX, int mouseY, int mouseButton)`
- `public void drawTextBox()`
- `public void setMaxStringLength(int length)`
- `public int getMaxStringLength()`
- `public int getCursorPosition()`
- `public boolean getEnableBackgroundDrawing()`
- `public void setEnableBackgroundDrawing(boolean enableBackgroundDrawingIn)`
- `public void setTextColor(int color)`
- `public void setDisabledTextColour(int color)`
- `public void setFocused(boolean isFocusedIn)`
- `public boolean isFocused()`
- `public void setEnabled(boolean enabled)`
- `public int getSelectionEnd()`
- `public int getWidth()`
- `public void setSelectionPos(int position)`
- `public void setCanLoseFocus(boolean canLoseFocusIn)`
- `public boolean getVisible()`
- `public void setVisible(boolean isVisible)`
