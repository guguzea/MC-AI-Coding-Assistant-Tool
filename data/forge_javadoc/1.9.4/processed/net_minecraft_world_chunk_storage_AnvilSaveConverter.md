# AnvilSaveConverter

**Inheritance:** java.lang.Object → net.minecraft.world.storage.SaveFormatOld → net.minecraft.world.chunk.storage.AnvilSaveConverter

## Class signature

```java
public class AnvilSaveConverter extends SaveFormatOld
```

## Methods

- `boolean convertMapFormat(java.lang.String filename, IProgressUpdate progressCallback)`
- `void flushCache()`
- `java.lang.String getName()`
- `java.util.List<WorldSummary> getSaveList()`
- `ISaveHandler getSaveLoader(java.lang.String saveName, boolean storePlayerdata)`
- `protected int getSaveVersion()`
- `boolean isConvertible(java.lang.String saveName)`
- `boolean isOldMapFormat(java.lang.String saveName)`

## Fields

- `AnvilSaveConverter`