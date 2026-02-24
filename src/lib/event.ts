import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';

interface MessageEvents {
  'wallet.onAccount': () => void;
  'ethers.onSigner': (args: { signerOrProvider: Signer | Provider }) => void;
  'wallet.logout': () => void;
  'chain.switch': () => void;
}

export const eventBus = new EventEmitter() as TypedEmitter<MessageEvents>;
