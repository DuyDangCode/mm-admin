export type CommonHeader = {
  'x-api-key': string
}

export type AuthHeader = {
  'x-client-id': string
  authorization: string
} & CommonHeader
