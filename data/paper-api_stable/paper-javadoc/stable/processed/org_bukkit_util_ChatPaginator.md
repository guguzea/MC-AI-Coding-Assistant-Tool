---
title: "org.bukkit.util.ChatPaginator"
package: "org.bukkit.util"
source: https://jd.papermc.io/paper/26.3/org/bukkit/util/ChatPaginator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
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
- `@NotNull public static @NotNull ChatPaginator.ChatPage paginate(@Nullable @Nullable String unpaginatedString, int pageNumber)`
- `@NotNull public static @NotNull ChatPaginator.ChatPage paginate(@Nullable @Nullable String unpaginatedString, int pageNumber, int lineLength, int pageHeight)`
- `@NotNull public static @NotNull String[] wordWrap(@Nullable @Nullable String rawString, int lineLength)`
