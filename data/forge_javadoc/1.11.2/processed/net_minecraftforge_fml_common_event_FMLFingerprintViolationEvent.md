# FMLFingerprintViolationEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLEvent → net.minecraftforge.fml.common.event.FMLFingerprintViolationEvent

## Class signature

```java
public class FMLFingerprintViolationEvent extends FMLEvent
```

## Constructors

- `FMLFingerprintViolationEvent(boolean isDirectory, java.io.File source, com.google.common.collect.ImmutableSet<java.lang.String> fingerprints, java.lang.String expectedFingerprint)`

## Methods

- `java.lang.String getExpectedFingerprint()`
- `java.util.Set<java.lang.String> getFingerprints()`
- `java.io.File getSource()`
- `boolean isDirectory()`