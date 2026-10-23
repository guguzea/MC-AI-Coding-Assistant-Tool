---
title: "org.bukkit.util.ChatPaginator"
package: "org.bukkit.util"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/util/ChatPaginator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public static final int GUARANTEED_NO_WRAP_CHAT_PAGE_WIDTH`
- `public static final int AVERAGE_CHAT_PAGE_WIDTH`
- `public static final int UNBOUNDED_PAGE_WIDTH`
- `public static final int OPEN_CHAT_PAGE_HEIGHT`
- `public static final int CLOSED_CHAT_PAGE_HEIGHT`
- `public static final int UNBOUNDED_PAGE_HEIGHT`
- `public ChatPaginator()`
- `@NotNull public static @NotNull ChatPaginator.ChatPage paginate&#8203;(@Nullable @Nullable String unpaginatedString, int pageNumber)`
- `@NotNull public static @NotNull ChatPaginator.ChatPage paginate&#8203;(@Nullable @Nullable String unpaginatedString, int pageNumber, int lineLength, int pageHeight)`
- `@NotNull public static @NotNull String[] wordWrap&#8203;(@Nullable @Nullable String rawString, int lineLength)`
