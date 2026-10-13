/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.permissions;


public class LocalPermissions implements Permissions
{
    @Override
    public boolean getPermissionSet(String permission)
    {
        return true;
    }

    @Override
    public boolean getHasPermission(String permission)
    {
        return true;
    }

    @Override
    public boolean getHasPermission(String permission, boolean defaultValue)
    {
        return defaultValue;
    }

}
