---
title: "org.bukkit.attribute.AttributeInstance"
package: "org.bukkit.attribute"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/attribute/AttributeInstance.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface AttributeInstance**
`public interface AttributeInstance`
- `@NotNull Attribute getAttribute()`
- `double getBaseValue()`
- `void setBaseValue(double value)`
- `@NotNull Collection<AttributeModifier> getModifiers()`
- `void addModifier(@NotNull AttributeModifier modifier)`
- `void removeModifier(@NotNull AttributeModifier modifier)`
- `double getValue()`
- `double getDefaultValue()`
