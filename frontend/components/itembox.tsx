import { Button, Input, Checkbox, Form, Card, Col, Row, Skeleton } from "antd";
import LinesEllipsis from 'react-lines-ellipsis'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { connect } from "react-redux";
import _ from 'lodash'
import styled from 'styled-components';
import mainStyle from '../styles/mainStyle';

const ItemBox = (props: any) => {
  let mode = props.mode;
  const [btntext,setBtntext] = useState(mode == 'join' ? 'Join' : mode == 'own' ? 'Delete' : 'Leave');
  const [btndisable,setBtndisable] = useState(true);
  const [loadings, setLoadings] = useState([]);

  const StyleButton = styled(Button)`
    --btncolor: ${mode !== 'join' ? mainStyle.dangerColor : mainStyle.primaryColor};
    width: 100%;
    background-color: var(--btncolor);
    border-color: var(--btncolor);
    color: white;
  `;

  const BottomCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  const checkJoin = () =>{
    let check = true ;
    if(mode == 'join'){
      check = props.data.registered >= props.data.maxguests ? true : false;
      if(_.includes(props.post.users.user.party_joined,props.data.partyId)){
        check = true;
        setBtntext('Joined');
      }
      
    }
    else{
      check = false
    }
    setBtndisable(check);
  }

  useEffect(() =>{
    checkJoin();
  },[])

  const enterLoading = async (index: number) => {

    setLoadings((prevLoadings) => {
      const newLoadings: any = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings: any = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 3000);

  };

  const AlertMsg = () => {

    let alerttitle = mode == 'join' ? 'คุณแน่ใจว่าต้องการร่วมปาร์ตี้นี้?' : 
                mode == 'own' ? 'คุณแน่ใจว่าต้องการลบปาร์ตี้นี้?' : 
                mode == 'joined' ? 'คุณแน่ใจว่าต้องการออกจากปาร์ตี้นี้?' : '';

    let alertsuccess = mode == 'join' ? 'เข้าร่วมปาร์ตี้สำเร็จ' : 
                mode == 'own' ? 'ลบปาร์ตี้สำเร็จ' : 
                mode == 'joined' ? 'ออกจากปาร์ตี้สำเร็จ' : '';

    Swal.fire({
      title: alerttitle,
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: mainStyle.dangerColor,
      cancelButtonColor: mainStyle.primaryColor,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await enterLoading(0);

          if (mode == 'join') {
            console.log('Join party ' + props.data.partyId)
            setBtntext('Joined')
            setBtndisable(true)
            props.joinParty(props.data.partyId)
          }
          else if (mode == 'own') {
            await props.deleteParty(props.data.partyId)
          }
          else if (mode == 'joined') {
            props.leaveParty(props.data.partyId)
            console.log('Leave party ' + props.data.partyId)
          }

          Swal.fire(
            alertsuccess
          )
      }
    })
  }

    return(
    <Col span={6} xl={6} md={12} xs={24}>
      <Card
        style={{
          // width: 300,
        }}
        cover={
          // <div>
          //   <Skeleton.Image active={false} style={{width: 'auto', inlineSize: '-webkit-fill-available'}} />
          // </div>
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
        actions={[
        ]}
      >
      <div>
      <LinesEllipsis
        text={props.data.description}
        maxLine='3'
        ellipsis='...'
        trimRight
        basedOn='letters'
      />
      </div>
      <hr></hr>
      <BottomCard>
        <div>
          {props.data.registered}/{props.data.maxguests}
        </div>
        <div>
          <StyleButton
            disabled={btndisable}
            onClick={() => AlertMsg()}
            loading={loadings[0]}
          >{btntext}</StyleButton>
        </div>
      </BottomCard>
      </Card>
    </Col>
    )
}

const mapStateToProps = (state: any) => ({ post: state })

export default connect(mapStateToProps)(ItemBox)