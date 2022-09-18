import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Input, Checkbox, Form, Card, Col, Row } from "antd";
import myStyles from '../styles/MyComponent.module.css'
import LinesEllipsis from 'react-lines-ellipsis'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const ItemBox = (props: any) => {
  let mode = props.mode;
  const [btntext,setBtntext] = useState(mode == 'join' ? 'Join' : mode == 'own' ? 'Delete' : 'Leave');
  const [btndisable,setBtndisable] = useState(true);
  const [loadings, setLoadings] = useState([]);

  

  const clickBtn = async () =>{
    AlertMsg();
  }

  const checkJoin = () =>{
    let check = true ;
    if(mode == 'join'){
      check = props.data.registered >= props.data.maxguests ? true : false;
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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await enterLoading(0);
        setTimeout(() => {

          if (mode == 'join') {
            console.log('Join party ' + props.data.id)
            setBtntext('Joined')
            setBtndisable(true)
            props.updateData(props.data.id)
          }
          else if (mode == 'own') {
            console.log('Delete party ' + props.data.id)
          }
          else if (mode == 'joined') {
            console.log('Leave party ' + props.data.id)
          }

          Swal.fire(
            alertsuccess
          )

          // props.data.registered = props.data.registered+1;
        }, 3000)
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
      <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
        <div>
          {props.data.registered}/{props.data.maxguests}
        </div>
        <div>
          <Button
            className={`${myStyles.cbutton} ${mode !== 'join' ? myStyles.cbutton_red : ''}`}
            disabled={btndisable}
            onClick={() => AlertMsg()}
            loading={loadings[0]}
          >{btntext}</Button>
        </div>
      </div>
      </Card>
    </Col>
    )
}

export default ItemBox