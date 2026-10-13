/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.crashreport;

import com.mumfrey.liteloader.core.LiteLoader;

import net.minecraft.crash.CrashReport;

public class CrashSectionLiteLoaderMods
{
    final CrashReport crashReport;

    public CrashSectionLiteLoaderMods(CrashReport report)
    {
        this.crashReport = report;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString()
    {
        try
        {
            return LiteLoader.getInstance().getLoadedModsList();
        }
        catch (Exception ex)
        {
            return "LiteLoader startup incomplete";
        }
    }
}
