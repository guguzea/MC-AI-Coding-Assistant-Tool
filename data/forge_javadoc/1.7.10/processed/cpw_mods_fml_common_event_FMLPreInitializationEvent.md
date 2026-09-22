# FMLPreInitializationEvent

**Inheritance:** java.lang.Object → cpw.mods.fml.common.event.FMLEvent → cpw.mods.fml.common.event.FMLStateEvent → cpw.mods.fml.common.event.FMLPreInitializationEvent

## Class signature

```java
public class FMLPreInitializationEvent extends FMLStateEvent
```

## Constructors

- `FMLPreInitializationEvent(java.lang.Object... data)`

## Methods

- `void applyModContainer(ModContainer activeContainer)`
- `ASMDataTable getAsmData()`
- `@Deprecated java.security.cert.Certificate[] getFMLSigningCertificates()`
- `java.io.File getModConfigurationDirectory()`
- `Logger getModLog()` — Get a logger instance configured to write to the FML Log as a parent, identified by modid.
- `ModMetadata getModMetadata()`
- `LoaderState.ModState getModState()`
- `java.io.File getSourceFile()`
- `java.io.File getSuggestedConfigurationFile()`
- `java.util.Properties getVersionProperties()`