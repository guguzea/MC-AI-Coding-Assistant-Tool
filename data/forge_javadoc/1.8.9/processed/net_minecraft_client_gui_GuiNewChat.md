# GuiNewChat

## Class signature

```java
public class GuiNewChat extends Gui
```

## Constructors

- `public GuiNewChat( Minecraft mcIn)`

## Methods

- `public void drawChat(int p_146230_1_)`
- `public void clearChatMessages()`
- `public void printChatMessage( IChatComponent p_146227_1_)`
- `public void printChatMessageWithOptionalDeletion( IChatComponent chatComponent, int chatLineId)`
- `public void refreshChat()`
- `public java.util.List<java.lang.String> getSentMessages()`
- `public void addToSentMessages(java.lang.String p_146239_1_)`
- `public void resetScroll()`
- `public void scroll(int p_146229_1_)`
- `public IChatComponent getChatComponent(int p_146236_1_, int p_146236_2_)`
- `public boolean getChatOpen()`
- `public void deleteChatLine(int p_146242_1_)`
- `public int getChatWidth()`
- `public int getChatHeight()`
- `public float getChatScale()`
- `public static int calculateChatboxWidth(float p_146233_0_)`
- `public static int calculateChatboxHeight(float p_146243_0_)`
- `public int getLineCount()`

## Description

Adds this string to the list of sent messages, for recall using the up/down arrow keys