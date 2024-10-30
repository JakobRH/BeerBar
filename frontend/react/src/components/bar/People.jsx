import React, {useEffect} from "react";
import {Col} from 'antd';
import {useLocation} from "react-router-dom";
import Person from './Person';
import {StyledGroupCard} from "../../util/Styling.style";
import {NEW_PEOPLE} from "../../store/actions";
import queryString from 'query-string';

function People(props) {
  const location = useLocation();
  const {drizzle} = props;
  const {dispatch} = drizzle.store;
  const {staff} = drizzle.store.getState();
  const {owners, barkeepers, partyPeople} = staff;

  useEffect(() => {
    let {invite} = queryString.parse(location.search);
    let statePeople = !!invite ? invite.split(",") : [];
    statePeople.map(async person => {
      dispatch({type: NEW_PEOPLE, payload: {person}});
    });
  }, [location.search, dispatch]);

  const ownerS = partyPeople.filter(item => owners.indexOf(item.address) > -1);
  const barkeeperS = partyPeople.filter(item => barkeepers.indexOf(item.address) > -1);
  return <>
    <Col span={8}>
      <StyledGroupCard title="Owners" bordered={false}>
        {owners.length === 0 && <div>
          Who should manage this bar without owners? Invite them!
        </div>}
        {ownerS.map(owner => (<Person role="owner" person={owner} {...props} key={"owner" + owner.address}/>))}
      </StyledGroupCard>
    </Col>
    <Col span={8}>
      <StyledGroupCard title="Barkeepers" bordered={false}>
        {barkeepers.length === 0 && <div>
          Where should we get beer without barkeepers? Invite them!
        </div>}
        {barkeeperS.map(barKeeper => (
          <Person role="barkeeper" person={barKeeper} {...props} key={"barKeeper" + barKeeper.address}/>))}
      </StyledGroupCard>
    </Col>
    <Col span={8}>
      <StyledGroupCard title="DJs" bordered={false}>
      </StyledGroupCard>
    </Col>
    <Col span={24}>
      <StyledGroupCard title="Party People" bordered={false} className="partyPeople">
        {partyPeople.length === 0 && <div>
          No-one here to party :/ Invite someone!
        </div>}
        {partyPeople.map(p => (<Person role="person" person={p} {...props} key={"partyPeople" + p.address}/>))}
      </StyledGroupCard>
    </Col>
  </>;
}

export default People;