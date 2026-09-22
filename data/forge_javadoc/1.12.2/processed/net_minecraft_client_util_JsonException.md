# JsonException

**Inheritance:** java.lang.Object → java.lang.Throwable → java.lang.Exception → java.io.IOException → net.minecraft.client.util.JsonException

## Class signature

```java
public class JsonException extends java.io.IOException
```

## Constructors

- `JsonException(java.lang.String messageIn)`
- `JsonException(java.lang.String messageIn, java.lang.Throwable cause)`

## Methods

- `static JsonException forException(java.lang.Exception exception)`
- `java.lang.String getMessage()`
- `void prependJsonKey(java.lang.String key)`
- `void setFilenameAndFlush(java.lang.String filenameIn)`