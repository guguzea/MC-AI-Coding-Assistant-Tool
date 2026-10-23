---
title: "org.bukkit.help.HelpMap"
package: "org.bukkit.help"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/help/HelpMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Nullable @Nullable HelpTopic getHelpTopic(@NotNull @NotNull String topicName)`
- `@NotNull @NotNull Collection<HelpTopic> getHelpTopics()`
- `void addTopic(@NotNull @NotNull HelpTopic topic)`
- `void clear()`
- `void registerHelpTopicFactory(@NotNull @NotNull Class<?> commandClass, @NotNull @NotNull HelpTopicFactory<?> factory)`
- `@NotNull @NotNull List<String> getIgnoredPlugins()`
