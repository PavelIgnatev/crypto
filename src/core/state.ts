import mem from "mem";
import BigNumber from "bignumber.js";

import { MichelCodecPacker, TezosToolkit } from "@taquito/taquito";
import { Tzip16Module } from "@taquito/tzip16";
import { Tzip12Module } from "@taquito/tzip12";

import { snakeToCamelKeys } from "./helpers";
import { FastRpcClient } from "./taquito-fast-rpc";
import { LambdaViewSigner } from "./lambda-view";
import { MAINNET_NETWORK } from "./defaults";

export const michelEncoder = new MichelCodecPacker();

export const Tezos = new TezosToolkit(
  //@ts-ignore
  new FastRpcClient(getNetwork().rpcBaseURL)
);
//@ts-ignore
Tezos.addExtension(new Tzip16Module());
//@ts-ignore
Tezos.addExtension(new Tzip12Module());
Tezos.setSignerProvider(new LambdaViewSigner());
Tezos.setPackerProvider(michelEncoder);

export const getStorage = mem(getStoragePure, { maxAge: 30000 });
export const getContract = mem(getContractPure);

export function getContractPure(address: string) {
  return Tezos.contract.at(address);
}

export async function getStoragePure(contractAddress: string) {
  const contract = await getContract(contractAddress);
  return contract.storage<any>();
}

export const getDexStorage = (contractAddress: string) =>
  getStorage(contractAddress).then((s) => snakeToCamelKeys(s.storage));

export async function getDexShares(address: string, exchange: string) {
  const storage = await getDexStorage(exchange);
  const ledger = storage.ledger || storage.accounts;
  const val = await ledger.get(address);
  if (!val) return null;

  const unfrozen = new BigNumber(val.balance);
  const frozen = new BigNumber(val.frozen_balance);

  return {
    unfrozen,
    frozen,
    total: unfrozen.plus(frozen),
  };
}

export function sharesFromNat(val: BigNumber.Value) {
  return new BigNumber(val);
}

export function getNetwork() {
  return MAINNET_NETWORK;
}
