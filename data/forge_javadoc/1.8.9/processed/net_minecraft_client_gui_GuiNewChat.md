# GuiNewChat

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiNewChat

## Class signature

```java
public class GuiNewChat extends Gui
```

## Methods

- `void addToSentMessages(java.lang.String p_146239_1_)` — Adds this string to the list of sent messages, for recall using the up/down arrow keys
- `static int calculateChatboxHeight(float p_146243_0_)`
- `static int calculateChatboxWidth(float p_146233_0_)`
- `void clearChatMessages()` — Clears the chat.
- `void deleteChatLine(int p_146242_1_)` — finds and deletes a Chat line by ID
- `void drawChat(int p_146230_1_)`
- `IChatComponent getChatComponent(int p_146236_1_, int p_146236_2_)` — Gets the chat component under the mouse
- `int getChatHeight()`
- `boolean getChatOpen()` — Returns true if the chat GUI is open
- `float getChatScale()` — Returns the chatscale from mc.gameSettings.chatScale
- `int getChatWidth()`
- `int getLineCount()`
- `java.util.List<java.lang.String> getSentMessages()`
- `void printChatMessage(IChatComponent p_146227_1_)`
- `void printChatMessageWithOptionalDeletion(IChatComponent chatComponent, int chatLineId)` — prints the ChatComponent to Chat.
- `void refreshChat()`
- `void resetScroll()` — Resets the chat scroll (executed when the GUI is closed, among others)
- `void scroll(int p_146229_1_)` — Scrolls the chat by the given number of lines.

## Fields

- `GuiNewChat`