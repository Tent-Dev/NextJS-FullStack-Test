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
import HeaderBar from '../components/header';
import InfiniteScroll from 'react-infinite-scroll-component';

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
  const [hasmore,Sethasmore] = useState(true);
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
      fetchData();
    }, 1000)
  },[])

  const updateData = (id: number) =>{
    let datastore = dataparty;
    console.log('Update data ' + id);
    const newData = datastore.findIndex( (obj: { id: number; }) => obj.id == id);

    datastore[newData].registered = datastore[newData].registered+1
    Setdataparty(datastore);
  }

  const fetchData = async () =>{
    Setdataparty(dataDummy);

    setTimeout(() =>{
      Sethasmore(false);
    }, 2000)
    
  }

  return(
    <>
      <HeaderBar
        headerText='สร้างปาร์ตี้'
        childElement={
          <>
            <Button className={`${myStyles.cbutton}`} type="primary" icon={<AiOutlinePlus />} onClick={() => clickCreate()} size={'large'} />
            <Button className={`${myStyles.cbutton}`} type="default" icon={<AiOutlineLogout />} onClick={() => clickLogout()} size={'large'} style={{'marginLeft': 10}} />
          </>
        }
      />
      <div className={styles.container}>
        <main className={styles.main}>


        <InfiniteScroll
          dataLength={dataparty.length} //This is important field to render the next data
          next={fetchData}
          hasMore={hasmore}
          loader={<div style={{'textAlign': 'center', 'marginTop': 24}}><Spin indicator={antIcon} size='large'/></div>}
          endMessage={
            <p style={{ textAlign: 'center', 'marginTop': 24, 'color': 'gray' }}>
              <b>ผลลัพธ์การค้นหาสิ้นสุดแล้ว</b>
            </p>
          }
          // below props only if you need pull down functionality
          // refreshFunction={fetchData}
          // pullDownToRefresh
          // pullDownToRefreshThreshold={50}
          // pullDownToRefreshContent={
          //   <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
          // }
          // releaseToRefreshContent={
          //   <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
          // }
          style={{ overflow: 'hidden' }}
        >
          <Row gutter={[16, 16]}>
            {dataparty.map((element: { id: any; }) => (
              <ItemBox data={element} key={element.id} updateData={updateData}/>
            ))}
          </Row>
        </InfiniteScroll>



          {/* <div style={{ 'display': 'flex', 'flexWrap': 'wrap', 'gap': 10 }}> */}
          {/* {showspin ? <Spin indicator={antIcon} size='large'/> : <></> }
          {dataparty.length == 0 && !showspin ? <Empty description='ไม่พบราการปาร์ตี้' /> :
            <Row gutter={[16, 16]}>
              {dataparty.map((element: { id: any; }) => (
                <ItemBox data={element} key={element.id} updateData={updateData}/>
              ))}
            </Row>
          } */}
          {/* </div> */}
        </main>
      </div>
    </>
  )
}

export default HomeApp