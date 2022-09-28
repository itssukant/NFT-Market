import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
  nftaddress,nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {  
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') }

    async function buyNft(nft) {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
  
      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
      const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
        value: price
      })
      await transaction.wait()
      loadNFTs()
    }

    if (loadingState === 'loaded' && !nfts.length) return (
      <h1 className="noitem">No items in marketplace</h1>
      )

  return (

    <div className="bodymain3">
          {
            nfts.map((nft, i) => (
              <div key={i} className="bodycard" >
                <div className="imgnft"  >
                <img src={nft.image}   width="242" height="363" border-radius="10" />
                </div>

                <div className="bodycardtext">
                  <p  className="textname">{nft.name}</p>
                  <div >
                    <p className="textdes">{nft.description}</p>
                  </div>
                </div>
                <div className="pricearea">
                  <p className="textprice">{nft.price} ETH</p>
                  <button className="buttonsell" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
              
            ))
          }
        </div>
  )
}
