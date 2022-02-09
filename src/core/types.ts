export interface QSNetwork {
  id:
    | "mainnet"
    | "granadanet"
    | "hangzhounet"
    | "florencenet"
    | "edo2net"
    | "edonet"
    | "delphinet"
    | "carthagenet";
  connectType: "default" | "custom";
  name: string;
  type: "main" | "test";
  rpcBaseURL: string;
  description: string;
  color: string;
  disabled: boolean;
}
