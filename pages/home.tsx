import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { AiOutlinePlus, AiOutlineLogout } from "react-icons/ai";
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { Button, Input, Checkbox, Form, Card, PageHeader, Row } from "antd";
import myStyles from '../styles/MyComponent.module.css'
import ItemBox from '../components/itembox'
import dataDummy from '../components/dummydata'
import { useEffect, useState } from 'react';
import { Spin, Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);


const HomeApp: NextPage = () => {
  const [dataparty,Setdataparty]: any[] = useState([]);
  const [showspin,Setshowspin] = useState(true);
  const router = useRouter();
  const clickCreate = () =>{
    router.push('/create')
  }

  const clickLogout = () =>{
    router.push('/')
  }

  useEffect(() =>{
    setTimeout(() => {
      Setshowspin(false)
      Setdataparty(dataDummy);
    }, 1000)
  },[])

  return(
    <>
      <PageHeader
        className="site-page-header"
        // title="ปาร์ตี้ทั้งหมด"
        style={{
          'backgroundColor': '#1d004f',
        }}
        children={
        <>
        <div style={{'display':'flex', 'alignItems' : 'center', 'justifyContent': 'center'}}>
          <div style={{'margin' : 'auto'}}>
            <p style={{'color': 'white', 'textAlign': 'center', 'fontSize': 20, 'marginBottom': 0}}>ปาร์ตี้ทั้งหมด</p>
          </div>
          <div style={{'position': 'absolute', 'right': 0, 'marginRight': 10}}>
          <Button className={`${myStyles.cbutton}`} type="primary" icon={<AiOutlinePlus />} onClick={() => clickCreate()} size={'large'} />
          <Button className={`${myStyles.cbutton}`} type="default" icon={<AiOutlineLogout />} onClick={() => clickLogout()} size={'large'} style={{'marginLeft': 10}} />
            </div>
        </div>
        </>
      }
      />
      <div className={styles.container}>
        <main className={styles.main}>
          {/* <div style={{ 'display': 'flex', 'flexWrap': 'wrap', 'gap': 10 }}> */}
          {showspin ? <Spin indicator={antIcon} size='large'/> : <></> }
          {dataparty.length == 0 && !showspin ? <Empty description='ไม่พบราการปาร์ตี้' /> :
            <Row gutter={[16, 16]}>
              {dataparty.map((element: { id: any; }) => (
                <ItemBox data={element} key={element.id} />
              ))}
            </Row>
          }
          {/* </div> */}
        </main>
      </div>
    </>
  )
}

export default HomeApp