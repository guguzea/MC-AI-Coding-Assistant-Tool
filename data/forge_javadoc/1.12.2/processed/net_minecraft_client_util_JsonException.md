# JsonException

## Class signature

```java
public class JsonException extends java.io.IOException
```

## Constructors

- `public JsonException(java.lang.String messageIn)`
- `public JsonException(java.lang.String messageIn, java.lang.Throwable cause)`

## Methods

- `public void prependJsonKey(java.lang.String key)`
- `public void setFilenameAndFlush(java.lang.String filenameIn)`
- `public java.lang.String getMessage()`
- `public static JsonException forException(java.lang.Exception exception)`