# Mod

## Class signature

```java
public @interface Mod
```

## Elements

- `java.lang.String modid` — The unique mod identifier for this mod
- `java.lang.String acceptableRemoteVersions` — A replacement for the no-longer-existing "versionRange" of NetworkMod.
- `java.lang.String acceptableSaveVersions` — A version range specifying compatible save version information.
- `java.lang.String acceptedMinecraftVersions` — The acceptable range of minecraft versions that this mod will load and run in The default ("empty string") indicates that the currently RUNNING minecraft version is acceptable.
- `boolean canBeDeactivated` — If your mod doesn't have a runtime persistent effect on the state of the game, and can be disabled without side effects (minimap mods, graphical tweak mods) then you can set true here and receive the FMLDeactivationEvent to perform deactivation tasks.
- `java.lang.String certificateFingerprint` — Specifying this field allows for a mod to expect a signed jar with a fingerprint matching this value.
- `boolean clientSideOnly` — If true, this mod will not be loaded on the Dedicated Server environment.
- `Mod.CustomProperty [] customProperties` — A list of custom properties for this mod.
- `java.lang.String dependencies` — A simple dependency string for this mod (see modloader's "priorities" string specification)
- `java.lang.String guiFactory` — An optional GUI factory for this mod.
- `java.lang.String modLanguage` — The language the mod is authored in.
- `java.lang.String modLanguageAdapter` — The language adapter to be used to load this mod.
- `java.lang.String name` — A user friendly name for the mod
- `boolean serverSideOnly` — If true, this mod will not be loaded on the Client environment.
- `java.lang.String updateJSON` — An optional URL to a JSON file that will be checked once per launch to determine if there is an updated version of this mod and notify the end user.
- `boolean useMetadata` — Whether to use the mcmod.info metadata by default for this mod.
- `java.lang.String version` — A version string for this mod