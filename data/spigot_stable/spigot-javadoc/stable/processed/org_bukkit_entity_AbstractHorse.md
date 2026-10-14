---
title: "org.bukkit.entity.AbstractHorse"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/AbstractHorse.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface AbstractHorse**
`public interface AbstractHorse extends Vehicle, InventoryHolder, Tameable`
- `@Deprecated(since="1.11") @NotNull Horse.Variant getVariant()`
- `@Deprecated(since="1.11") @Contract("_ -> fail") void setVariant(Horse.Variant variant)`
- `int getDomestication()`
- `void setDomestication(int level)`
- `int getMaxDomestication()`
- `void setMaxDomestication(int level)`
- `double getJumpStrength()`
- `void setJumpStrength(double strength)`
- `boolean isEatingHaystack()`
- `void setEatingHaystack(boolean eatingHaystack)`
- `@NotNull AbstractHorseInventory getInventory()`
