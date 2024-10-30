import React, {useState} from "react";
import {Card, Avatar, Image} from 'antd';
import BarOwner from "../roles/BarOwner";
import BarKeeper from "../roles/Barkeeper";
import Customer from "../roles/Customer";
import imgBeer from '../../assets/beer.png'
import imgBarkeeper from '../../assets/barkeeper.png'
import imgOwner from '../../assets/owner.png'
import imgCustomer from '../../assets/customer.png'

function Person(props) {
  const {drizzle, person, role} = props;
  const {web3} = drizzle;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const cancelModal = () => setIsModalVisible(false);

  let modal;
  let imgRole;
  switch (role) {
    case "owner":
      modal = <BarOwner person={person} drizzle={drizzle} isModalVisible={isModalVisible}
                        onCancelModal={cancelModal}/>;
      imgRole = imgOwner;
      break;
    case "barkeeper":
      modal = <BarKeeper key={isModalVisible} person={person} drizzle={drizzle} isModalVisible={isModalVisible}
                         onCancelModal={cancelModal}/>;
      imgRole = imgBarkeeper;
      break;
    default:
      modal = <Customer key={isModalVisible} person={person} drizzle={drizzle} isModalVisible={isModalVisible}
                        onCancelModal={cancelModal}/>;
      imgRole = imgCustomer;
      break;
  }

  return <>
    <Card type="inner" key={person.address} onClick={() => setIsModalVisible(true)}>
      <div className="personTitle"><Avatar shape="square"
                                           src={<Image preview={false} src={imgRole} style={{width: 25}}/>}/>
        <span> {person.address.substring(0, 7)} </span></div>
      <div style={{display: "flex"}}>
        Ξ <div style={{
        textOverflow: "ellipsis",
        overflow: 'hidden',
        width: "calc(100% - 50px)",
        display: "inline-block",
        paddingLeft: 5
      }}>{web3.utils.fromWei(person.balance.toString(), "ether")}</div>
      </div>
      <div>{person.beerTokens}<Avatar src={<Image preview={false} src={imgBeer} style={{width: 25}}/>}/></div>
      <div>{person.pendingBeer} pending <Avatar src={<Image preview={false} src={imgBeer} style={{width: 25}}/>}/>
      </div>
    </Card>
    {modal}
  </>;
}

export default Person;