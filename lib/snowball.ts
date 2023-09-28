import {
  Snowball,
  CHAINS,
  AuthProvider,
  SmartWalletProvider,
  AlchemySmartWalletProviderKey,
} from "@snowballtools/snowball-ts-sdk";

export const snowball = new Snowball(
  "snowball-api-key",
  CHAINS.goerli,
  {
    name: AuthProvider.lit,
  },
  {
    name: SmartWalletProvider.alchemy,
    apiKeys: {
      [AlchemySmartWalletProviderKey.goerli]: process.env
        .ALCHEMY_GOERLI_API_KEY as string,
      [AlchemySmartWalletProviderKey.goerli_gasPolicyId]: process.env
        .ALCHEMY_GOERLI_GAS_POLICY_ID as string,
      [AlchemySmartWalletProviderKey.sepolia]: process.env
        .ALCHEMY_SEPOLIA_API_KEY as string,
      [AlchemySmartWalletProviderKey.sepolia_gasPolicyId]: process.env
        .ALCHEMY_SEPOLIA_GAS_POLICY_ID as string,
    },
  },
);
