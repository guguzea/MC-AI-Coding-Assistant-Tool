/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.api;

/**
 * Container for all of an API's mixin environment configuration 
 */
public interface MixinConfigProvider
{
    /**
     * Get mixin configuration files for this API, all returned configs will be
     * added to the DEFAULT environment. Can return null.
     */
    public abstract String[] getMixinConfigs();

    /**
     * Get mixin error handler classes to register for this API. Can return
     * null.
     */
    public abstract String[] getErrorHandlers();
}
