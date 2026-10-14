---
title: "org.bukkit.attribute.AttributeModifier"
package: "org.bukkit.attribute"
source: https://jd.papermc.io/paper/26.3/org/bukkit/attribute/AttributeModifier.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class AttributeModifier**
`public class AttributeModifier extends Object implements ConfigurationSerializable, Keyed`
- `@Deprecated(since="1.21", forRemoval=true) public AttributeModifier(@NotNull @NotNull String name, double amount, @NotNull @NotNull AttributeModifier.Operation operation)`
- `@Deprecated(since="1.21", forRemoval=true) public AttributeModifier(@NotNull @NotNull UUID uuid, @NotNull @NotNull String name, double amount, @NotNull @NotNull AttributeModifier.Operation operation)`
- `@Deprecated(since="1.21", forRemoval=true) public AttributeModifier(@NotNull @NotNull UUID uuid, @NotNull @NotNull String name, double amount, @NotNull @NotNull AttributeModifier.Operation operation, @Nullable @Nullable EquipmentSlot slot)`
- `@Deprecated(since="1.21", forRemoval=true) public AttributeModifier(@NotNull @NotNull UUID uuid, @NotNull @NotNull String name, double amount, @NotNull @NotNull AttributeModifier.Operation operation, @NotNull @NotNull EquipmentSlotGroup slot)`
- `public AttributeModifier(@NotNull @NotNull NamespacedKey key, double amount, @NotNull @NotNull AttributeModifier.Operation operation)`
- `public AttributeModifier(@NotNull @NotNull NamespacedKey key, double amount, @NotNull @NotNull AttributeModifier.Operation operation, @NotNull @NotNull EquipmentSlotGroup slot)`
- `@NotNull @Deprecated(since="1.21", forRemoval=true) public @NotNull UUID getUniqueId()`
- `@NotNull public @NotNull NamespacedKey getKey()`
- `@NotNull public @NotNull String getName()`
- `public double getAmount()`
- `@NotNull public @NotNull AttributeModifier.Operation getOperation()`
- `@Nullable @Deprecated(since="1.20.5") public @Nullable EquipmentSlot getSlot()`
- `@NotNull public @NotNull EquipmentSlotGroup getSlotGroup()`
- `@NotNull public @NotNull Map<String,Object> serialize()`
- `public boolean equals(Object other)`
- `public int hashCode()`
- `public String toString()`
- `@NotNull public static @NotNull AttributeModifier deserialize(@NotNull @NotNull Map<String,Object> args)`
