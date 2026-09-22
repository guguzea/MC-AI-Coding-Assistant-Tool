# HttpUtil

**Inheritance:** java.lang.Object → net.minecraft.util.HttpUtil

## Class signature

```java
public class HttpUtil extends java.lang.Object
```

## Constructors

- `HttpUtil()`

## Methods

- `static java.lang.String buildPostString(java.util.Map<java.lang.String, java.lang.Object> data)` — Builds an encoded HTTP POST content string from a string map
- `static<any> downloadResourcePack(java.io.File saveFile, java.lang.String packUrl, java.util.Map<java.lang.String, java.lang.String> p_180192_2_, int maxSize, IProgressUpdate p_180192_4_, java.net.Proxy p_180192_5_)`
- `static java.lang.String get(java.net.URL url)` — Send a GET request to the given URL.
- `static int getSuitableLanPort()`
- `static java.lang.String postMap(java.net.URL url, java.util.Map<java.lang.String, java.lang.Object> data, boolean skipLoggingErrors)` — Sends a POST to the given URL using the map as the POST args

## Fields

- `static ListeningExecutorService field_180193_a`