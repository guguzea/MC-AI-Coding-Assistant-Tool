---
title: "org.bukkit.inventory.meta.trim.TrimMaterial"
package: "org.bukkit.inventory.meta.trim"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/trim/TrimMaterial.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface TrimMaterial**
`@NullMarked public interface TrimMaterial extends Keyed, Translatable`
- `static final TrimMaterial AMETHYST`
- `static final TrimMaterial COPPER`
- `static final TrimMaterial DIAMOND`
- `static final TrimMaterial EMERALD`
- `static final TrimMaterial GOLD`
- `static final TrimMaterial IRON`
- `static final TrimMaterial LAPIS`
- `static final TrimMaterial NETHERITE`
- `static final TrimMaterial QUARTZ`
- `static final TrimMaterial REDSTONE`
- `static final TrimMaterial RESIN`
- `static TrimMaterial create(Consumer<RegistryBuilderFactory<TrimMaterial, ? extends TrimMaterialRegistryEntry.Builder>> value)`
- `Component description()`
- `@Deprecated(forRemoval=true) String getTranslationKey()`
- `@Deprecated(forRemoval=true, since="1.20.4") NamespacedKey getKey()`
- `@Deprecated(forRemoval=true, since="1.20.4") default Key key()`
