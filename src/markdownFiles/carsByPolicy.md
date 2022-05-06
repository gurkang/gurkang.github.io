# CarsByPolicy
Query to fetch many cars from a policy, is in the future going to be replaced by something more flexible then policy (since policy can be created by x amount of segments ex. (brand=volvo & client=configurator & market=DE & salesModel=wholesale & role=endCustomer) is the same thing as fetching the Configurator policy for DE, but then rules can be stored in a more flexible way).

## Listing all pno12:s
If you only want codes it's enough to only request this query with only a policy and then list "cars" from it. [Example in Apollo Studio](https://studio.apollographql.com/graph/Onstage-Graphql-Federation/explorer?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4QEcYIE4CeABAMICGeAzgEIEAKEANgJZQEAUAJAA5OsHoiAZRR5mSAOYBCAJRFgAHSREiUCjXp827XizaCeWgnMXKVq9fKXnz3JBCtmbKuxACMAJmvOAvt5V%2BZoGBIAA0IABuFMxkAEaMCJQYIKYqCiC6-OmC6R4AzG7poUo%2BID5AA&variant=production)

```
query CarsByPolicy($policy: String!) {
  carsByPolicy(policy: $policy) {
    cars {
      pno {
        pno12
      }
    }
  }
}
```

## Cars vs First
In many situations fetching all cars is unnecessary, so we have created the possibility to just fetch one car, this is very useful if you want to create a list of models as en example, then you can enrich one car with price, images etc. and you don't have to overfetch information that is not needed. [Example how to fetch one car in a group](https://studio.apollographql.com/graph/Onstage-Graphql-Federation/explorer?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4QEcYIE4CeABAMICGeAzgEIEAKEANgJZQEAUAJAA5OsHoiAZRR5mSAOYBCAJRFgAHSREiUCjXp827XizaCeWgnMXKVRAGbMqKeUvPnuSCHbMOVTiAEYATPfcAvv4qQWahoSAANCAAbhTMZABGjAiUGCCmKgoguvzZgtk%2BAMxe2ZFKASABQA&variant=production)

```
query CarsByPolicy($policy: String!) {
  carsByPolicy(policy: $policy) {
    first {
      pno {
        pno12
      }
    }
  }
}
```

