import React, {useState} from "react";
import {Image, Col, Row, Input, Button, Card, Avatar} from 'antd';
import {
  useLocation,
  useNavigate
} from "react-router-dom";
import People from './People';
import {NEW_PEOPLE} from "../../store/actions";
import {StyledInputGroup} from '../../util/Styling.style';
import queryString from 'query-string';
import imgBar from '../../assets/bar.png';
import imgBeer from '../../assets/beer.png';
import imgOpen from '../../assets/open.png';
import imgClosed from '../../assets/closed.png';

function BeerBar(props) {
  const location = useLocation();
  const history = useNavigate();
  const [inviteCode, setInviteCode] = useState();
  const {drizzle} = props;
  let {SongVotingBar} = drizzle.contracts;
  const {web3} = drizzle;
  const store = drizzle.store.getState();
  const bar = store.bar;

  const onInvite = async () => {
    let {contract, invite} = queryString.parse(location.search);
    const personAlreadyInvited = !!invite ? invite.match(inviteCode) : false;
    if (!!inviteCode && !personAlreadyInvited) {
      const newPeople = "&invite=" + (!!invite ? invite + "," : "") + inviteCode;
      history(location.pathname + "?contract=" + contract + newPeople);
      const {dispatch} = drizzle.store;
      dispatch({type: NEW_PEOPLE, payload: {person: inviteCode}});
    }
  };

  return <>
    <Row justify="center">
      <Card
        title={<><Avatar shape="square"
                         src={<Image preview={false} src={imgBar} style={{width: 25}}/>}/>{SongVotingBar._address}</>}
        extra={
          <StyledInputGroup compact style={{display: "flex", justifyContent: "end"}}>
            <Input style={{minWidth: 300}} placeholder="Address" onChange={(e) => setInviteCode(e.target.value)}/>
            <Button type="primary" disabled={!!inviteCode && !web3.utils.isAddress(inviteCode)}
                    onClick={onInvite}>Invite</Button>
          </StyledInputGroup>}
        style={{width: "100%"}}>
        <Row>
          <Col span={12}>
            <p>Ether: {web3.utils.fromWei(bar.balance.toString(), "ether")} Ξ </p>
            <span>{bar.beerName || "Token"}: <span>{bar.beerAmount}</span> {bar.beerSymbol} (of total {bar.beerTotalSupply} {bar.beerSymbol})<Avatar
              src={<Image preview={false} src={imgBeer} style={{width: 25}}/>}/></span>
          </Col>
          <Col span={12}>
            <div style={{display: "flex", justifyContent: "right"}}>
              <Image preview={false} src={bar.open ? imgOpen : imgClosed} style={{height: 100}}/>
            </div>

          </Col>
        </Row>
      </Card>
    </Row>
    <Row gutter={10} justify="center">
      <People {...props} bar={bar}/>
    </Row>
  </>;
}

export default BeerBar;