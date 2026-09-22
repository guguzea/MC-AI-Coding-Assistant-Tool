# StatCollector

**Inheritance:** java.lang.Object → net.minecraft.util.StatCollector

## Class signature

```java
public class StatCollector extends java.lang.Object
```

## Constructors

- `StatCollector()`

## Methods

- `static boolean canTranslate(java.lang.String key)` — Determines whether or not translateToLocal will find a translation for the given key.
- `static long getLastTranslationUpdateTimeInMilliseconds()` — Gets the time, in milliseconds since epoch, that the translation mapping was last updated
- `static java.lang.String translateToFallback(java.lang.String key)` — Translates a Stat name using the fallback (hardcoded en_US) locale.
- `static java.lang.String translateToLocal(java.lang.String key)` — Translates a Stat name
- `static java.lang.String translateToLocalFormatted(java.lang.String key, java.lang.Object... format)` — Translates a Stat name with format args