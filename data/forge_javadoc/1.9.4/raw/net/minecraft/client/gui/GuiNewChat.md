---
title: "GuiNewChat"
description: "public class GuiNewChat extends Gui"
package: "net/minecraft/client/gui"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/gui/GuiNewChat.html"
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
- `public void clearChatMessages()`
- `public void printChatMessage( ITextComponent chatComponent)`
- `public void printChatMessageWithOptionalDeletion( ITextComponent chatComponent, int chatLineId)`
- `public void refreshChat()`
- `public java.util.List<java.lang.String> getSentMessages()`
- `public void addToSentMessages(java.lang.String message)`
- `public void resetScroll()`
- `public void scroll(int amount)`
- `@Nullable public ITextComponent getChatComponent(int mouseX, int mouseY)`
- `public boolean getChatOpen()`
- `public void deleteChatLine(int id)`
- `public int getChatWidth()`
- `public int getChatHeight()`
- `public float getChatScale()`
- `public static int calculateChatboxWidth(float scale)`
- `public static int calculateChatboxHeight(float scale)`
- `public int getLineCount()`
