---
title: "Mod"
description: "public @interface Mod"
package: "cpw/mods/fml/common"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/Mod.html"
sourceType: javadoc
---

# Mod

## Class signature

```java
public @interface Mod
```

## Elements

- `java.lang.String modid` — The unique mod identifier for this mod
- `java.lang.String acceptableRemoteVersions` — A replacement for the no-longer-existing "versionRange" of NetworkMod.
- `java.lang.String acceptableSaveVersions` — A version range specifying compatible save version information.
- `java.lang.String acceptedMinecraftVersions` — The acceptable range of minecraft versions that this mod will load and run in The default ("empty string") indicates that only the current minecraft version is acceptable.
- `java.lang.String asmHookClass`
- `java.lang.String bukkitPlugin` — An optional bukkit plugin that will be injected into the bukkit plugin framework if this mod is loaded into the FML framework and the bukkit coremod is present.
- `boolean canBeDeactivated` — If your mod doesn't have a runtime persistent effect on the state of the game, and can be disabled without side effects (minimap mods, graphical tweak mods) then you can set true here and receive the FMLDeactivationEvent to perform deactivation tasks.
- `java.lang.String certificateFingerprint` — Specifying this field allows for a mod to expect a signed jar with a fingerprint matching this value.
- `Mod.CustomProperty [] customProperties` — A list of custom properties for this mod.
- `java.lang.String dependencies` — A simple dependency string for this mod (see modloader's "priorities" string specification)
- `java.lang.String guiFactory` — An optional GUI factory for this mod.
- `java.lang.String modLanguage` — The language the mod is authored in.
- `java.lang.String modLanguageAdapter` — The language adapter to be used to load this mod.
- `java.lang.String name` — A user friendly name for the mod
- `boolean useMetadata` — Whether to use the mcmod.info metadata by default for this mod.
- `java.lang.String version` — A version string for this mod
