---
title: "org.bukkit.attribute.AttributeModifier"
package: "org.bukkit.attribute"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/attribute/AttributeModifier.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public AttributeModifier(@NotNull @NotNull String name, double amount, @NotNull @NotNull AttributeModifier.Operation operation)`
- `public AttributeModifier(@NotNull @NotNull UUID uuid, @NotNull @NotNull String name, double amount, @NotNull @NotNull AttributeModifier.Operation operation)`
- `public AttributeModifier(@NotNull @NotNull UUID uuid, @NotNull @NotNull String name, double amount, @NotNull @NotNull AttributeModifier.Operation operation, @Nullable @Nullable EquipmentSlot slot)`
- `@NotNull public @NotNull UUID getUniqueId()`
- `@NotNull public @NotNull String getName()`
- `public double getAmount()`
- `@NotNull public @NotNull AttributeModifier.Operation getOperation()`
- `@Nullable public @Nullable EquipmentSlot getSlot()`
- `@NotNull public @NotNull Map<String,Object> serialize()`
- `public boolean equals(Object other)`
- `public int hashCode()`
- `public String toString()`
- `@NotNull public static @NotNull AttributeModifier deserialize(@NotNull @NotNull Map<String,Object> args)`
