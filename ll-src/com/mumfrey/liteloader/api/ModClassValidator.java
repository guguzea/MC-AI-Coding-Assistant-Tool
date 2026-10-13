/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.api;

/**
 * Interface for object which validates whether a supplied mod class can be
 * loaded.
 *
 * @author Adam Mummery-Smith
 */
public interface ModClassValidator
{
    public abstract boolean validateName(String className);

    public abstract boolean validateClass(ClassLoader classLoader, Class<?> candidateClass);
}
