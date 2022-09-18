import { Button, Row } from 'antd';
import type { NextPage } from 'next'
import HeaderBar from '../components/header';
import myStyles from '../styles/MyComponent.module.css'
import styles from '../styles/Home.module.css'
import { AiOutlinePlus } from "react-icons/ai";
import router from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import dataDummy from '../components/dummydata'
import ItemBox from '../components/itembox';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );
  
const MyPartyList: NextPage = (props: any) => {

    const [dataparty,Setdataparty]: any[] = useState([]);
    const [showspin,Setshowspin] = useState(true);
    const [hasmore,Sethasmore] = useState(true);
    const [dataType, Setdatatype] = useState('own');

    const mydummy = [
        {
            id: 0,
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
            registered: 5,
            maxguests: 5,
            image: ''
          },
          {
            id: 1,
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
            registered: 1,
            maxguests: 5,
            image: ''
          }
    ];

    const myOwndummy = [
        {
            id: 0,
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
            registered: 4,
            maxguests: 5,
            image: ''
          }
    ];

    useEffect(() =>{
        setTimeout(() => {
            Setshowspin(false)
            fetchData();
        }, 1000)
        },[dataType])

    const clickCreate = () =>{
        router.push('/create')
    }

    const fetchData = async () =>{
        Setdataparty(dataType == 'joined' ? mydummy : myOwndummy);
    
        setTimeout(() =>{
          Sethasmore(false);
        }, 2000)
    }

    const updateData = (id: number) =>{
    let datastore = dataparty;
    console.log('Update data ' + id);
    const newData = datastore.findIndex( (obj: { id: number; }) => obj.id == id);

    datastore[newData].registered = datastore[newData].registered+1
    Setdataparty(datastore);
  }

  const renderOwnPartyComponent = () =>{
    return(
        <div className={styles.container}>
            <main className={styles.main}>
                {showspin ?
                    <Spin indicator={antIcon} size='large'/>
                :
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
                        <ItemBox mode={dataType} data={element} key={element.id} updateData={updateData}/>
                        ))}
                    </Row>
            </InfiniteScroll>
                }
            </main>
        </div>
    )
  }

    return(
        <>
            <HeaderBar
                headerText='รายการปาร์ตี้ของฉัน'
                backBtn={true}
                childElement={
                    <>
                      <Button className={`${myStyles.cbutton}`} type="primary" icon={<AiOutlinePlus />} onClick={() => clickCreate()} size={'large'} />
                    </>
                }
            />

            <Tabs
                defaultActiveKey="1"
                // type="card"
                size={'small'}
                centered={true}
                onTabClick={(key) => {Setdatatype(key), Setshowspin(true), console.log(key)}}
                items={[
                    {
                        label: `ปาร์ตี้ที่ฉันสร้าง`,
                        key: 'own',
                        children: renderOwnPartyComponent()
                    },
                    {
                        label: `ปาร์ตี้ที่ฉันเข้าร่วม`,
                        key: 'joined',
                        children: renderOwnPartyComponent()
                    }
                ]
                }
            />
        </>
    )

}

export default MyPartyList;