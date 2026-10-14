---
title: "io.papermc.paper.registry.data.SulfurCubeArchetypeRegistryEntry.SoundSettings"
package: "io.papermc.paper.registry.data"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/SulfurCubeArchetypeRegistryEntry.SoundSettings.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SulfurCubeArchetypeRegistryEntry.SoundSettings**
`@NonExtendable public static interface SulfurCubeArchetypeRegistryEntry.SoundSettings`
- `@Experimental TypedKey<Sound> hitSound()`
- `@Experimental TypedKey<Sound> pushSound()`
- `float pushSoundImpulseThreshold()`
- `float pushSoundCooldown()`
- `@Contract(value="_, _, _, _ -> new", pure=true) @Experimental static SulfurCubeArchetypeRegistryEntry.SoundSettings of(TypedKey<Sound> hitSound, TypedKey<Sound> pushSound, float pushSoundImpulseThreshold, float pushSoundCooldown)`
