package com.amrtm.mynoteapps.backend.configuration.database;

import io.r2dbc.spi.ConnectionFactory;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.transaction.ReactiveTransactionManager;
import org.springframework.transaction.reactive.TransactionalOperator;

public interface ConfigurationDatabase<T> {
    T connectionFactory();
}
