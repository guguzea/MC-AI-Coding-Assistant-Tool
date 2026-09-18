# RenderingRegistry

## Class signature

```java
public class RenderingRegistry extends java.lang.Object
```

## Constructors

- `public RenderingRegistry()`

## Methods

- `@Deprecated public static void registerEntityRenderingHandler(java.lang.Class<? extends Entity > entityClass, Render <? extends Entity > renderer)`
- `public static void loadEntityRenderers(java.util.Map<java.lang.Class<? extends Entity >, Render <? extends Entity >> entityRenderMap)`
- `public static <T extends Entity > void registerEntityRenderingHandler(java.lang.Class<T> entityClass, IRenderFactory <? super T> renderFactory)`
- `public static void loadEntityRenderers( RenderManager manager, java.util.Map<java.lang.Class<? extends Entity >, Render <? extends Entity >> renderMap)`

## Description

Deprecated. use the factory version during Preinitialization. TODO Will be removed in 1.11.