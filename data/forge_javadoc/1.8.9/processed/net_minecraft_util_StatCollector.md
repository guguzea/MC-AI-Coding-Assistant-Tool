# StatCollector

## Class signature

```java
public class StatCollector extends java.lang.Object
```

## Constructors

- `public StatCollector()`

## Methods

- `public static java.lang.String translateToLocal(java.lang.String key)`
- `public static java.lang.String translateToLocalFormatted(java.lang.String key, java.lang.Object... format)`
- `public static java.lang.String translateToFallback(java.lang.String key)`
- `public static boolean canTranslate(java.lang.String key)`
- `public static long getLastTranslationUpdateTimeInMilliseconds()`

## Description

Determines whether or not translateToLocal will find a translation for the given key.