# MissingModsException

**Inheritance:** java.lang.Object → java.lang.Throwable → java.lang.Exception → java.lang.RuntimeException → net.minecraftforge.fml.common.EnhancedRuntimeException → net.minecraftforge.fml.common.MissingModsException

## Class signature

```java
public class MissingModsException extends EnhancedRuntimeException implements IDisplayableError
```

## Constructors

- `@Deprecated MissingModsException(java.util.Set<ArtifactVersion> missingMods, java.lang.String id, java.lang.String name)`
- `MissingModsException(java.lang.String id, java.lang.String name)`

## Methods

- `void addMissingMod(ArtifactVersion acceptedVersion, ArtifactVersion currentVersion, boolean required)`
- `GuiScreen createGui()`
- `java.lang.String getMessage()`
- `java.util.List<MissingModsException.MissingModInfo> getMissingModInfos()`
- `java.lang.String getModName()`
- `protected void printStackTrace(EnhancedRuntimeException.WrappedPrintStream stream)`

## Fields

- `java.util.Set<ArtifactVersion> missingMods` — Deprecated. use getMissingModInfos()