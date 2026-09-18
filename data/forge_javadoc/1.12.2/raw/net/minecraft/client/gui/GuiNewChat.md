---
title: "GuiNewChat"
description: "public class GuiNewChat extends Gui"
package: "net/minecraft/client/gui"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/GuiNewChat.html"
sourceType: javadoc
---

# GuiNewChat

## Class signature

```java
public class GuiNewChat extends Gui
```

## Constructors

- `public GuiNewChat( Minecraft mcIn)`

## Methods

- `public void drawChat(int updateCounter)`
- `public void clearChatMessages(boolean p_146231_1_)`
- `public void printChatMessage( ITextComponent chatComponent)`
- `public void printChatMessageWithOptionalDeletion( ITextComponent chatComponent, int chatLineId)`
- `public void refreshChat()`
- `public java.util.List<java.lang.String> getSentMessages()`
- `public void addToSentMessages(java.lang.String message)`
- `public void resetScroll()`
- `public void scroll(int amount)`
- `public ITextComponent getChatComponent(int mouseX, int mouseY)`
- `public boolean getChatOpen()`
- `public void deleteChatLine(int id)`
- `public int getChatWidth()`
- `public int getChatHeight()`
- `public float getChatScale()`
- `public static int calculateChatboxWidth(float scale)`
- `public static int calculateChatboxHeight(float scale)`
- `public int getLineCount()`
