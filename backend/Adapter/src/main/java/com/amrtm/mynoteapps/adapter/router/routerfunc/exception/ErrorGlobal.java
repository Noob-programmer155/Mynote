package com.amrtm.mynoteapps.adapter.router.routerfunc.exception;

import java.util.List;

public abstract class ErrorGlobal {
    public final String defaultMessage = "system error could`nt proses request";
    public abstract List<Class<? extends Exception>> systemException();
    public abstract List<Class<? extends Exception>> humanException();
    public abstract List<Class<? extends Exception>> authException();
}
