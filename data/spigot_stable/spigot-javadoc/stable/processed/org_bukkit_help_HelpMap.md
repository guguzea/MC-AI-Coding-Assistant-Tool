---
title: "org.bukkit.help.HelpMap"
package: "org.bukkit.help"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/help/HelpMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface HelpMap**
`public interface HelpMap`
- `@Nullable HelpTopic getHelpTopic(@NotNull String topicName)`
- `@NotNull Collection<HelpTopic> getHelpTopics()`
- `void addTopic(@NotNull HelpTopic topic)`
- `void clear()`
- `void registerHelpTopicFactory(@NotNull Class<?> commandClass, @NotNull HelpTopicFactory<?> factory)`
- `@NotNull List<String> getIgnoredPlugins()`
