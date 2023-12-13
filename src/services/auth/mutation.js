import { gql } from "@apollo/client/core";
import { UserFragment } from "../fragments"; 

export const REGISTER = gql`
mutation register($sign_up_data: sign_up!, $merchantId:String){
  register(sign_up_data:$sign_up_data,  merchantId:$merchantId){
    ...UserFragment
  }
}
${UserFragment}
`; 

export const LOGIN = gql`
mutation login($auth:auth_provider!){
  login(auth:$auth){
    ...UserFragment
  }
}
${UserFragment}
`

export const WEBHOOK = gql`
mutation  updateWebhookUrl($url: String!){
  updateWebhookUrl(url:$url)
}
`

