/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.api.exceptions;

public class InvalidAPIStateException extends APIException
{
    private static final long serialVersionUID = 1L;

    public InvalidAPIStateException(String message)
    {
        super(message);
    }
}
