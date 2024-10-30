import React, {useState} from "react";
import {Avatar, Button, Image, InputNumber, Modal, Popconfirm} from 'antd';
import {InputPrepend, StyledInputGroup} from '../../util/Styling.style';
import {callWithGasEstimateAndErrorHandling} from "../../util/utils";
import imgBeer from '../../assets/beer.png'

function Customer(props) {
  const {drizzle, isModalVisible, onCancelModal, person} = props;
  const [loading, setLoading] = useState(false);
  const {web3} = drizzle;
  const {SongVotingBar, BeerToken} = drizzle.contracts;
  const store = drizzle.store.getState();
  const {beerPrice} = store.bar;
  const [data, setData] = useState({
    buyToken: 0,
    serveBeer: {
      amount: 0,
      address: 0x0
    }
  });
  const sender_address = person.address;
  const barAddress = SongVotingBar._address;

  const buyBeer = async () => {
    setLoading(true);
    const amount = data.buyBeer;
    await callWithGasEstimateAndErrorHandling({
      callback: BeerToken.methods.transfer(barAddress, parseInt(amount)),
      from: sender_address,
    });
    setLoading(false);
  };

  const cancelBeer = async () => {
    setLoading(true);
    const amount = data.cancelBeer;
    await callWithGasEstimateAndErrorHandling({
      callback: SongVotingBar.methods.cancelOrder(parseInt(amount)),
      from: sender_address,
    });
    setLoading(false);
  };

  const buyTokens = async () => {
    const amount = data.buyToken;
    setLoading(true);
    const priceForABeerInWei = web3.utils.toBN(beerPrice).mul(web3.utils.toBN(amount));
    await callWithGasEstimateAndErrorHandling({
      callback: SongVotingBar.methods.buyToken(),
      from: sender_address,
      value: priceForABeerInWei
    });
    setLoading(false);
  };

  return <>
    <Modal title="Party People" visible={isModalVisible} onCancel={onCancelModal} footer={null}>
      <p>{person?.address}</p>
      <p> {web3.utils.fromWei(person?.balance.toString(), "ether")} Ξ</p>
      <div> {person?.beerTokens} <Avatar src={<Image preview={false} src={imgBeer} style={{width: 32}}/>}/>
      </div>
      <div> {person?.pendingBeer} pending <Avatar
        src={<Image preview={false} src={imgBeer} style={{width: 32}}/>}/></div>
      <StyledInputGroup compact>
        <InputPrepend width={'50px'}>
          <Avatar shape="square" src={<Image preview={false} src={imgBeer} style={{width: 28}}/>}/>
        </InputPrepend>
        <InputNumber style={{width: 'calc(100% - 200px)'}} defaultValue={data.buyBeer}
                     onChange={buyBeer => setData({...data, buyBeer})}/>
        <Popconfirm
          title={'Send ' + data.buyBeer + ' Beertokens from ' + sender_address + ' to ' + barAddress + '?'}
          onConfirm={buyBeer}
          okText="Yes"
          cancelText="No"
        >
          <Button loading={loading} disabled={!BeerToken} type="primary" style={{width: '150px'}}> Buy
            Beer </Button>
        </Popconfirm>
      </StyledInputGroup>
      <StyledInputGroup compact>
        <InputPrepend width={'50px'}>
          <div style={{lineHeight: "32px"}}>Ξ</div>
        </InputPrepend>
        <InputNumber style={{width: 'calc(100% - 200px)'}} defaultValue={data.buyTokens}
                     onChange={buyToken => setData({...data, buyToken})}/>
        <Popconfirm
          title={'Send ' + web3.utils.fromWei(web3.utils.toBN(beerPrice || 0).mul(web3.utils.toBN(data.buyToken))) + ' ETH from ' + sender_address + ' to ' + barAddress + '?'}
          onConfirm={buyTokens}
          okText="Yes"
          cancelText="No"
        >
          <Button loading={loading} disabled={!BeerToken} type="primary" style={{width: '150px'}}> Buy
            Tokens </Button>
        </Popconfirm>
      </StyledInputGroup>
      <StyledInputGroup compact>
        <InputPrepend width={'50px'}>
          <Avatar shape="square" src={<Image preview={false} src={imgBeer} style={{width: 28}}/>}/>
        </InputPrepend>
        <InputNumber style={{width: 'calc(100% - 200px)'}} defaultValue={data.cancelBeer}
                     onChange={cancelBeer => setData({...data, cancelBeer})}/>
        <Button loading={loading} type="primary" danger onClick={cancelBeer} style={{width: '150px'}}> Cancel
          Beer</Button>
      </StyledInputGroup>
    </Modal>
  </>;
}

export default Customer;