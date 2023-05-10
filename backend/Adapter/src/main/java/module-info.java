module backend.Adapter.main {
    exports com.amrtm.mynoteapps.adapter.database;
    exports com.amrtm.mynoteapps.adapter.router;
    exports com.amrtm.mynoteapps.adapter.router.routerfunc.exception;
    exports com.amrtm.mynoteapps.adapter.router.routerfunc.pagingandsorting;
    exports com.amrtm.mynoteapps.adapter.storage;

    requires java.desktop;
    requires backend.Usecase.main;
    requires reactor.core;
    requires backend.Entities.main;
    requires spring.data.commons;
    requires spring.context;
}