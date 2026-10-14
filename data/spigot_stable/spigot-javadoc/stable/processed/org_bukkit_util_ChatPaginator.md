---
title: "org.bukkit.util.ChatPaginator"
package: "org.bukkit.util"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/util/ChatPaginator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ChatPaginator**
`public class ChatPaginator extends Object`
- `public static final int GUARANTEED_NO_WRAP_CHAT_PAGE_WIDTH`
- `public static final int AVERAGE_CHAT_PAGE_WIDTH`
- `public static final int UNBOUNDED_PAGE_WIDTH`
- `public static final int OPEN_CHAT_PAGE_HEIGHT`
- `public static final int CLOSED_CHAT_PAGE_HEIGHT`
- `public static final int UNBOUNDED_PAGE_HEIGHT`
- `public ChatPaginator()`
- `@NotNull public static ChatPaginator.ChatPage paginate(@Nullable String unpaginatedString, int pageNumber)`
- `@NotNull public static ChatPaginator.ChatPage paginate(@Nullable String unpaginatedString, int pageNumber, int lineLength, int pageHeight)`
- `@NotNull public static String[] wordWrap(@Nullable String rawString, int lineLength)`
