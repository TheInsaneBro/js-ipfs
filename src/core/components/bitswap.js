'use strict'

const OFFLINE_ERROR = require('../utils').OFFLINE_ERROR
const promisify = require('promisify-es6')

function formatWantlist (list) {
  return Array.from(list).map((e) => e[1])
}

module.exports = function bitswap (self) {
  return {
    wantlist: () => {
      if (!self.isOnline()) {
        throw new Error(OFFLINE_ERROR)
      }

      const list = self._bitswap.getWantlist()
      return formatWantlist(list)
    },

    stat: promisify((callback) => {
      if (!self.isOnline()) {
        callback(new Error(OFFLINE_ERROR))
      }

      const snapshot = self._bitswap.stat().snapshot

      callback(null, {
        provideBufLen: snapshot.providesBufferLength,
        blocksReceived: snapshot.blocksReceived,
        wantlist: formatWantlist(self._bitswap.getWantlist()),
        peers: self._bitswap.peers().map((id) => id.toB58String()),
        dupBlksReceived: snapshot.dupBlksReceived,
        dupDataReceived: snapshot.dupDataReceived,
        dataReceived: snapshot.dataReceived,
        blocksSent: snapshot.blocksSent,
        dataSent: snapshot.dataSent
      })
    }),

    unwant: (key) => {
      if (!self.isOnline()) {
        throw new Error(OFFLINE_ERROR)
      }

      // TODO: implement when https://github.com/ipfs/js-ipfs-bitswap/pull/10 is merged
    }
  }
}
