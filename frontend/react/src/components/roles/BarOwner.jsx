import React, {useState} from "react";
import {Avatar, Button, Image, Input, InputNumber, Modal, Popconfirm, Select} from 'antd';
import {InputPrepend, StyledInputGroup} from '../../util/Styling.style';
import {useLocation} from "react-router-dom";
import {callWithGasEstimateAndErrorHandling} from "../../util/utils";
import queryString from 'query-string';
import imgBeer from '../../assets/beer.png'

const {Option} = Select;

function BarOwner(props) {
  const {drizzle, isModalVisible, onCancelModal, person} = props;
  const store = drizzle.store.getState();
  const bar = store.bar;
  const {SongVotingBar, BeerToken} = drizzle.contracts;
  const [loading, setLoading] = useState(false);
  const {web3} = drizzle;
  const [data, setData] = useState({
    ...bar,
    beerPrice: bar.beerPrice ? web3.utils.fromWei((bar.beerPrice).toString(), 'ether') : 0,
    supply: 0,
    addStaff: {
      role: "barkeeper",
      address: 0x0
    },
    payout: {
      amount: 0,
      address: 0x0
    }
  });
  const sender_address = person.address;
  const barAddress = SongVotingBar._address;
  const location = useLocation();
  let {invite} = queryString.parse(location.search);
  let statePeople = !!invite ? invite.split(",") : [];


  const onObjectChange = (key, value, subKey) => {
    setData(prevData => ({
      ...prevData,
      [key]: {
        ...prevData[key],
        [subKey]: value
      }
    }));
  };

  const supplyBeer = async () => {
    setLoading(true);
    await callWithGasEstimateAndErrorHandling({
      callback: BeerToken.methods.transfer(barAddress, parseInt(data.supply), web3.utils.toHex('supply')),
      from: sender_address,
    });
    setLoading(false);
  };

  const setBeerPrice = async () => {
    setLoading(true);
    const amount = web3.utils.toWei((data.beerPrice).toString(), 'ether');
    await callWithGasEstimateAndErrorHandling({
      callback: SongVotingBar.methods.setBeerPrice(amount),
      from: sender_address,
      onError: () =>
        setData({
          ...data,
          beerPrice: web3.utils.fromWei((bar.beerPrice).toString(), 'ether')
        })
    });
    setLoading(false);
  };

  const addStaff = async () => {
    setLoading(true);
    const {role, address: recipient_address} = data.addStaff;
    if (role === "barkeeper") {
      await callWithGasEstimateAndErrorHandling({
        callback: SongVotingBar.methods.addBarkeeper(recipient_address),
        from: sender_address
      });
    } else if (role === "owner") {
      await callWithGasEstimateAndErrorHandling({
        callback: SongVotingBar.methods.addOwner(recipient_address),
        from: sender_address
      });
    }
    setLoading(false);
  };

  const setBeerToken = async () => {
    setLoading(true);
    const beertoken_address = data.beerTokenAddress;
    await callWithGasEstimateAndErrorHandling({
      callback: SongVotingBar.methods.setBeerTokenContractAddress(beertoken_address),
      from: sender_address
    });
    setLoading(false);
  };

  const payout = async () => {
    setLoading(true);
    let {amount, address: recipient_address} = data.payout;
    amount = web3.utils.toWei((amount).toString(), 'ether');
    await callWithGasEstimateAndErrorHandling({
      callback: SongVotingBar.methods.payout(recipient_address, amount),
      from: sender_address
    });
    setLoading(false);
  };

  const renounceOwner = async () => {
    setLoading(true);
    await callWithGasEstimateAndErrorHandling({
      callback: SongVotingBar.methods.renounceOwner(),
      from: sender_address
    });
    setLoading(false);
  };

  return <>
    <Modal title="Bar Owner" visible={isModalVisible} onCancel={onCancelModal} footer={null}>
      <p>{person?.address}</p>
      <p> {web3.utils.fromWei(person?.balance.toString(), "ether")} Ξ</p>
      <div> {person?.beerTokens} <Avatar src={<Image preview={false} src={imgBeer} style={{width: 32}}/>}/></div>
      <div> {person?.pendingBeer} pending <Avatar src={<Image preview={false} src={imgBeer} style={{width: 32}}/>}/>
      </div>
      <StyledInputGroup compact>
        <InputPrepend width={'50px'}>
          <Avatar shape="square" src={<Image preview={false} src={imgBeer} style={{width: 28}}/>}/>
        </InputPrepend>
        <InputNumber style={{width: 'calc(100% - 150px)'}} defaultValue={data.supply}
                     onChange={supply => setData({...data, supply})}/>
        <Popconfirm
          title={'Send ' + data.supply + ' Beertokens from ' + sender_address + ' to ' + barAddress + '?'}
          onConfirm={supplyBeer}
          okText="Yes"
          cancelText="No"
        >
          <Button loading={loading} disabled={!BeerToken} type="primary" style={{width: '100px'}}> Supply </Button>
        </Popconfirm>
      </StyledInputGroup>
      <StyledInputGroup compact>
        <InputPrepend width={'50px'}>
          <div style={{lineHeight: "32px"}}>Ξ</div>
        </InputPrepend>
        <InputNumber value={data.beerPrice} defaultValue={data.beerPrice} style={{width: 'calc(100% - 200px)'}}
                     onChange={beerPrice => setData({...data, beerPrice})}/>
        <Button type="primary" loading={loading} onClick={setBeerPrice} style={{width: '150px'}}> Set Beer
          Price </Button>
      </StyledInputGroup>
      <StyledInputGroup compact>
        <Select placeholder="Address" style={{width: 'calc(100% - 250px)'}}
                onChange={address => onObjectChange("addStaff", address, "address")}>
          {Object.values(statePeople)?.map(account => <Option key={account} value={account}>{account}</Option>)}
        </Select>
        <Select defaultValue="Barkeeper" style={{width: '150px'}}
                onChange={role => onObjectChange("addStaff", role, "role")}>
          <Option value="owner">Owner</Option>
          <Option value="barkeeper">Barkeeper</Option>
        </Select>
        <Button type="primary" loading={loading} style={{width: '100px'}} onClick={addStaff}> Promote </Button>
      </StyledInputGroup>
      <StyledInputGroup compact>
        <InputPrepend width={'50px'}>
          <div style={{lineHeight: "32px"}}>Ξ</div>
        </InputPrepend>
        <InputNumber style={{width: '150px'}} defaultValue={0}
                     onChange={value => onObjectChange("payout", value, "amount")}/>
        <Select placeholder="Address" style={{width: 'calc(100% - 270px)'}}
                onChange={address => onObjectChange("payout", address, "address")}>
          {Object.values(statePeople)?.map(account => <Option key={account} value={account}>{account}</Option>)}
        </Select>
        <Button type="primary" loading={loading} onClick={payout} style={{width: '70px'}}> Payout </Button>
      </StyledInputGroup>
      <StyledInputGroup compact>
        <InputPrepend width={'80px'}>
          <div style={{lineHeight: "32px"}}>BeerToken</div>
        </InputPrepend>
        <Input placeholder="Address" value={data.beerTokenAddress} style={{width: 'calc(100% - 130px)'}}
               onChange={(e) => setData({...data, beerTokenAddress: e.target.value})}/>
        <Button loading={loading} type="primary" disabled={!web3.utils.isAddress(data.beerTokenAddress)} onClick={setBeerToken}
                style={{width: '50px'}}> Set </Button>
      </StyledInputGroup>
      <Button loading={loading} type="primary" danger onClick={renounceOwner}> Renounce Owner Role</Button>
    </Modal>
  </>;
}

export default BarOwner;