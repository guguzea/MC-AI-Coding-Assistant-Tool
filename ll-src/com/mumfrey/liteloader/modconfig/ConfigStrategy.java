/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.modconfig;

import java.io.File;

import com.mumfrey.liteloader.core.LiteLoader;

/**
 * Configuration management strategy
 * 
 * @author Adam Mummery-Smith
 */
public enum ConfigStrategy
{
    /**
     * Use the unversioned "common" config folder
     */
    Unversioned,

    /**
     * Use the versioned config folder 
     */
    Versioned;

    public File getFileForStrategy(String fileName)
    {
        if (this == ConfigStrategy.Versioned)
        {
            return new File(LiteLoader.getConfigFolder(), fileName);
        }

        return new File(LiteLoader.getCommonConfigFolder(), fileName);
    }
}
