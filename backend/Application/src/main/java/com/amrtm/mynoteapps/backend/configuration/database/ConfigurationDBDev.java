package com.amrtm.mynoteapps.backend.configuration.database;

import com.amrtm.mynoteapps.adapter.database.Database;
import io.r2dbc.pool.PoolingConnectionFactoryProvider;
import io.r2dbc.spi.ConnectionFactories;
import io.r2dbc.spi.ConnectionFactory;
import io.r2dbc.spi.ConnectionFactoryOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.r2dbc.connection.R2dbcTransactionManager;
import org.springframework.r2dbc.connection.TransactionAwareConnectionFactoryProxy;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.transaction.ReactiveTransactionManager;
import org.springframework.transaction.reactive.TransactionalOperator;

@Configuration
@Profile("dev")
public class ConfigurationDBDev implements Database<ConnectionFactory> {
    @Value("${database.name}")
    private String db;
    @Value("${database.host}")
    private String host;
    @Value("${database.port}")
    private String port;
    @Value("${database.username}")
    private String username;
    @Value("${database.password}")
    private String password;
    @Value("${database.max_pool}")
    private int maxPool;
    @Value("${application.array.delimiter}")
    private String delimiter;

    @Bean
    public ConnectionFactory connectionFactory() {
        return ConnectionFactories.get(ConnectionFactoryOptions.builder()
                .option(ConnectionFactoryOptions.DRIVER,"pool")
                .option(ConnectionFactoryOptions.PROTOCOL,"postgresql") // driver identifier, PROTOCOL is delegated as DRIVER by the pool.
                .option(ConnectionFactoryOptions.HOST,host)
                .option(ConnectionFactoryOptions.PORT,Integer.parseInt(port))
                .option(ConnectionFactoryOptions.USER,username)
                .option(ConnectionFactoryOptions.PASSWORD,password)
                .option(ConnectionFactoryOptions.DATABASE,db)
                .option(PoolingConnectionFactoryProvider.MAX_SIZE,maxPool)
                .build());
    }

    @Bean
    TransactionAwareConnectionFactoryProxy transactionAwareConnectionFactoryProxy(ConnectionFactory connectionFactory) {
        return new TransactionAwareConnectionFactoryProxy(connectionFactory);
    }

    @Bean
    public DatabaseClient databaseClient(ConnectionFactory connectionFactory) {
        return DatabaseClient.builder()
                .connectionFactory(connectionFactory)
                .namedParameters(true)
                .build();
    }

    @Bean
    public ReactiveTransactionManager transactionManager(ConnectionFactory connectionFactory) {
        return new R2dbcTransactionManager(connectionFactory);
    }

    @Bean
    public TransactionalOperator transactionalOperator(ReactiveTransactionManager reactiveTransactionManager) {
        return TransactionalOperator.create(reactiveTransactionManager);
    }

//    @Bean
//    @Override
//    public R2dbcCustomConversions r2dbcCustomConversions() {
//        List<Converter<?, ?>> converters = new ArrayList<>();
////        converters.add(new DataConverter.DataConverterReadDataId());
////        converters.add(new DataConverter.DataConverterWriteDataId());
//        converters.add(new DataConverter.DataConverterWriteDataNoteType());
//        return R2dbcCustomConversions.of(MySqlDialect.INSTANCE,converters);
//    }
}
