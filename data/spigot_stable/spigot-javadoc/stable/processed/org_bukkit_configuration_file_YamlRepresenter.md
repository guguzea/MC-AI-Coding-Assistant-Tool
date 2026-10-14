---
title: "org.bukkit.configuration.file.YamlRepresenter"
package: "org.bukkit.configuration.file"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/configuration/file/YamlRepresenter.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class YamlRepresenter**
`public class YamlRepresenter extends org.yaml.snakeyaml.representer.Representer`
- `protected Map<Class<? extends Object>, org.yaml.snakeyaml.nodes.Tag> classTags`
- `protected TimeZone timeZone`
- `protected org.yaml.snakeyaml.DumperOptions.NonPrintableStyle nonPrintableStyle`
- `@Deprecated(since="1.19.4") public YamlRepresenter()`
- `public YamlRepresenter(@NotNull org.yaml.snakeyaml.DumperOptions options)`
- `protected org.yaml.snakeyaml.nodes.Tag getTag(Class<?> arg0, org.yaml.snakeyaml.nodes.Tag arg1)`
- `public org.yaml.snakeyaml.nodes.Tag addClassTag(Class<? extends Object> arg0, org.yaml.snakeyaml.nodes.Tag arg1)`
- `public TimeZone getTimeZone()`
- `public void setTimeZone(TimeZone arg0)`
