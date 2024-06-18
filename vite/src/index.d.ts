interface Window {
  ethereum: any;
}

interface NftMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}

interface MarketNftMetadata extends NftMetadata {
  price: bigint;
  tokenOwner: string;
}
