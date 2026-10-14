---
title: "io.papermc.paper.registry.data.SulfurCubeArchetypeRegistryEntry.Builder"
package: "io.papermc.paper.registry.data"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/SulfurCubeArchetypeRegistryEntry.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SulfurCubeArchetypeRegistryEntry.Builder**
`@NonExtendable public static interface SulfurCubeArchetypeRegistryEntry.Builder extends SulfurCubeArchetypeRegistryEntry, RegistryBuilder<SulfurCube.Archetype>`
- `@Contract(value="_ -> this", mutates="this") SulfurCubeArchetypeRegistryEntry.Builder items(RegistryKeySet<ItemType> items)`
- `@Contract(value="_ -> this", mutates="this") default SulfurCubeArchetypeRegistryEntry.Builder attributeModifiers(SulfurCubeArchetypeRegistryEntry.AttributeEntry... entries)`
- `@Contract(value="_ -> this", mutates="this") SulfurCubeArchetypeRegistryEntry.Builder attributeModifiers(Iterable<SulfurCubeArchetypeRegistryEntry.AttributeEntry> entries)`
- `@Contract(value="_ -> this", mutates="this") SulfurCubeArchetypeRegistryEntry.Builder buoyant(boolean buoyant)`
- `@Contract(value="_ -> this", mutates="this") SulfurCubeArchetypeRegistryEntry.Builder explosion(@Nullable SulfurCubeArchetypeRegistryEntry.ExplosionSettings settings)`
- `@Contract(value="_ -> this", mutates="this") SulfurCubeArchetypeRegistryEntry.Builder contactDamage(@Nullable SulfurCubeArchetypeRegistryEntry.ContactDamage damage)`
- `@Contract(value="_ -> this", mutates="this") SulfurCubeArchetypeRegistryEntry.Builder knockbackModifiers(SulfurCubeArchetypeRegistryEntry.KnockbackModifiers modifiers)`
- `@Contract(value="_ -> this", mutates="this") SulfurCubeArchetypeRegistryEntry.Builder soundSettings(SulfurCubeArchetypeRegistryEntry.SoundSettings settings)`
