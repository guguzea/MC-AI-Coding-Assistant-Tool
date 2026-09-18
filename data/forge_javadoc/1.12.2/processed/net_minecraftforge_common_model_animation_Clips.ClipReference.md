# Clips.ClipReference

## Constructors

- `public ClipReference(java.lang.String clipName, java.util.function.Function<java.lang.String, IClip > clipResolver)`

## Methods

- `public IJointClip apply( IJoint joint)`
- `public java.lang.Iterable< Event > pastEvents(float lastPollTime, float time)`
- `public java.lang.String getName()`
- `public int hashCode()`
- `public boolean equals(java.lang.Object obj)`

## Description

Reference to another clip. Should only exist during debugging.