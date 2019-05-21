class TenantConfig {
    constructor(id, name,domain_name, database_host, database_name, country, isActive, offie_address, payment_channels,application_settings) {
        this.id = id;
        this.name = name;
        this.domainName = domain_name;
        this.databaseHost = database_host;
        this.databaseName = database_name;
        this.country = country;
        this.isActive = isActive;
        this.officeAddress = offie_address;
        this.paymentChannels = payment_channels;
        this.applicationSettings = application_settings
    }
}

module.exports = TenantConfig;