# FMLLog

## Class signature

```java
public class FMLLog extends java.lang.Object
```

## Constructors

- `public FMLLog()`

## Methods

- `public static void bigWarning(java.lang.String format, java.lang.Object... data)`
- `@Deprecated public static void log(java.lang.String targetLog, Level level, java.lang.String format, java.lang.Object... data)`
- `@Deprecated public static void log(Level level, java.lang.String format, java.lang.Object... data)`
- `@Deprecated public static void log(java.lang.String targetLog, Level level, java.lang.Throwable ex, java.lang.String format, java.lang.Object... data)`
- `@Deprecated public static void log(Level level, java.lang.Throwable ex, java.lang.String format, java.lang.Object... data)`
- `@Deprecated public static void severe(java.lang.String format, java.lang.Object... data)`
- `@Deprecated public static void warning(java.lang.String format, java.lang.Object... data)`
- `@Deprecated public static void info(java.lang.String format, java.lang.Object... data)`
- `@Deprecated public static void fine(java.lang.String format, java.lang.Object... data)`
- `@Deprecated public static void finer(java.lang.String format, java.lang.Object... data)`
- `@Deprecated public static Logger getLogger()`

## Description

FMLs logging class. Internal use only, NOT FOR MOD LOGGING! Mods use your own log, see FMLPreInitializationEvent.getModLog() . TODO 1.13 remove all the deprecated methods