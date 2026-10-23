---
title: "org.bukkit.help.HelpMap"
package: "org.bukkit.help"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/help/HelpMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Nullable @Nullable HelpTopic getHelpTopic&#8203;(@NotNull @NotNull String topicName)`
- `@NotNull @NotNull Collection<HelpTopic> getHelpTopics()`
- `void addTopic&#8203;(@NotNull @NotNull HelpTopic topic)`
- `void clear()`
- `void registerHelpTopicFactory&#8203;(@NotNull @NotNull Class<?> commandClass, @NotNull @NotNull HelpTopicFactory<?> factory)`
- `@NotNull @NotNull List<String> getIgnoredPlugins()`
