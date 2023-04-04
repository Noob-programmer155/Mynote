package com.amrtm.mynoteapps.backend.configuration.database.configuration;

import com.amrtm.mynoteapps.backend.configuration.database.ConfigurationDatabase;
import com.amrtm.mynoteapps.backend.model.other.Role;
import io.r2dbc.postgresql.PostgresqlConnectionConfiguration;
import io.r2dbc.postgresql.PostgresqlConnectionFactory;
import io.r2dbc.postgresql.codec.EnumCodec;
import io.r2dbc.spi.ConnectionFactory;
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
public class ConfigurationDBDev implements ConfigurationDatabase<ConnectionFactory> {
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
    @Value("${application.array.delimiter}")
    private String delimiter;

    @Bean
    public ConnectionFactory connectionFactory() {
        PostgresqlConnectionConfiguration connectionFactory = PostgresqlConnectionConfiguration.builder()
                .host(host)
                .port(Integer.parseInt(port))
                .username(username)
                .password(password)
                .database(db)
                .codecRegistrar(EnumCodec.builder().withEnum("role", Role.class).build())
                .build();
        return new PostgresqlConnectionFactory(connectionFactory);
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
