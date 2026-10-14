---
title: "io.papermc.paper.chat.ChatRenderer"
package: "io.papermc.paper.chat"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/chat/ChatRenderer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ChatRenderer**
`@NullMarked @FunctionalInterface public interface ChatRenderer`
- `@OverrideOnly Component render(Player source, Component sourceDisplayName, Component message, Audience viewer)`
- `static ChatRenderer defaultRenderer()`
- `static ChatRenderer viewerUnaware(ChatRenderer.ViewerUnaware renderer)`
