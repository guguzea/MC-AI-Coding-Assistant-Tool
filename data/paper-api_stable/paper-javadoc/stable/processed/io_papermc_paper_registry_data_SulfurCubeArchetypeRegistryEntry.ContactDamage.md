---
title: "io.papermc.paper.registry.data.SulfurCubeArchetypeRegistryEntry.ContactDamage"
package: "io.papermc.paper.registry.data"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/SulfurCubeArchetypeRegistryEntry.ContactDamage.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SulfurCubeArchetypeRegistryEntry.ContactDamage**
`@NonExtendable public static interface SulfurCubeArchetypeRegistryEntry.ContactDamage`
- `TypedKey<DamageType> damageType()`
- `@Experimental @NonNegative float amount()`
- `boolean attributeToSource()`
- `@Contract(value="_, _, _ -> new", pure=true) @Experimental static SulfurCubeArchetypeRegistryEntry.ContactDamage of(TypedKey<DamageType> damageType, @NonNegative float amount, boolean attributeToSource)`
