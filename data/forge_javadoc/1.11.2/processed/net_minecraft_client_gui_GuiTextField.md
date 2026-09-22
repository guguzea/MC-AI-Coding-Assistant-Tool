# GuiTextField

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiTextField

## Class signature

```java
public class GuiTextField extends Gui
```

## Constructors

- `GuiTextField(int componentId, FontRenderer fontrendererObj, int x, int y, int par5Width, int par6Height)`

## Methods

- `void deleteFromCursor(int num)`
- `void deleteWords(int num)`
- `void drawTextBox()`
- `int getCursorPosition()`
- `boolean getEnableBackgroundDrawing()`
- `int getId()`
- `int getMaxStringLength()`
- `int getNthWordFromCursor(int numWords)`
- `int getNthWordFromPos(int n, int pos)`
- `int getNthWordFromPosWS(int n, int pos, boolean skipWs)`
- `java.lang.String getSelectedText()`
- `int getSelectionEnd()`
- `java.lang.String getText()`
- `boolean getVisible()`
- `int getWidth()`
- `boolean isFocused()`
- `void mouseClicked(int mouseX, int mouseY, int mouseButton)`
- `void moveCursorBy(int num)`
- `void setCanLoseFocus(boolean canLoseFocusIn)`
- `void setCursorPosition(int pos)`
- `void setCursorPositionEnd()`
- `void setCursorPositionZero()`
- `void setDisabledTextColour(int color)`
- `void setEnableBackgroundDrawing(boolean enableBackgroundDrawingIn)`
- `void setEnabled(boolean enabled)`
- `void setFocused(boolean isFocusedIn)`
- `void setGuiResponder(GuiPageButtonList.GuiResponder guiResponderIn)`
- `void setMaxStringLength(int length)`
- `void setResponderEntryValue(int idIn, java.lang.String textIn)`
- `void setSelectionPos(int position)`
- `void setText(java.lang.String textIn)`
- `void setTextColor(int color)`
- `void setValidator(com.google.common.base.Predicate<java.lang.String> theValidator)`
- `void setVisible(boolean isVisible)`
- `boolean textboxKeyTyped(char typedChar, int keyCode)`
- `void updateCursorCounter()`
- `void writeText(java.lang.String textToWrite)`

## Fields

- `int height`
- `int width`
- `int xPosition`
- `int yPosition`