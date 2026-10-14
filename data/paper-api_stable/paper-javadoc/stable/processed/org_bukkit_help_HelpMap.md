---
title: "org.bukkit.help.HelpMap"
package: "org.bukkit.help"
source: https://jd.papermc.io/paper/26.3/org/bukkit/help/HelpMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface HelpMap**
`public interface HelpMap`
- `@Nullable @Nullable HelpTopic getHelpTopic(@NotNull @NotNull String topicName)`
- `@NotNull @NotNull Collection<HelpTopic> getHelpTopics()`
- `void addTopic(@NotNull @NotNull HelpTopic topic)`
- `void clear()`
- `void registerHelpTopicFactory(@NotNull @NotNull Class<?> commandClass, @NotNull @NotNull HelpTopicFactory<?> factory)`
- `@NotNull @NotNull List<String> getIgnoredPlugins()`
