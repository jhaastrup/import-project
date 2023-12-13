import { gql } from "@apollo/client";

export const UserFragment = gql`
fragment UserFragment on ExoUser{
    email
    exohubAccountState
    exohubInventoryId
    full_name
    id
    merchantId
    token
    exohubInventories{
        id
      line1
      line2
      areaName
      cityName
      countryIsoCode
      countryName
      phoneNumber
      shippingType
      stateName
      zipCode
    }
}
`