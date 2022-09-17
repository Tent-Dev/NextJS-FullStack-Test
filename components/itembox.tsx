import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Input, Checkbox, Form, Card, Col, Row } from "antd";
import myStyles from '../styles/MyComponent.module.css'
import LinesEllipsis from 'react-lines-ellipsis'
import { useEffect, useState } from 'react'

const ItemBox = (props: any) => {

  const [btntext,setBtntext] = useState('Join');
  const [btndisable,setBtndisable] = useState(true);
  const [loadings, setLoadings] = useState([]);

  const clickJoin = async () =>{

    await enterLoading(0);

    setTimeout(() =>{
      console.log('Join party ' + props.data.id);
      setBtntext('Joined');
      setBtndisable(true);

      // props.data.registered = props.data.registered+1;

      props.updateData(props.data.id);
     }, 3000)
  }

  const checkJoin = () =>{
    let check = props.data.registered >= props.data.maxguests ? true : false;
    setBtndisable(check);
    console.log('dd')
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
            className={`${myStyles.cbutton}`}
            disabled={btndisable}
            onClick={() => clickJoin()}
            loading={loadings[0]}
          >{btntext}</Button>
        </div>
      </div>
      </Card>
    </Col>
    )
}

export default ItemBox