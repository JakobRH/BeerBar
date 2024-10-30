import React, {useState} from "react";
import {Avatar, Button, Image, InputNumber, Modal, Select} from 'antd';
import {InputPrepend, StyledInputGroup} from '../../util/Styling.style';
import {callWithGasEstimateAndErrorHandling} from "../../util/utils";
import {useLocation} from "react-router-dom";
import queryString from 'query-string';
import imgBeer from '../../assets/beer.png'

const {Option} = Select;

function BarKeeper(props) {
  const {drizzle, isModalVisible, onCancelModal, person} = props;
  const [loading, setLoading] = useState(false);
  const {web3} = drizzle;
  const {SongVotingBar} = drizzle.contracts;
  const [data, setData] = useState({
    serveBeer: {
      amount: 0,
      address: 0x0
    }
  });
  const sender_address = person.address;
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

  const serveBeer = async () => {
    setLoading(true);
    let {amount, address: recipient_address} = data.serveBeer;
    await callWithGasEstimateAndErrorHandling({
      callback: SongVotingBar.methods.serveBeer(recipient_address, amount),
      from: sender_address,
    });
    setLoading(false);
  };

  const renounceBarkeeper = async () => {
    setLoading(true);
    await callWithGasEstimateAndErrorHandling({
      callback: SongVotingBar.methods.renounceBarkeeper(),
      from: sender_address,
    });
    setLoading(false);
  };

  const openBar = async () => {
    setLoading(true);
    await callWithGasEstimateAndErrorHandling({
      callback: SongVotingBar.methods.openBar(),
      from: sender_address,
    });
    setLoading(false);
  };

  const closeBar = async () => {
    setLoading(true);
    await callWithGasEstimateAndErrorHandling({
      callback: SongVotingBar.methods.closeBar(),
      from: sender_address,
    });
    setLoading(false);
  };

  return <>
    <Modal title="Barkeeper" visible={isModalVisible} onCancel={onCancelModal} footer={null}>
      <p>{person?.address}</p>
      <p> {web3.utils.fromWei(person?.balance.toString(), "ether")} Ξ</p>
      <div> {person?.beerTokens} <Avatar src={<Image preview={false} src={imgBeer} style={{width: 32}}/>}/></div>
      <div> {person?.pendingBeer} pending <Avatar src={<Image preview={false} src={imgBeer} style={{width: 32}}/>}/>
      </div>
      <StyledInputGroup compact>
        <InputPrepend width={'50px'}>
          <Avatar shape="square" src={<Image preview={false} src={imgBeer} style={{width: 28}}/>}/>
        </InputPrepend>
        <InputNumber style={{width: '150px'}} onChange={value => onObjectChange("serveBeer", value, "amount")}/>
        <Select placeholder="Address" style={{width: 'calc(100% - 300px)'}}
                onChange={address => onObjectChange("serveBeer", address, "address")}>
          {Object.values(statePeople)?.map(account => <Option key={account} value={account}>{account}</Option>)}
        </Select>
        <Button type="primary" loading={loading} onClick={serveBeer} style={{width: '100px'}}> Serve Beer </Button>
      </StyledInputGroup>
      <div style={{marginBottom: 4}}>
        <Button type="primary" loading={loading} onClick={openBar} style={{width: 150, marginRight: 4}}> Open
          Bar</Button>
        <Button type="primary" loading={loading} danger onClick={closeBar} style={{width: 150}}> Close Bar</Button>
      </div>
      <Button loading={loading} type="primary" danger onClick={renounceBarkeeper}> Renounce Barkeeper Role</Button>
    </Modal>
  </>;
}

export default BarKeeper;