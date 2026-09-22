# FMLRelaunchLog

**Inheritance:** java.lang.Object → net.minecraftforge.fml.relauncher.FMLRelaunchLog

## Class signature

```java
public class FMLRelaunchLog extends java.lang.Object
```

## Methods

- `static void fine(java.lang.String format, java.lang.Object... data)`
- `static void finer(java.lang.String format, java.lang.Object... data)`
- `org.apache.logging.log4j.Logger getLogger()`
- `static void info(java.lang.String format, java.lang.Object... data)`
- `static void log(org.apache.logging.log4j.Level level, java.lang.String format, java.lang.Object... data)`
- `static void log(org.apache.logging.log4j.Level level, java.lang.Throwable ex, java.lang.String format, java.lang.Object... data)`
- `static void log(java.lang.String targetLog, org.apache.logging.log4j.Level level, java.lang.String format, java.lang.Object... data)`
- `static void log(java.lang.String targetLog, org.apache.logging.log4j.Level level, java.lang.Throwable ex, java.lang.String format, java.lang.Object... data)`
- `static void severe(java.lang.String format, java.lang.Object... data)`
- `static void warning(java.lang.String format, java.lang.Object... data)`

## Fields

- `static FMLRelaunchLog log` — Our special logger for logging issues to.