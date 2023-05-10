module backend.Usecase.main {
    exports com.amrtm.mynoteapps.usecase.converter;
    exports com.amrtm.mynoteapps.usecase.converter.entity_converter;
    exports com.amrtm.mynoteapps.usecase.file;
    exports com.amrtm.mynoteapps.usecase.note;
    exports com.amrtm.mynoteapps.usecase.security;
    exports com.amrtm.mynoteapps.usecase.subtype;
    exports com.amrtm.mynoteapps.usecase.theme;
    exports com.amrtm.mynoteapps.usecase.user;

    requires backend.Entities.main;
    requires java.desktop;
    requires reactor.core;
    requires org.reactivestreams;
    requires spring.data.commons;
}