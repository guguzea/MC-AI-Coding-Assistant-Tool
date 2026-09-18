# FillBucketEvent

## Class signature

```java
public class FillBucketEvent extends PlayerEvent
```

## Constructors

- `public FillBucketEvent( EntityPlayer player, ItemStack current, World world, RayTraceResult target)`

## Methods

- `public ItemStack getEmptyBucket()`
- `public World getWorld()`
- `public RayTraceResult getTarget()`
- `public ItemStack getFilledBucket()`
- `public void setFilledBucket( ItemStack bucket)`

## Description

This event is fired when a player attempts to use a Empty bucket, it can be canceled to completely prevent any further processing. If you set the result to 'ALLOW', it means that you have processed th