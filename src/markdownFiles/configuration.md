# Configuration DGS

In the configuration DGS we are managing the connections towards Rules-Engine (CCE) . This means that we are giving you the possibility to get information about what products that are allowed to sell in a given context.

If you are looking for documentation on how to use CCE, you can find it here -> https://intranet.volvocars.net/sites/CCE, we will not go into details about Rules-engine/CCE here.


From a query perspective configuration-dgs is responsible for:
```gql


fragment CarConfiguration on CarConfiguration {
  car {
    carKey
  }
  defaultCar {
    carKey
  }
  token {
    long
    short
  }
  errors {
    message
  }
  components {
    ...CarComponent
    configurations {
      ...CarConfiguration
    }
  }
  appliedChange {
    ...RequiredChange
  }
}

fragment RequiredChange on RequiredChange {
  component {
    ...CarComponent
  }
  componentsAdded {
    ...CarComponent
  }
  componentsRemoved {
    ...CarComponent
  }
}

fragment CarComponent on CarComponent {
  code
  type
  partOf {
    ...CarComponent
  }
  requires {
    ...CarComponent
  }
  requiresExclusively {
    ...CarComponent
  }
  configurations {
    ...CarConfiguration
  }
}

fragment Car on Car {
  configurationByPolicy(policy: $policy) {
    ...CarConfiguration
  }
  configurationByToken(token: $token) {
    ...CarConfiguration
  }
}

query{
  carByToken {
      ...Car
  }
  carsByPolicy() {
    cars {
      carKey
      ...Car
    }
  }
  preConfiguredCarsByPolicy() {
    cars {
      carKey
      ...Car
    }
  }
  assortment() {
    components {
      code
    }
  }
  carConfigurationBySpecification() {
    ...CarConfiguration
  }
}
```