## Grouping PNO12:s
In CarsByPolicy you can group cars based on a lot of types ([List of GroupTypes](https://studio.apollographql.com/graph/Onstage-Graphql-Federation/schema/reference/enums/CarListGroupingType?variant=production)), for example: MODEL_YEAR, FUEL_TYPE etc. This gives good possibilities to devide the products in clusters. Here is an example using both model year and fuel type [Example of grouping of products](https://studio.apollographql.com/graph/Onstage-Graphql-Federation/explorer?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4QEcYIE4CeABAMICGeAzgEIEAKEANgJZQEAUAOkkUQCQAHJqwLoiAZRR5mSAOYBCbrz6y8EGAIAqBAQjHk8AGWaUUAcTUaZs7bqX9V6gbQtPbCAEz6Kx066ty7twAlETA9lAUNPTCbOxCLGxigrEEoeE8vESOGrTsOVo6eg6Whbrp9llEANYIBJVZBXkF7slNBP5lnhWZVby19b19kVRhDX1EAkgQY0MTvFMQAIwe430Avmu8m3NEO1X7e9w7IAA0IABuFMxkAEaMCJQYIBm8nCAJIu9i7x4AzEt3qd7O8WkVvkR3gBZADyABEAKKGAD6AE0EQBBABKQJBIHanXcqwwkJAADEAKpI5GaVF0BG4zLHEDrIA&variant=production)

There is no limitation how many groupBy you can have.

```
query CarsByPolicy(
  $policy: String!
  $groupType: CarListGroupingType
  $groupByGroupType2: CarListGroupingType
) {
  carsByPolicy(policy: $policy) {
    groupBy(groupType: $groupType) {
      key
      groupBy(groupType: $groupByGroupType2) {
        key
        cars {
          pno {
            pno12
          }
        }
      }
    }
  }
}
```

## Filtering of cars
When using groupBy you can also filter the group, if you for example only is interested about electric cars you can filter the FULE_TYPE group to only get these cars. Of cource this filtering capabilities can be used with all types of grouping (modelYears, models etc.) [Example of filtering electric cars](https://studio.apollographql.com/graph/Onstage-Graphql-Federation/explorer?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4QEcYIE4CeABAMICGeAzgEIEAKEANgJZQEAUAOkkUQCQAHJqwLoiAZRR5mSAOYBCbrz6y8EGAIAqBAQgCyEMAkYBNBBTHk8AGWaUUAcTUaZs7bqX9V6gbQCijAhQUqyWFLb2Tj6u7giefABmzIwo%2BGKS0nLcAJREwJ5QFDT0wmzsQixsYoKlBLn5PLxE3hq07C1aOgjVHbEGRqbmePWeTUQA1ggEo00dbb1dPc6%2BBAFBIVAANERJKWn8u6nDeTNjk9ONY7yFVCeXV7wCSBB3Dw9PEACMAEynVwC%2Bf14gPuwJmILBSBBIE2IAAbhRmGQAEaBSgYEANXicEAVEQ4sQ474AZk%2BOM2nhxC10-WMZgoBKIOL0AHkACJ%2BawAfRMfgAggAlcmUkBzVaBYLSKCMnEAMQAqpyuZoTHQ-MLGjjDvgZSA6PKBX4uZy-CRNAKAJIkDX-ED-IA&variant=production)

```
query CarsByPolicy(
  $policy: String!
  $groupTypeModelYear: CarListGroupingType
  $groupByElectric: CarListGroupingType
  $filter: String
) {
  carsByPolicy(policy: $policy) {
    groupBy(groupType: $groupTypeModelYear) {
      key
      groupBy(groupType: $groupByElectric, filter: $filter) {
        key
        cars {
          pno {
            pno12
          }
        }
      }
    }
  }
}
```

## Sorting of cars
The use case for sorting of cars is only requested on price so far, if you have another use-case ping us. But right now we have implemented so that cars can be sorted on price. This is usefull if you want your clients to start from the cheapest possible car, but another use-case is that you for a model listing want to showcase visualisations from the most expensive car (keep in mind that we only have the start configuration of cars here, so it will not have any upgrades that are not standard on the base version of the car.) [Example how to sort on price](https://studio.apollographql.com/graph/Onstage-Graphql-Federation/explorer?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4QEcYIE4CeABAMICGeAzgEIEAKEANgJZQEAUAOkkUQCQAHJqwLoiAZRR5mSAOYBCbrz6y8EGAIAqBAQgCyEMAkYBNBBTHk8AGWaUUAcTUaZs7bqX9V6gbQCijAhQUqyWFLb2Tj6u7giefABmzIwo%2BGKS0nLxAtJQCCQQSEmyAJJIAjAoYnS5%2BYXFMHhkKMyFZRUoijz8lBB4KHp2lK41rAgAgpRiAHIwjIzifS1yGc0IsgRdAJREwJ5QFDT0wmzsQixsYoInBDt73bzeGrTsT1o6CFdvsQZGpuZ4O6eXi8ADWCAIwJBbxe3w%2BX2cvgIASCISgABoiEkUml%2BNjUoDdlCQURwZCHiSiL1%2BggwAB5JCjPJcCmUog5MYFIrMUrlSpXDl5LnFdqVYmU6kDIYjWqTK6SwaUYZyJkTSji3hA1mUg5UInatkCJAQfVss3s40ARgATBrKQBfO28R0GogutnukGel0ukDokAANwozDIACNApQMCB7rxOCBziI42I49aAMyWuPozxxuG6X7GMwUJNEON6OkAET81gA%2BiY-OMAEqZ7MgGHIwLBXLFuMAMQAqlXq5oTHQ-M3unH8fhuyA6H2G35q1W-CRNA2SiRx7H47VhTzRShizGQXHGNAyIEZ0YALSVrcnkBIMiIK8IBJkOaHv1QuNB6RhwIGzffBkDydUMCIABtABdTx7SzCcQAVaUVVlcDkxAIC4AgAM4m-JB7RAe0gA&variant=production)

We are always sorting them from cheapest to most expensive. We have to add priceConfigInput here, to understand that look at pricing-dgs documentaiton.

KEEP IN MIND - that requesting prices on all cars will add latency to you query. So if you fetch prices for 2000 cars in one query it will take time.

```
query CarsByPolicy(
  $policy: String!
  $groupTypeModelYear: CarListGroupingType
  $groupByElectric: CarListGroupingType
  $filter: String
  $priceConfigInput: PriceConfigurationInput!
  $sortMissingPriceAs: NullSortingStrategy!
) {
  carsByPolicy(policy: $policy) {
    groupBy(groupType: $groupTypeModelYear) {
      key
      groupBy(groupType: $groupByElectric, filter: $filter) {
        key
        sortedOnPrice(
          priceConfigInput: $priceConfigInput
          sortMissingPriceAs: $sortMissingPriceAs
        ) {
          cars {
            pno {
              pno12
            }
          }
        }
      }
    }
  }
}
```