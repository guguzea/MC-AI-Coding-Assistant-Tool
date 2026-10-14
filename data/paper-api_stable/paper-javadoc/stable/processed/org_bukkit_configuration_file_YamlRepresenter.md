---
title: "org.bukkit.configuration.file.YamlRepresenter"
package: "org.bukkit.configuration.file"
source: https://jd.papermc.io/paper/26.3/org/bukkit/configuration/file/YamlRepresenter.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class YamlRepresenter**
`public class YamlRepresenter extends Representer`
- `protected Map<Class<? extends Object>, Tag> classTags`
- `protected TimeZone timeZone`
- `protected DumperOptions.NonPrintableStyle nonPrintableStyle`
- `@Deprecated(since="1.19.4") public YamlRepresenter()`
- `public YamlRepresenter(@NotNull @NotNull DumperOptions options)`
- `protected Tag getTag(Class<?> arg0, Tag arg1)`
- `public Tag addClassTag(Class<? extends Object> arg0, Tag arg1)`
- `public TimeZone getTimeZone()`
- `public void setTimeZone(TimeZone arg0)`
