# CloudRenderer

## Class signature

```java
public class CloudRenderer extends java.lang.Object implements ISelectiveResourceReloadListener
```

## Constructors

- `public CloudRenderer()`

## Methods

- `public void checkSettings()`
- `public boolean render(int cloudTicks, float partialTicks)`
- `public void onResourceManagerReload( IResourceManager resourceManager, java.util.function.Predicate< IResourceType > resourcePredicate)`

## Description

A version of onResourceManager that selectively chooses IResourceType s to reload.