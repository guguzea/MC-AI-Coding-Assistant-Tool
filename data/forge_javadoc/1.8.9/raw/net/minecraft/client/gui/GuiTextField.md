---
title: "GuiTextField"
description: "public class GuiTextField extends Gui"
package: "net/minecraft/client/gui"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiTextField.html"
sourceType: javadoc
---

# GuiTextField

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiTextField

## Class signature

```java
public class GuiTextField extends Gui
```

## Constructors

- `GuiTextField(int componentId, FontRenderer fontrendererObj, int x, int y, int par5Width, int par6Height)`

## Methods

- `void deleteFromCursor(int p_146175_1_)` — delete the selected text, otherwsie deletes characters from either side of the cursor. params: delete num
- `void deleteWords(int p_146177_1_)` — Deletes the specified number of words starting at the cursor position.
- `void drawTextBox()` — Draws the textbox
- `int func_146197_a(int p_146197_1_, int p_146197_2_, boolean p_146197_3_)`
- `void func_175205_a(<any> p_175205_1_)`
- `void func_175207_a(GuiPageButtonList.GuiResponder p_175207_1_)`
- `int getCursorPosition()` — returns the current position of the cursor
- `boolean getEnableBackgroundDrawing()` — get enable drawing background and outline
- `int getId()`
- `int getMaxStringLength()` — returns the maximum number of character that can be contained in this textbox
- `int getNthWordFromCursor(int p_146187_1_)` — see @getNthNextWordFromPos() params: N, position
- `int getNthWordFromPos(int p_146183_1_, int p_146183_2_)` — gets the position of the nth word.
- `java.lang.String getSelectedText()` — returns the text between the cursor and selectionEnd
- `int getSelectionEnd()` — the side of the selection that is not the cursor, may be the same as the cursor
- `java.lang.String getText()` — Returns the contents of the textbox
- `boolean getVisible()` — returns true if this textbox is visible
- `int getWidth()` — returns the width of the textbox depending on if background drawing is enabled
- `boolean isFocused()` — Getter for the focused field
- `void mouseClicked(int p_146192_1_, int p_146192_2_, int p_146192_3_)` — Args: x, y, buttonClicked
- `void moveCursorBy(int p_146182_1_)` — Moves the text cursor by a specified number of characters and clears the selection
- `void setCanLoseFocus(boolean p_146205_1_)` — if true the textbox can lose focus by clicking elsewhere on the screen
- `void setCursorPosition(int p_146190_1_)` — sets the position of the cursor to the provided index
- `void setCursorPositionEnd()` — sets the cursors position to after the text
- `void setCursorPositionZero()` — sets the cursors position to the beginning
- `void setDisabledTextColour(int p_146204_1_)`
- `void setEnableBackgroundDrawing(boolean p_146185_1_)` — enable drawing background and outline
- `void setEnabled(boolean p_146184_1_)`
- `void setFocused(boolean p_146195_1_)` — Sets focus to this gui element
- `void setMaxStringLength(int p_146203_1_)`
- `void setSelectionPos(int p_146199_1_)` — Sets the position of the selection anchor (i.e. position the selection was started at)
- `void setText(java.lang.String p_146180_1_)` — Sets the text of the textbox
- `void setTextColor(int p_146193_1_)` — Sets the text colour for this textbox (disabled text will not use this colour)
- `void setVisible(boolean p_146189_1_)` — Sets whether or not this textbox is visible
- `boolean textboxKeyTyped(char p_146201_1_, int p_146201_2_)` — Call this method from your GuiScreen to process the keys into the textbox
- `void updateCursorCounter()` — Increments the cursor counter
- `void writeText(java.lang.String p_146191_1_)` — replaces selected text, or inserts text at the position on the cursor

## Fields

- `int height`
- `int width` — The width of this text field.
- `int xPosition`
- `int yPosition`
