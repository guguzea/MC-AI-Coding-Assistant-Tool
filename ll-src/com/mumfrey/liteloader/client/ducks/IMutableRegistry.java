/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.ducks;

public interface IMutableRegistry<K, V>
{
    public abstract V removeObjectFromRegistry(K key);
}
