# LoadController

## Class signature

```java
public class LoadController extends java.lang.Object
```

## Constructors

- `public LoadController( Loader loader)`

## Methods

- `public void buildModList( FMLLoadEvent event)`
- `public void distributeStateMessage( LoaderState state, java.lang.Object... eventData)`
- `public void transition( LoaderState desiredState, boolean forceState)`
- `public ModContainer activeContainer()`
- `public void propogateStateMessage( FMLEvent stateEvent)`
- `public com.google.common.collect.ImmutableBiMap< ModContainer ,java.lang.Object> buildModObjectList()`
- `public void errorOccurred( ModContainer modContainer, java.lang.Throwable exception)`
- `public void printModStates(java.lang.StringBuilder ret)`
- `public java.util.List< ModContainer > getActiveModList()`
- `public LoaderState.ModState getModState( ModContainer selectedMod)`
- `public void distributeStateMessage(java.lang.Class<?> customEvent)`
- `public com.google.common.collect.BiMap< ModContainer ,java.lang.Object> getModObjectList()`
- `public boolean isInState( LoaderState state)`